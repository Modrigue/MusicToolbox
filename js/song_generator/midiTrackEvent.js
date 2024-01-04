"use strict";
const headerEndTrack = [0xFF, 0x2F, 0x00];
const headerTempo = [0xFF, 0x51, 0x03];
const headerTimeSignature = [0xFF, 0x58, 0x04];
// links:
// https://www.cs.cmu.edu/~music/cmsip/readings/MIDI%20tutorial%20for%20programmers.html
class MidiTrackEvent {
    constructor(deltaTime, data, type, auxValue = 0) {
        this.Type = type;
        this.DeltaTime = deltaTime;
        this.Data = data;
        this.AuxValue = auxValue;
    }
    Length() {
        const bytes = this.ToBytes();
        //console.log("Length = " + bytes.length);
        return bytes.length;
    }
    ToBytes() {
        const arrayLength = ToVariableLengthBytes(this.DeltaTime);
        //console.log(this.DeltaTime);
        let bytesLength = Uint8Array.from(arrayLength).reverse(); // big endian
        //DisplayHexBytesArray(bytesLength);
        let bytesData = Uint8Array.from(this.Data);
        //DisplayHexBytesArray(bytesData);
        let bytes = new Uint8Array([...bytesLength, ...bytesData]);
        //DisplayHexBytesArray(bytes);
        return bytes;
    }
}
function EndTrackEvent() {
    return new MidiTrackEvent(0, headerEndTrack, MidiTrackEventType.END_TRACK);
}
function TempoEvent(bpm, deltaTime) {
    const tempoDuration = 60000000 / bpm; // in microseconds per quarter note
    const bytesDuration = ToBytesInt24(tempoDuration);
    //DisplayHexBytesArray(bytesDuration);
    const bytesDurationArray = [bytesDuration[0], bytesDuration[1], bytesDuration[2]];
    const tempoArray = headerTempo.concat(bytesDurationArray);
    //displayHexArray(tempoArray);
    return new MidiTrackEvent(deltaTime, tempoArray, MidiTrackEventType.TEMPO, bpm);
}
function TimeSignatureEvent(numerator, denominator, deltaTime) {
    const tsValuesArray = [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x08];
    const tsArray = headerTimeSignature.concat(tsValuesArray);
    //displayHexArray(tsArray);
    return new MidiTrackEvent(deltaTime, tsArray, MidiTrackEventType.TIME_SIGNATURE);
}
function NoteOnTrackEvent(channel, note, deltaTime, velocity) {
    const start = 0x90 + (channel & 0xF); // note on event = "9" + <channel_nibble>
    const data = [start, note, velocity];
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.NOTE_ON);
}
function NoteOffTrackEvent(channel, note, deltaTime) {
    const start = 0x80 + (channel & 0xF); // note off event = "8" + <channel_nibble>
    const data = [start, note, 0 /*velocity*/];
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.NOTE_OFF);
}
function InstrumentEvent(channel, instrumentId, deltaTime) {
    const start = 0xC0 + (channel & 0xF);
    const data = [start, instrumentId - 1];
    //console.log(DisplayHexArray(data));
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.INSTRUMENT, instrumentId);
}
function PitchBendEvent(channel, cents, deltaTime) {
    const start = 0xE0 + (channel & 0xF);
    const valuesArray = Array.from(ToPitchBendBytes(cents));
    const data = [start].concat(valuesArray);
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.PICTH_BEND, cents);
}
function ControlChangeEntrySliderEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 6, refParam];
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_ENTRY_SLIDER);
}
function ControlChangeVolumeEvent(channel, volume = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 7, volume];
    //console.log(DisplayHexArray(data));
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_ENTRY_SLIDER);
}
function ControlChangeFineEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 100, refParam];
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_FINE);
}
function ControlChangeCoarseEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 101, refParam];
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_COARSE);
}
//# sourceMappingURL=midiTrackEvent.js.map
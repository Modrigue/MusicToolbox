"use strict";
const endTrackEventData = [0xFF, 0x2F, 0x00];
class MidiTrackEvent {
    constructor(deltaTime, data) {
        this.DeltaTime = deltaTime;
        this.Data = data;
    }
    Length() {
        const bytes = this.ToBytes();
        //console.log("Length = " + bytes.length);
        return bytes.length;
    }
    ToBytes() {
        const arrayLength = ToVariableLengthQuantity(this.DeltaTime);
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
    return new MidiTrackEvent(0, endTrackEventData);
}
function TempoEvent(bpm, deltaTime) {
    const tempoDuration = 60000000 / bpm; // in microseconds per quarter note
    const bytesDuration = ToBytesInt24(tempoDuration);
    //DisplayHexBytesArray(bytesDuration);
    const bytesDurationArray = [bytesDuration[0], bytesDuration[1], bytesDuration[2]];
    const tempoHeaderArray = [0xFF, 0x51, 0x03];
    const tempoArray = tempoHeaderArray.concat(bytesDurationArray);
    //displayHexArray(tempoArray);
    return new MidiTrackEvent(deltaTime, tempoArray);
}
function TimeSignatureEvent(numerator, denominator, deltaTime) {
    const tsHeaderArray = [0xFF, 0x58, 0x04];
    const tsValuesArray = [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x08];
    const tsArray = tsHeaderArray.concat(tsValuesArray);
    //displayHexArray(tsArray);
    return new MidiTrackEvent(deltaTime, tsArray);
}
function NoteOnTrackEvent(channel, note, deltaTime, velocity) {
    const start = 0x90 + (channel & 0xF); // note on event = "9" + <channel_nibble>
    const data = [start, note, velocity];
    return new MidiTrackEvent(deltaTime, data);
}
function NoteOffTrackEvent(channel, note, deltaTime) {
    const start = 0x80 + (channel & 0xF); // note off event = "98" + <channel_nibble>
    const data = [start, note, 0 /*velocity*/];
    return new MidiTrackEvent(deltaTime, data);
}
function PitchBendEvent(channel, cents, deltaTime) {
    const start = 0xE0 + (channel & 0xF);
    const valuesArray = Array.from(ToPitchBendBytes(cents));
    const data = [start].concat(valuesArray);
    return new MidiTrackEvent(deltaTime, data);
}
function ControlChangeFineEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 100, refParam];
    return new MidiTrackEvent(0, data);
}
function ControlChangeCoarseEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 101, refParam];
    return new MidiTrackEvent(0, data);
}
function ControlChangeEntrySliderEvent(channel, refParam = 0) {
    const start = 0xB0 + (channel & 0xF);
    const data = [start, 6, refParam];
    return new MidiTrackEvent(0, data);
}
//# sourceMappingURL=midiTrackEvent.js.map
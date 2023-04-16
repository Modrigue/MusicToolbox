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
        const arrayLength = toVariableLengthQuantity(this.DeltaTime);
        //console.log(this.DeltaTime);
        let bytesLength = Uint8Array.from(arrayLength).reverse(); // big endian
        //displayHexBytesArray(bytesLength);
        let bytesData = Uint8Array.from(this.Data);
        //displayHexBytesArray(bytesData);
        let bytes = new Uint8Array([...bytesLength, ...bytesData]);
        //displayHexBytesArray(bytes);
        return bytes;
    }
}
function EndTrackEvent() {
    return new MidiTrackEvent(0, endTrackEventData);
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
function TempoEvent(bpm) {
    const tempoDuration = 60000000 / bpm; // in microseconds per quarter note
    const bytesDuration = toBytesInt24(tempoDuration);
    //displayHexBytesArray(bytesDuration);
    const bytesDurationArray = [bytesDuration[0], bytesDuration[1], bytesDuration[2]];
    const tempoHeaderArray = [0xFF, 0x51, 0x03];
    const tempoArray = tempoHeaderArray.concat(bytesDurationArray);
    //displayHexArray(tempoArray);
    return new MidiTrackEvent(0, tempoArray);
}
// incomplete
function TimeSignatureEvent(numerator, denominator) {
    const tsHeaderArray = [0xFF, 0x58, 0x04];
    const tsValuesArray = [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x08];
    const tsArray = tsHeaderArray.concat(tsValuesArray);
    //displayHexArray(tsArray);
    return new MidiTrackEvent(0, tsArray);
}
//# sourceMappingURL=midiTrackEvent.js.map
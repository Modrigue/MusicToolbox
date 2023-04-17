"use strict";
class MidiTrack {
    constructor(channel) {
        this.Type = "MTrk";
        this.Events = new Array();
        this.channel = channel;
        // add end of track event
        this.AddEvent(EndTrackEvent());
    }
    AddEvent(event) {
        if (this.Events == null)
            this.Events = new Array();
        const length = this.Events.length;
        if (length == 0)
            this.Events.push(event);
        else {
            // insert before end of track event
            this.Events.splice(length - 1, 0, event);
        }
    }
    Length() {
        let length = 0;
        for (const event of this.Events)
            length += event.Length();
        return length;
    }
    ToBytes() {
        let utf8Encode = new TextEncoder();
        let typeBytes = utf8Encode.encode(this.Type);
        //displayHexBytesArray(typeBytes);
        let lengthBytes = ToBytesInt32(this.Length());
        //console.log("Length = " + this.Length());
        //displayHexBytesArray(lengthBytes);
        let trackBytes = new Uint8Array([...typeBytes, ...lengthBytes]);
        // append events
        for (const event of this.Events) {
            const eventBytes = event.ToBytes();
            trackBytes = new Uint8Array([...trackBytes, ...eventBytes]);
        }
        return trackBytes;
    }
    NoteOn(note, deltaTime, velocity) {
        const event = NoteOnTrackEvent(this.channel - 1, note, deltaTime, velocity);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    NoteOff(note, deltaTime) {
        const event = NoteOffTrackEvent(this.channel - 1, note, deltaTime);
        this.AddEvent(event);
    }
    ControlChangeFine(refParam = 0) {
        const event = ControlChangeFineEvent(this.channel - 1, refParam);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeCoarse(refParam = 0) {
        const event = ControlChangeCoarseEvent(this.channel - 1, refParam);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeEntrySlider(refParam = 0) {
        const event = ControlChangeEntrySliderEvent(this.channel - 1, refParam);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    Tempo(bpm, deltaTime) {
        const event = TempoEvent(bpm, deltaTime);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    TimeSignature(numerator, denominator, deltaTime) {
        const event = TimeSignatureEvent(numerator, denominator, deltaTime);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
}
//# sourceMappingURL=midiTrack.js.map
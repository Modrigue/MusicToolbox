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
        let lengthBytes = toBytesInt32(this.Length());
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
        const event = NoteOnTrackEvent(this.channel, note, deltaTime, velocity);
        this.AddEvent(event);
    }
    NoteOff(note, deltaTime) {
        const event = NoteOffTrackEvent(this.channel, note, deltaTime);
        this.AddEvent(event);
    }
    Tempo(bpm) {
        const event = TempoEvent(bpm);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    TimeSignature(numerator, denominator) {
        const event = TimeSignatureEvent(numerator, denominator);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
}
//# sourceMappingURL=midiTrack.js.map
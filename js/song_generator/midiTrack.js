"use strict";
class MidiTrack {
    constructor(channel) {
        this.Type = "MTrk";
        this.Events = new Array();
        this.channel = channel;
        this.Muted = false;
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
        //DisplayHexBytesArray(typeBytes);
        let lengthBytes = ToBytesInt32(this.Length());
        //console.log("Length = " + this.Length());
        //DisplayHexBytesArray(lengthBytes);
        let trackBytes = new Uint8Array([...typeBytes, ...lengthBytes]);
        // append events
        for (const event of this.Events) {
            const eventBytes = event.ToBytes();
            trackBytes = new Uint8Array([...trackBytes, ...eventBytes]);
        }
        return trackBytes;
    }
    Tempo(bpm, deltaTime) {
        const event = TempoEvent(bpm, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    // update existing tempo event
    UpdateTempo(bpmNew, tempoEventIndex) {
        let indexTempo = 0;
        let index = 0;
        for (let event of this.Events) {
            if (event.Type == MidiTrackEventType.TEMPO) {
                if (indexTempo == tempoEventIndex) {
                    const deltaTime = event.DeltaTime;
                    this.Events[index] = TempoEvent(bpmNew, deltaTime); // replace event
                    //console.log(event);
                    //console.log(this.Events);
                    break;
                }
                indexTempo++;
            }
            index++;
        }
    }
    TimeSignature(numerator, denominator, deltaTime) {
        const event = TimeSignatureEvent(numerator, denominator, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    NoteOn(note, deltaTime, velocity) {
        const event = NoteOnTrackEvent(this.channel - 1, note, deltaTime, velocity);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    NoteOff(note, deltaTime) {
        const event = NoteOffTrackEvent(this.channel - 1, note, deltaTime);
        this.AddEvent(event);
    }
    PitchBend(cents, deltaTime) {
        const event = PitchBendEvent(this.channel - 1, cents, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeFine(refParam = 0) {
        const event = ControlChangeFineEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeCoarse(refParam = 0) {
        const event = ControlChangeCoarseEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeEntrySlider(refParam = 0) {
        const event = ControlChangeEntrySliderEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    GetNbNotes() {
        // count NoteOn events
        let nbNotes = 0;
        for (const event of this.Events)
            if (event.Type == MidiTrackEventType.NOTE_ON)
                nbNotes++;
        // fallback if not found
        return nbNotes;
    }
    GetNoteValue(index) {
        // get note by NoteOn index event
        let indexCur = 0;
        for (const event of this.Events) {
            if (event.Type == MidiTrackEventType.NOTE_ON) {
                if (indexCur == index)
                    return event.Data[1];
                indexCur++;
            }
        }
        // fallback if not found
        return -1;
    }
}
//# sourceMappingURL=midiTrack.js.map
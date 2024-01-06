"use strict";
class MidiTrack {
    constructor(channel) {
        this.Type = "MTrk";
        this.Events = new Array();
        this.Channel = channel;
        this.InstrumentId = 1; // default, piano
        this.UpdateInstrument(this.InstrumentId);
        this.Volume = 80;
        this.Muted = false;
        // add end of track event
        this.AddEvent(EndTrackEvent());
        // add instrument event
        this.AddEvent(InstrumentEvent(channel, this.InstrumentId, 0));
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
        const event = NoteOnTrackEvent(this.Channel - 1, note, deltaTime, velocity);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    NoteOff(note, deltaTime) {
        const event = NoteOffTrackEvent(this.Channel - 1, note, deltaTime);
        this.AddEvent(event);
    }
    PitchBend(cents, deltaTime) {
        const event = PitchBendEvent(this.Channel - 1, cents, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeEntrySlider(refParam = 0) {
        const event = ControlChangeEntrySliderEvent(this.Channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeVolume(volume = 0) {
        const event = ControlChangeVolumeEvent(this.Channel - 1, volume);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeFine(refParam = 0) {
        const event = ControlChangeFineEvent(this.Channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
    ControlChangeCoarse(refParam = 0) {
        const event = ControlChangeCoarseEvent(this.Channel - 1, refParam);
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
        for (const event of this.Events)
            if (event.Type == MidiTrackEventType.NOTE_ON) {
                if (indexCur == index)
                    return event.Data[1];
                indexCur++;
            }
        // fallback if not found
        return -1;
    }
    UpdateInstrument(instrumentId = 1) {
        this.InstrumentId = instrumentId;
        MIDI.channels[this.Channel].program = instrumentId - 1;
        // update instrument event
        let index = 0;
        for (let event of this.Events) {
            if (event.Type == MidiTrackEventType.INSTRUMENT) {
                const deltaTime = event.DeltaTime;
                event = InstrumentEvent(this.Channel, instrumentId, deltaTime);
                this.Events[index] = event;
            }
            index++;
        }
    }
}
function AddNoteMonoValueEvent(track, noteValue, start, duration) {
    const note = GetNoteFromValue(noteValue);
    const octave = GetOctaveFromValue(noteValue);
    AddNoteMonoEvent(track, note, octave, start, duration);
}
function AddNoteMonoEvent(track, note, octave, start, duration) {
    const vel = 102;
    let noteValue = GetNoteValueFromNoteOctave(note, octave);
    let noteValueInt = ToNoteValueInt(noteValue);
    // handle pitch bend if specified
    let cents = ToNoteValueCents(noteValue);
    const hasPitchBend = (cents != 0);
    if (hasPitchBend)
        track.PitchBend(cents, 0);
    track.NoteOn(noteValueInt, start, vel);
    track.NoteOff(noteValueInt, duration);
    if (hasPitchBend)
        track.PitchBend(0, 0);
}
// chords
function AddChordValuesEvent(track, notesValues, cents, start, duration) {
    const vel = 102;
    // handle pitch bend if specified
    const hasPitchBend = (cents != 0);
    if (hasPitchBend)
        track.PitchBend(cents, 0);
    let index = 0;
    for (const noteValue of notesValues) {
        const noteStart = (index == 0) ? start : 0;
        track.NoteOn(ToNoteValueInt(noteValue), noteStart, vel);
        index++;
    }
    index = 0;
    for (const noteValue of notesValues) {
        const noteDuration = (index == 0) ? duration : 0;
        track.NoteOff(ToNoteValueInt(noteValue), noteDuration);
        index++;
    }
    if (hasPitchBend)
        track.PitchBend(0, 0);
}
function AddChordValuesOnEvent(track, notesValues, cents, start) {
    const vel = 102;
    // handle pitch bend if specified
    const hasPitchBend = (cents != 0);
    if (hasPitchBend)
        track.PitchBend(cents, 0);
    let index = 0;
    for (const noteValue of notesValues) {
        const noteStart = (index == 0) ? start : 0;
        track.NoteOn(ToNoteValueInt(noteValue), noteStart, vel);
        index++;
    }
}
function AddChordValuesOffEvent(track, notesValues, cents, duration) {
    const vel = 102;
    // handle pitch bend if specified
    const hasPitchBend = (cents != 0);
    let index = 0;
    for (const noteValue of notesValues) {
        const noteDuration = (index == 0) ? duration : 0;
        track.NoteOff(ToNoteValueInt(noteValue), noteDuration);
        index++;
    }
    if (hasPitchBend)
        track.PitchBend(0, 0);
}
//# sourceMappingURL=midiTrack.js.map
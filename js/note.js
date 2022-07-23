"use strict";
class Note {
    constructor(value, octave, length, time) {
        // constant for now
        this.velocity = 96;
        this.volume = 60;
        this.value = value;
        this.octave = octave;
        this.length = length;
        this.time = time;
    }
    Play() {
        const noteValue = this.value + 12 * (this.octave + 2);
        const noteValueInt = Math.floor(noteValue); // the MIDI note (Ex.: 48 = C2)
        const noteStart = this.time;
        const noteEnd = this.time + this.length;
        // compute pitch bend if non-integer value
        let pitchBend = noteValue - Math.floor(noteValue);
        pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone
        // play the note
        MIDI.setVolume(0, this.volume);
        MIDI.noteOn(0, noteValueInt, this.velocity, noteStart, pitchBend);
        MIDI.noteOff(0, noteValueInt, noteEnd);
    }
}
//# sourceMappingURL=note.js.map
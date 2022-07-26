"use strict";
class Note {
    constructor(value, octave, length, time) {
        // constant for now
        this.velocity = 96;
        this.volume = 60;
        this.noteValue = value + 12 * (octave + 2);
        this.length = length;
        this.time = time;
    }
    Play(tempo) {
        const noteValueInt = Math.floor(this.noteValue); // the MIDI note (Ex.: 48 = C2)
        const tempoFactor = 60 / tempo;
        const noteStart = this.time * tempoFactor;
        const noteEnd = (this.time + this.length) * tempoFactor;
        // compute pitch bend if non-integer value
        let pitchBend = this.noteValue - Math.floor(this.noteValue);
        pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone
        // play the note
        MIDI.setVolume(0, this.volume);
        MIDI.noteOn(0, noteValueInt, this.velocity, noteStart, pitchBend);
        MIDI.noteOff(0, noteValueInt, noteEnd);
    }
    Transpose(interval) {
        this.noteValue += interval;
    }
    // for debug purposes only
    LogText() {
        return `{${getNoteName(this.Value())}${this.Octave()}, ${this.time}, ${this.length}}`;
    }
    // returns note value in [0; 12[
    Value() {
        return (this.noteValue % 12);
    }
    Octave() {
        return (Math.floor(this.noteValue / 12) - 2);
    }
}
//# sourceMappingURL=note.js.map
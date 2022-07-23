class Note
{
    value: number;  // in [0; 12[
    octave: number; // integer
    length: number;
    time: number;

    // constant for now
    velocity: number = 96;
    volume: number = 60;
    
    constructor(value: number, octave: number, length: number, time: number)
    {
        this.value = value;
        this.octave = octave;
        this.length = length;
        this.time = time;
    }

    public Play(): void
    {
        const noteValue = this.value + 12*(this.octave + 2);
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
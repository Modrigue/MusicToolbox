class Note
{
    noteValue : number; // note + octave value
    length: number;     // seconds
    time: number;       // quarter notes

    // constant for now
    velocity: number = 96;
    volume: number = volumePlay;
    
    constructor(value: number, octave: number, length: number, time: number)
    {
        this.noteValue = value + 12*(octave + 2);
        this.length = length;
        this.time = time;
    }

    public Play(tempo: number): void
    {
        const noteValueInt = Math.floor(this.noteValue); // the MIDI note (Ex.: 48 = C2)
        
        const tempoFactor = 60 / tempo;

        const noteStart = this.time*tempoFactor;
        const noteEnd = (this.time + this.length)*tempoFactor;

        // compute pitch bend if non-integer value
        let pitchBend = this.noteValue - Math.floor(this.noteValue);
        pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

        // play the note
        MIDI.setVolume(channelPlay, this.volume);
        MIDI.noteOn(channelPlay, noteValueInt, this.velocity, noteStart, pitchBend);
        MIDI.noteOff(channelPlay, noteValueInt, noteEnd);
    }

    public Transpose(interval: number): void
    {
        this.noteValue += interval;
    }

    public Text(): string
    {
        return `${getNoteName(this.Value())}${this.Octave()}`;
    }

    // for debug purposes only
    public LogText(): string
    {
        return `{${getNoteName(this.Value())}${this.Octave()}, ${this.time}, ${this.length}}`;
    }

    // returns note value in [0; 12[
    public Value(): number
    {
        return (this.noteValue % 12);
    }

    public Octave(): number
    {
        return (Math.floor(this.noteValue / 12) - 2);
    }
}
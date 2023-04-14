// from https://www.youtube.com/watch?v=VeV4gyjyqSg

class MidiFile
{
    Header: MidiHeader;
    Tracks : Array<MidiTrack>;

    constructor(format: number, nbTracks: number, division: number)
    {
        this.Header = new MidiHeader(format, nbTracks, division);

        this.Tracks = new Array<MidiTrack>();
        for (let i = 0; i < nbTracks; i++)
        {
            const track = new MidiTrack(i);
            this.Tracks.push(track);
        }
    }

    //constructor(format: number, tracks: Array<MidiTrack>, division: number)
    //{
    //    this.Header = new MidiHeader(format, tracks.length, division);
    //    this.Tracks = tracks;
    //}

    public NoteOn(trackIndex: number, deltaTime: number, note: number, velocity: number)
    {
        this.Tracks[trackIndex].NoteOn(note, deltaTime, velocity);
    }

    public NoteOff(trackIndex: number, deltaTime: number, note: number)
    {
        this.Tracks[trackIndex].NoteOff(note, deltaTime);
    }

    public NotesOn(trackIndex: number, deltaTime: number, notes: Array<number>, velocity: number)
    {
        if (notes == null || notes.length == 0)
            return;
        
        for (const note of notes)
            this.NoteOn(trackIndex, deltaTime, note, velocity);
    }

    public NotesOff(trackIndex: number, deltaTime: number, notes: Array<number>)
    {
        if (notes == null || notes.length == 0)
            return;

        this.NoteOff(trackIndex, deltaTime, notes[0]);

        if (notes.length > 1)
            for (let i = 0; i < notes.length; i++)
            {
                const note = notes[i];
                this.NoteOff(trackIndex, 0, note);
            }   
    }

    // from: http://midi.teragonaudio.com/tech/midifile/tempo.htm
    // Format 0: tempo changes are scattered throughout the one MTrk
    // Format 1: first MTrk should consist of only the tempo and time signature events,
    //           so that it could be read by some device capable of generating a "tempo map".
    //           It is best not to place MIDI events in this MTrk.
    // Format 2: each MTrk should begin with at least one initial tempo and time signature event.

    public Tempo(trackIndex: number, bpm: number)
    {
        this.Tracks[trackIndex].Tempo(bpm);
    }

    // from: http://midi.teragonaudio.com/tech/midifile/time.htm
    public TimeSignature(trackIndex: number, numerator: number, denominator: number)
    {
        this.Tracks[trackIndex].TimeSignature(numerator, denominator);
    }

    public ToBytes(): Uint8Array
    {
        let headerBytes : Uint8Array = this.Header.ToBytes();
        if (this.Tracks == null || this.Tracks.length == 0)
            return headerBytes;

        // append tracks
        let tracksBytes : Uint8Array = this.Tracks[0].ToBytes();
        const nbTracks = this.Tracks.length;
        if (nbTracks > 1)
            for (let i = 1; i < nbTracks; i++)
            {
                const trackBytes = this.Tracks[i].ToBytes();
                tracksBytes = new Uint8Array([ ...tracksBytes, ...trackBytes]);    
            }

        //displayHexBytesArray(headerBytes);

        let bytes = new Uint8Array([ ...headerBytes, ...tracksBytes]);
        return bytes;
    }
}

function createExampleMidiFile(saveFile: boolean = false): void
{
    const octave = 12;
    
    const B3 = 3*octave + 11;

    const C4 = 4*octave + 0;
    const D4 = 4*octave + 2;
    const E4 = 4*octave + 4;
    const F4 = 4*octave + 5;
    const G4 = 4*octave + 7;
    const A4 = 4*octave + 9;
    const B4 = 4*octave + 11;

    const C5 = 5*octave + 0;
    const D5 = 5*octave + 2;
    const E5 = 5*octave + 4;
    
    const quarterNote = 16; // division

    let midiFile = new MidiFile(1, 2, quarterNote);
    //let midiFile = new MidiFile(0, 1, quarterNote);
    midiFile.Tempo(0, 110);
    //midiFile.TimeSignature(0, 6, 8);

    // track 0: melody

    midiFile.NoteOn(0, 0, C5, 96); midiFile.NoteOff(0, 1*quarterNote, C5);
    midiFile.NoteOn(0, 0, C5, 96); midiFile.NoteOff(0, 1*quarterNote, C5);
    midiFile.NoteOn(0, 0, C5, 96); midiFile.NoteOff(0, 1*quarterNote, C5);
    midiFile.NoteOn(0, 0, D5, 96); midiFile.NoteOff(0, 1*quarterNote, D5);
    midiFile.NoteOn(0, 0, E5, 96); midiFile.NoteOff(0, 2*quarterNote, E5);
    midiFile.NoteOn(0, 0, D5, 96); midiFile.NoteOff(0, 2*quarterNote, D5);
    midiFile.NoteOn(0, 0, C5, 96); midiFile.NoteOff(0, 1*quarterNote, C5);
    midiFile.NoteOn(0, 0, E5, 96); midiFile.NoteOff(0, 1*quarterNote, E5);
    midiFile.NoteOn(0, 0, D5, 96); midiFile.NoteOff(0, 1*quarterNote, D5);
    midiFile.NoteOn(0, 0, D5, 96); midiFile.NoteOff(0, 1*quarterNote, D5);
    midiFile.NoteOn(0, 0, C5, 96); midiFile.NoteOff(0, 1*quarterNote, C5);

    // track 1: chords

    /*midiFile.NotesOn(1, 0, [C4, E4, G4], 96);
    midiFile.NotesOff(1, 4*quarterNote, [C4, E4, G4]);

    midiFile.NotesOn(1, 0, [B3, E4, G4], 96);
    midiFile.NotesOff(1, 4*quarterNote, [B3, E4, G4]);

    midiFile.NotesOn(1, 0, [C4, E4, G4], 96);
    midiFile.NotesOff(1, 2*quarterNote, [C4, E4, G4]);

    midiFile.NoteOn(1, 0, D4, 96); midiFile.NoteOn(1, 0, F4, 96); midiFile.NoteOn(1, 0, A4, 96);
    midiFile.NoteOff(1, 1*quarterNote, F4);
    midiFile.NoteOn(1, 0, E4, 96); midiFile.NoteOff(1, 1*quarterNote, E4); // transition note in chord
    midiFile.NoteOff(1, 0*1*quarterNote, D4); midiFile.NoteOff(1, 0, A4);

    midiFile.NotesOn(1, 0, [C4, E4, G4], 96);
    midiFile.NotesOff(1, 2*quarterNote, [C4, E4, G4]);*/

    const bytes = midiFile.ToBytes();
    //displayHexBytesArray(bytes);
    
    // save midi file
    if (saveFile)
    {
        //const ia = new Uint8Array(bytes);
        //var file = new File([ia], "example.mid", {type: "application/octet-stream"});
        //document.location = <string>(URL.createObjectURL(file));

        var blob = new Blob([bytes], {type: "application/octet-stream"}); // change resultByte to bytes

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "example.mid";
        link.click();
    }
}
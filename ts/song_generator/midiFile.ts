// from https://www.youtube.com/watch?v=VeV4gyjyqSg

class MidiFile
{
    Header : MidiHeader;
    Tracks : Array<MidiTrack>;
    Format : number;
    Division : number;

    constructor(format: number, nbTracks: number, division: number)
    {
        this.Format = format;
        this.Division = division;
        
        // add track 0
        this.Header = new MidiHeader(format, nbTracks + 1, division);

        this.Tracks = new Array<MidiTrack>();
        for (let i = 0; i < nbTracks + 1; i++)
        {
            const track = new MidiTrack(i);
            this.Tracks.push(track);
        }
    }

    // from: http://midi.teragonaudio.com/tech/midifile/tempo.htm
    // Format 0: tempo changes are scattered throughout the one MTrk
    // Format 1: first MTrk should consist of only the tempo and time signature events,
    //           so that it could be read by some device capable of generating a "tempo map".
    //           It is best not to place MIDI events in this MTrk.
    // Format 2: each MTrk should begin with at least one initial tempo and time signature event.

    public Tempo(trackIndex: number, bpm: number, deltaTime: number)
    {
        this.Tracks[trackIndex].Tempo(bpm, deltaTime);
    }

    // update existing tempo event
    public UpdateTempo(trackIndex: number, bpmNew: number, tempoEventIndex: number)
    {
        this.Tracks[trackIndex].UpdateTempo(bpmNew, tempoEventIndex);
    }

    // from: http://midi.teragonaudio.com/tech/midifile/time.htm
    public TimeSignature(trackIndex: number, numerator: number, denominator: number, deltaTime: number)
    {
        this.Tracks[trackIndex].TimeSignature(numerator, denominator, deltaTime);
    }

    // from: https://ccrma.stanford.edu/~craig/14q/midifile/MidiFileFormat.html
    public Name(trackIndex: number, name: string, deltaTime: number)
    {
        this.Tracks[trackIndex].Name(name, deltaTime);
    }

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

    public UpdateInstrument(trackIndex: number, instrumentId: number = 1)
    {
        this.Tracks[trackIndex].UpdateInstrument(instrumentId);
    }

    public PitchBend(trackIndex: number, deltaTime: number, cents: number = 0)
    {
        this.Tracks[trackIndex].PitchBend(cents, deltaTime);
    }

    public ControlChangeEntrySlider(trackIndex: number, refParam: number = 0)
    {
        this.Tracks[trackIndex].ControlChangeEntrySlider(refParam);
    }

    public ControlChangeVolume(trackIndex: number, volume: number = 0)
    {
        this.Tracks[trackIndex].ControlChangeVolume(volume);
    }

    public ControlChangeFine(trackIndex: number, refParam: number = 0)
    {
        this.Tracks[trackIndex].ControlChangeFine(refParam);
    }

    public ControlChangeCoarse(trackIndex: number, refParam: number = 0)
    {
        this.Tracks[trackIndex].ControlChangeCoarse(refParam);
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

        //DisplayHexBytesArray(headerBytes);

        let bytes = new Uint8Array([ ...headerBytes, ...tracksBytes]);
        return bytes;
    }

    public EnableTracks(enabledTracks: Array<boolean>)
    {
        let index = 1;
        for (const status of enabledTracks)
        {
            this.Tracks[index].Muted = !status;
            index++;
        }
    }

    public Save(path: string)
    {
        const bytes = this.ToBytes();
        //DisplayHexBytesArray(bytes);
        
        var blob = new Blob([bytes], {type: "application/octet-stream"});

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = path;
        link.click();
    }

    public Play(nbLoops: number = 1)
    {
        if (this.Tracks == null || this.Tracks.length == 0)
            return;
        
        let tempo = 120; // default if not specified

        switch(this.Format)
        {
            case 1:
            {
                // build tempo map
                const track0 = this.Tracks[0];
                for (const event of track0.Events)
                {
                    switch (event.Type)
                    {
                        case MidiTrackEventType.TEMPO:
                        {
                            tempo = event.AuxValue;
                            break;
                        }
                    }
                }
                
                // TODO: get current tempo function

                // play tracks
                for (let i = 1; i < this.Tracks.length; i++)
                {
                    const track = this.Tracks[i];
                    let channel = track.Channel;
                    MIDI.setVolume(channel, volumePlay);

                    let timeCursor = 0;
                    for (let loopIndex = 0; loopIndex < nbLoops; loopIndex++)
                    {
                        let pitchBend = 0;

                        if (track.Muted) // do not play if muted
                            continue;

                        for (const event of track.Events)
                        {
                            switch (event.Type)
                            {
                                case MidiTrackEventType.NOTE_ON:
                                case MidiTrackEventType.NOTE_OFF:
                                {
                                    const data = event.Data;
                                    const noteValueInt = data[1];
                                    const velocity = data[2];
                                    timeCursor += event.DeltaTime / this.Division * 60 / tempo;
                                    //console.log(noteValueInt, velocity, timeCursor);
                                    
                                    if (event.Type == MidiTrackEventType.NOTE_ON)
                                        MIDI.noteOn(channel, noteValueInt, velocity, timeCursor, pitchBend);
                                    else if (event.Type == MidiTrackEventType.NOTE_OFF)
                                        MIDI.noteOff(channel, noteValueInt, timeCursor);
                                    
                                    break;
                                }

                                case MidiTrackEventType.PICTH_BEND:
                                {
                                    const cents = event.AuxValue;
                                    timeCursor += event.DeltaTime / this.Division * 60 / tempo;
                                    pitchBend = cents / 100 / 8 / 2; // 1/8/2 = 1/2 tone = 100 cents
                                    break;
                                }
                            
                                default:
                                    break;
                            }
                        }
                    }
                }
                
                break;
            }
        }
    }
}

function testExampleMidiFile(save: boolean = false, play: boolean = false): void
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
    
    const qNote = 480; // quarter-note division

    let midiFile = new MidiFile(1, 2, qNote);
    //let midiFile = new MidiFile(0, 1, qNote);

    // track 0: tempo and time signature informations

    midiFile.Tempo(0, 110, 0);
    midiFile.TimeSignature(0, 4, 4, 0);
    //midiFile.Tempo(0, 125, 4*qNote);
    //midiFile.TimeSignature(0, 5, 4, /*4*/0*qNote);
    //midiFile.Tempo(0, 140, 2*qNote);
    //midiFile.TimeSignature(0, 3, 4, /*5*/3*qNote);
    const vel = 102;

    // track 1: melody

    //midiFile.ControlChangeCoarse(1);
    //midiFile.ControlChangeFine(1);
    //midiFile.ControlChangeEntrySlider(1, 6);
    const channel1Id = 1;
    midiFile.NoteOn(channel1Id, 0, C5, vel); midiFile.NoteOff(channel1Id, 1*qNote, C5);
    midiFile.NoteOn(channel1Id, 0, C5, vel); midiFile.NoteOff(channel1Id, 1*qNote, C5);
    midiFile.NoteOn(channel1Id, 0, C5, vel); midiFile.NoteOff(channel1Id, 1*qNote, C5);
    midiFile.NoteOn(channel1Id, 0, D5, vel); midiFile.NoteOff(channel1Id, 1*qNote, D5);
    //midiFile.PitchBend(channel1Id, 0, 50);
    midiFile.NoteOn(channel1Id, 0, E5, vel); midiFile.NoteOff(channel1Id, 2*qNote, E5);
    //midiFile.PitchBend(channel1Id, 0, 0);
    midiFile.NoteOn(channel1Id, 0, D5, vel); midiFile.NoteOff(channel1Id, 2*qNote, D5);
    midiFile.NoteOn(channel1Id, 0, C5, vel); midiFile.NoteOff(channel1Id, 1*qNote, C5);
    //midiFile.PitchBend(channel1Id, 0, 50);
    midiFile.NoteOn(channel1Id, 0, E5, vel); midiFile.NoteOff(channel1Id, 1*qNote, E5);
    //midiFile.PitchBend(channel1Id, 0, 0);
    midiFile.NoteOn(channel1Id, 0, D5, vel); midiFile.NoteOff(channel1Id, 1*qNote, D5);
    midiFile.NoteOn(channel1Id, 0, D5, vel); midiFile.NoteOff(channel1Id, 1*qNote, D5);
    midiFile.NoteOn(channel1Id, 0, C5, vel); midiFile.NoteOff(channel1Id, 1*qNote, C5);


    // track 2: chords

    const channel2Id = 2;

    midiFile.NotesOn(channel2Id, 0, [C4, E4, G4], vel);
    midiFile.NotesOff(channel2Id, 4*qNote, [C4, E4, G4]);

    midiFile.NotesOn(channel2Id, 0, [B3, E4, G4], vel);
    midiFile.NotesOff(channel2Id, 4*qNote, [B3, E4, G4]);

    midiFile.NotesOn(channel2Id, 0, [C4, E4, G4], vel);
    midiFile.NotesOff(channel2Id, 2*qNote, [C4, E4, G4]);

    midiFile.NoteOn(channel2Id, 0, D4, vel); midiFile.NoteOn(channel2Id, 0, F4, vel); midiFile.NoteOn(channel2Id, 0, A4, vel);
    midiFile.NoteOff(channel2Id, 1*qNote, F4);
    midiFile.NoteOn(channel2Id, 0, G4, vel); midiFile.NoteOff(channel2Id, 1*qNote, G4); // transition note in chord
    midiFile.NoteOff(channel2Id, 0*1*qNote, D4); midiFile.NoteOff(channel2Id, 0, A4);

    midiFile.NotesOn(channel2Id, 0, [C4, E4, G4], vel);
    midiFile.NotesOff(channel2Id, 2*qNote, [C4, E4, G4]);

    // save midi file
    if (save)
        midiFile.Save("example.mid")

    if (play)
        midiFile.Play();
}
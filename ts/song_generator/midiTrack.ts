class MidiTrack
{
    public Type: string;       // "MTrk", constant
    public Events: Array<MidiTrackEvent>;
    public Muted: boolean;

    private channel: number;    // 4 bytes
    
    constructor(channel: number)
    {
        this.Type = "MTrk";
        this.Events = new Array<MidiTrackEvent>();
        this.channel = channel;

        this.Muted = false;

        // add end of track event
        this.AddEvent(EndTrackEvent());
    }

    public AddEvent(event: MidiTrackEvent): void
    {
        if (this.Events == null)
            this.Events = new Array<MidiTrackEvent>();

        const length = this.Events.length
        if (length == 0)
            this.Events.push(event);
        else
        {
            // insert before end of track event
            this.Events.splice(length - 1, 0, event);
        }
    }

    public Length(): number
    {
        let length = 0;
        for (const event of this.Events)
            length += event.Length();
        
        return length;
    }

    public ToBytes(): Uint8Array
    {

        let utf8Encode = new TextEncoder();
        let typeBytes = utf8Encode.encode(this.Type);
        //DisplayHexBytesArray(typeBytes);

        let lengthBytes = ToBytesInt32(this.Length());
        //console.log("Length = " + this.Length());
        //DisplayHexBytesArray(lengthBytes);

        let trackBytes = new Uint8Array([ ...typeBytes, ...lengthBytes]);

        // append events
        for (const event of this.Events)
        {
            const eventBytes = event.ToBytes();
            trackBytes = new Uint8Array([ ...trackBytes, ...eventBytes]);    
        }

        return trackBytes;
    }

    public Tempo(bpm: number, deltaTime: number): void
    {
        const event: MidiTrackEvent = TempoEvent(bpm, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    // update existing tempo event
    public UpdateTempo(bpmNew: number, tempoEventIndex: number): void
    {
        let indexTempo = 0;
        let index = 0;
        for (let event of this.Events)
        {
            if (event.Type == MidiTrackEventType.TEMPO)
            {
                if (indexTempo == tempoEventIndex)
                {
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

    public TimeSignature(numerator: number, denominator: number, deltaTime: number): void
    {
        const event: MidiTrackEvent = TimeSignatureEvent(numerator, denominator, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public NoteOn(note: number, deltaTime: number, velocity: number): void
    {
        const event: MidiTrackEvent = NoteOnTrackEvent(this.channel - 1, note, deltaTime, velocity);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public NoteOff(note: number, deltaTime: number): void
    {
        const event: MidiTrackEvent = NoteOffTrackEvent(this.channel - 1, note, deltaTime);
        this.AddEvent(event);
    }

    public PitchBend(cents: number, deltaTime: number): void
    {
        const event: MidiTrackEvent = PitchBendEvent(this.channel - 1, cents, deltaTime);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public ControlChangeFine(refParam: number = 0): void
    {
        const event: MidiTrackEvent = ControlChangeFineEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public ControlChangeCoarse(refParam: number = 0): void
    {
        const event: MidiTrackEvent = ControlChangeCoarseEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public ControlChangeEntrySlider(refParam: number = 0): void
    {
        const event: MidiTrackEvent = ControlChangeEntrySliderEvent(this.channel - 1, refParam);
        //DisplayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public GetNbNotes(): number
    {
        // count NoteOn events
        let nbNotes = 0;
        for (const event of this.Events)
            if (event.Type == MidiTrackEventType.NOTE_ON)
                nbNotes++; 

        // fallback if not found
        return nbNotes;
    }


    public GetNoteValue(index: number): number
    {
        // get note by NoteOn index event
        let indexCur = 0;
        for (const event of this.Events)
        {
            if (event.Type == MidiTrackEventType.NOTE_ON)
            {
                if (indexCur == index)
                    return event.Data[1];

                indexCur++;
            }    
        }

        // fallback if not found
        return -1;
    }
}
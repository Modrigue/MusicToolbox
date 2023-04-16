class MidiTrack
{
    public Type: string;       // "MTrk", constant
    public Events: Array<MidiTrackEvent>;

    private channel: number;    // 4 bytes
    
    constructor(channel: number)
    {
        this.Type = "MTrk";
        this.Events = new Array<MidiTrackEvent>();
        this.channel = channel;

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
        //displayHexBytesArray(typeBytes);

        let lengthBytes = toBytesInt32(this.Length());
        //console.log("Length = " + this.Length());
        //displayHexBytesArray(lengthBytes);

        let trackBytes = new Uint8Array([ ...typeBytes, ...lengthBytes]);

        // append events
        for (const event of this.Events)
        {
            const eventBytes = event.ToBytes();
            trackBytes = new Uint8Array([ ...trackBytes, ...eventBytes]);    
        }

        return trackBytes;
    }

    public NoteOn(note: number, deltaTime: number, velocity: number): void
    {
        const event: MidiTrackEvent = NoteOnTrackEvent(this.channel, note, deltaTime, velocity);
        this.AddEvent(event);
    }

    public NoteOff(note: number, deltaTime: number): void
    {
        const event: MidiTrackEvent = NoteOffTrackEvent(this.channel, note, deltaTime);
        this.AddEvent(event);
    }

    public Tempo(bpm: number): void
    {
        const event: MidiTrackEvent = TempoEvent(bpm);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }

    public TimeSignature(numerator: number, denominator: number): void
    {
        const event: MidiTrackEvent = TimeSignatureEvent(numerator, denominator);
        //displayHexBytesArray(event.ToBytes());
        this.AddEvent(event);
    }
}

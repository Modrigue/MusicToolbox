class MidiHeader
{
    Type: string;   // "MThd", constant
    Length: number; // default = 6

    // Format: (cf. MIDI specifications)
    //  0: Single multichannel track
    //  1: 1 or more tracks played simultaneously
    //  2: 1 or more tracks played sequentially
    Format: number;     // 4 bytes

    NbTracks: number;   // 2 bytes

    Division: number;   // 2 bytes, divide time into ticks

    constructor(format: number, nbTracks: number, division: number)
    {
        this.Type = "MThd";
        this.Length = 6;
        this.Format = format;
        this.NbTracks = nbTracks;
        this.Division = division;
    }

    public ToBytes(): Uint8Array
    {
        let utf8Encode = new TextEncoder();
        let typeBytes = utf8Encode.encode(this.Type);

        let lengthBytes = ToBytesInt32(this.Length);

        let formatBytes = ToBytesInt16(this.Format);

        let nbTracksBytes = ToBytesInt16(this.NbTracks)

        let divisionBytes = ToBytesInt16(this.Division);
        //DisplayHexBytesArray(divisionBytes, false);

        let headerBytes = new Uint8Array([ ...typeBytes, ...lengthBytes, ...formatBytes, ...nbTracksBytes, ...divisionBytes]);
        //DisplayHexBytesArray(headerBytes);
        return headerBytes;
    }
}
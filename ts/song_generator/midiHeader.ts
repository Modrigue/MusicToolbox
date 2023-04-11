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

        let lengthBytes = Uint8Array.from([this.Length]).reverse();     // big endian, 4 bytes
        lengthBytes = fillByteArray(lengthBytes, 4);

        let formatBytes = Uint8Array.from([this.Format]).reverse();     // big endian, 2 bytes
        formatBytes = fillByteArray(formatBytes, 2);

        let nbTracksBytes = Uint8Array.from([this.NbTracks]).reverse(); // big endian, 2 bytes
        nbTracksBytes = fillByteArray(nbTracksBytes, 2);

        let divisionBytes = Uint8Array.from([this.Division]).reverse(); // big endian, 2 bytes
        divisionBytes = fillByteArray(divisionBytes, 2);

        let headerBytes = new Uint8Array([ ...typeBytes, ...lengthBytes, ...formatBytes, ...nbTracksBytes, ...divisionBytes]);
        return headerBytes;
    }
}
"use strict";
class MidiHeader {
    constructor(format, nbTracks, division) {
        this.Type = "MThd";
        this.Length = 6;
        this.Format = format;
        this.NbTracks = nbTracks;
        this.Division = division;
    }
    ToBytes() {
        let utf8Encode = new TextEncoder();
        let typeBytes = utf8Encode.encode(this.Type);
        let lengthBytes = toBytesInt32(this.Length);
        let formatBytes = toBytesInt16(this.Format);
        let nbTracksBytes = toBytesInt16(this.NbTracks);
        let divisionBytes = toBytesInt16(this.Division);
        //displayHexBytesArray(divisionBytes, false);
        let headerBytes = new Uint8Array([...typeBytes, ...lengthBytes, ...formatBytes, ...nbTracksBytes, ...divisionBytes]);
        //displayHexBytesArray(headerBytes);
        return headerBytes;
    }
}
//# sourceMappingURL=midiHeader.js.map
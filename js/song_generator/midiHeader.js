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
        let lengthBytes = Uint8Array.from([this.Length]).reverse(); // big endian, 4 bytes
        lengthBytes = fillByteArray(lengthBytes, 4);
        let formatBytes = Uint8Array.from([this.Format]).reverse(); // big endian, 2 bytes
        formatBytes = fillByteArray(formatBytes, 2);
        let nbTracksBytes = Uint8Array.from([this.NbTracks]).reverse(); // big endian, 2 bytes
        nbTracksBytes = fillByteArray(nbTracksBytes, 2);
        let divisionBytes = Uint8Array.from([this.Division]).reverse(); // big endian, 2 bytes
        divisionBytes = fillByteArray(divisionBytes, 2);
        let headerBytes = new Uint8Array([...typeBytes, ...lengthBytes, ...formatBytes, ...nbTracksBytes, ...divisionBytes]);
        return headerBytes;
    }
}
//# sourceMappingURL=midiHeader.js.map
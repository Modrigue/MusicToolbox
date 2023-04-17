"use strict";
// compress duration value
function ToVariableLengthQuantity(value) {
    let temp = value;
    let bytes = new Array();
    while (temp > 0) {
        let byte = temp & 127;
        if (bytes.length > 0)
            byte += 128;
        bytes.push(byte);
        temp = temp >> 7;
    }
    if (bytes.length == 0)
        bytes.push(0);
    //displayHexArray(bytes/*.reverse()*/);
    return bytes;
}
// test examples from MIDI specifications
function TestVariablelengthExamples() {
    console.log("MIDI specifications examples:");
    ToVariableLengthQuantity(0x00000000);
    ToVariableLengthQuantity(0x00000040);
    ToVariableLengthQuantity(0x0000007F);
    ToVariableLengthQuantity(0x00000080);
    ToVariableLengthQuantity(0x00002000);
    ToVariableLengthQuantity(0x00003FFF);
    ToVariableLengthQuantity(0x00004000);
    ToVariableLengthQuantity(0x00100000);
    ToVariableLengthQuantity(0x001FFFFF);
    ToVariableLengthQuantity(0x00200000);
    ToVariableLengthQuantity(0x08000000);
    ToVariableLengthQuantity(0x0FFFFFFF);
}
// display functions
function DisplayHexArray(array) {
    let hexArrayString = "";
    let index = 0;
    for (const value of array) {
        if (index > 0)
            hexArrayString += " ";
        let hexString = ToHexString(value);
        hexArrayString += hexString;
        index++;
    }
    console.log(hexArrayString);
}
function DisplayHexBytesArray(array, displayColumns = false) {
    if (displayColumns)
        console.log("00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\n");
    let hexArrayString = "";
    let index = 0;
    for (const value of array) {
        if (index > 0 && index % 16 == 0)
            hexArrayString += "\n";
        else if (index > 0)
            hexArrayString += " ";
        let hexString = ToHexString(value);
        hexArrayString += hexString;
        index++;
    }
    console.log(hexArrayString);
    console.log("\n");
}
function ToHexString(value) {
    let hexString = value.toString(16);
    // add '0' prefix if necessary
    if (hexString.length % 2 == 1)
        hexString = "0" + hexString;
    return hexString.toUpperCase();
}
function ToBinString(value) {
    let binString = value.toString(2);
    return binString;
}
// from: https://stackoverflow.com/questions/15761790/convert-a-32bit-integer-into-4-bytes-of-data-in-javascript
function ToBytesInt32(value) {
    const array = new Uint8Array([
        (value & 0xff000000) >> 24,
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
function ToBytesInt24(value) {
    const array = new Uint8Array([
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
function ToBytesInt16(value) {
    const array = new Uint8Array([
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
// from: https://www.mixagesoftware.com/en/midikit/help/HTML/midi_events.html
// 2 bytes
// The pitch value is defined by both parameters of the MIDI Channel Event by joining them in the format of yyyyyyyxxxxxxx,
// where the y characters represent the last 7 bits of the 2nd parameter
// and the x characters represent the last 7 bits of the 1st parameter.
function ToPitchBendBytes(cents) {
    let value = toPicthBendValue(cents);
    let array = new Uint8Array([
        (value & 0x00007f00) >> 7,
        (value & 0x0000007f)
    ]);
    array = array.reverse(); // big endian
    //DisplayHexBytesArray(array);
    return array;
}
// [0; 16383]
// values < 8192 decrease the pitch, while values > 8192 increase the pitch.
function toPicthBendValue(cents) {
    return Math.floor(8192 * (1 + cents / 200.));
}
//# sourceMappingURL=midiHelper.js.map
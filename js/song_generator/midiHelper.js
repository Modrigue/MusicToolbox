"use strict";
// compress duration value
function toVariableLengthQuantity(value) {
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
function testVariablelengthExamples() {
    console.log("MIDI specifications examples:");
    toVariableLengthQuantity(0x00000000);
    toVariableLengthQuantity(0x00000040);
    toVariableLengthQuantity(0x0000007F);
    toVariableLengthQuantity(0x00000080);
    toVariableLengthQuantity(0x00002000);
    toVariableLengthQuantity(0x00003FFF);
    toVariableLengthQuantity(0x00004000);
    toVariableLengthQuantity(0x00100000);
    toVariableLengthQuantity(0x001FFFFF);
    toVariableLengthQuantity(0x00200000);
    toVariableLengthQuantity(0x08000000);
    toVariableLengthQuantity(0x0FFFFFFF);
}
function fillByteArray(array, size) {
    const byte0 = Uint8Array.from([0]);
    let resArray = new Uint8Array(array);
    while (resArray.length < size)
        resArray = new Uint8Array([...byte0, ...resArray]);
    return resArray;
}
// display functions
function displayHexArray(array) {
    let hexArrayString = "";
    let index = 0;
    for (const value of array) {
        if (index > 0)
            hexArrayString += " ";
        let hexString = toHexString(value);
        hexArrayString += hexString;
        index++;
    }
    console.log(hexArrayString);
}
function displayHexBytesArray(array, displayColumns = true) {
    if (displayColumns)
        console.log("00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\n");
    let hexArrayString = "";
    let index = 0;
    for (const value of array) {
        if (index > 0 && index % 16 == 0)
            hexArrayString += "\n";
        else if (index > 0)
            hexArrayString += " ";
        let hexString = toHexString(value);
        hexArrayString += hexString;
        index++;
    }
    console.log(hexArrayString);
    console.log("\n");
}
function toHexString(value) {
    let hexString = value.toString(16);
    // add '0' prefix if necessary
    if (hexString.length % 2 == 1)
        hexString = "0" + hexString;
    return hexString.toUpperCase();
}
function toBinString(value) {
    let binString = value.toString(2);
    return binString;
}
// from: https://stackoverflow.com/questions/15761790/convert-a-32bit-integer-into-4-bytes-of-data-in-javascript
function toBytesInt32(value) {
    const array = new Uint8Array([
        (value & 0xff000000) >> 24,
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
function toBytesInt24(value) {
    const array = new Uint8Array([
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
function toBytesInt16(value) {
    const array = new Uint8Array([
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ]);
    return array;
}
//# sourceMappingURL=midiHelper.js.map
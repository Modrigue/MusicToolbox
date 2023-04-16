const endTrackEventData: Array<number> = [0xFF, 0x2F, 0x00];

class MidiTrackEvent
{
    DeltaTime: number;
    Data: Array<number>;    // byte array

    constructor(deltaTime: number, data: Array<number>)
    {
        this.DeltaTime = deltaTime;
        this.Data = data;
    }

    public Length(): number
    {
        const bytes = this.ToBytes();
        //console.log("Length = " + bytes.length);
        return bytes.length;
    }

    ToBytes(): Uint8Array
    {
        const arrayLength = toVariableLengthQuantity(this.DeltaTime);
        //console.log(this.DeltaTime);
        
        let bytesLength = Uint8Array.from(arrayLength).reverse(); // big endian
        //displayHexBytesArray(bytesLength);
        
        let bytesData = Uint8Array.from(this.Data);
        //displayHexBytesArray(bytesData);

        let bytes = new Uint8Array([...bytesLength, ...bytesData]);
        //displayHexBytesArray(bytes);
        return bytes;
    }
}

function EndTrackEvent(): MidiTrackEvent
{
    return new MidiTrackEvent(0, endTrackEventData);
}

function NoteOnTrackEvent(channel: number, note: number, deltaTime: number, velocity: number): MidiTrackEvent
{
    const start: number = 0x90 + (channel & 0xF); // note on event = "9" + <channel_nibble>
    const data : Array<number> = [start, note, velocity];
    
    return new MidiTrackEvent(deltaTime, data);
}

function NoteOffTrackEvent(channel: number, note: number, deltaTime: number): MidiTrackEvent
{
    const start: number = 0x80 + (channel & 0xF); // note off event = "98" + <channel_nibble>
    const data : Array<number> = [start, note, 0 /*velocity*/];
    
    return new MidiTrackEvent(deltaTime, data);
}

function ControlChangeFineEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 100, refParam];
    
    return new MidiTrackEvent(0, data);
}

function ControlChangeCoarseEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 101, refParam];
    
    return new MidiTrackEvent(0, data);
}

function ControlChangeEntrySliderEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 6, refParam];
    
    return new MidiTrackEvent(0, data);
}

function TempoEvent(bpm: number): MidiTrackEvent
{
    const tempoDuration = 60000000/bpm; // in microseconds per quarter note
    const bytesDuration = toBytesInt24(tempoDuration);
    //displayHexBytesArray(bytesDuration);

    const bytesDurationArray : Array<number> = [bytesDuration[0], bytesDuration[1], bytesDuration[2]];
    const tempoHeaderArray : Array<number> = [0xFF, 0x51, 0x03];
    const tempoArray : Array<number> = tempoHeaderArray.concat(bytesDurationArray);
    //displayHexArray(tempoArray);

    return new MidiTrackEvent(0, tempoArray);
}

// incomplete
function TimeSignatureEvent(numerator: number, denominator: number): MidiTrackEvent
{
    const tsHeaderArray : Array<number> = [0xFF, 0x58, 0x04];
    const tsValuesArray : Array<number> = [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x08];
    const tsArray : Array<number> = tsHeaderArray.concat(tsValuesArray);
    //displayHexArray(tsArray);

    return new MidiTrackEvent(0, tsArray);
}
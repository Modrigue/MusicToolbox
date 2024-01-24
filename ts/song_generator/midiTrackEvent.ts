const headerEndTrack:       Array<number> = [0xFF, 0x2F, 0x00];
const headerTempo:          Array<number> = [0xFF, 0x51, 0x03];
const headerTimeSignature : Array<number> = [0xFF, 0x58, 0x04];
const headerName :          Array<number> = [0xFF, 0x03];

// links:
// https://www.cs.cmu.edu/~music/cmsip/readings/MIDI%20tutorial%20for%20programmers.html

class MidiTrackEvent
{
    Type: MidiTrackEventType; 
    DeltaTime: number;
    Data: Array<number>;    // byte array

    // for specific events only
    AuxValue: number;

    constructor(deltaTime: number, data: Array<number>, type: MidiTrackEventType, auxValue: number = 0)
    {
        this.Type = type;
        this.DeltaTime = deltaTime;
        this.Data = data;

        this.AuxValue = auxValue;
    }

    public Length(): number
    {
        const bytes = this.ToBytes();
        //console.log("Length = " + bytes.length);
        return bytes.length;
    }

    ToBytes(): Uint8Array
    {
        const arrayLength = ToVariableLengthBytes(this.DeltaTime);
        //console.log(this.DeltaTime);
        
        let bytesLength = Uint8Array.from(arrayLength).reverse(); // big endian
        //DisplayHexBytesArray(bytesLength);
        
        let bytesData = Uint8Array.from(this.Data);
        //DisplayHexBytesArray(bytesData);

        let bytes = new Uint8Array([...bytesLength, ...bytesData]);
        //DisplayHexBytesArray(bytes);
        return bytes;
    }
}

function EndTrackEvent(): MidiTrackEvent
{
    return new MidiTrackEvent(0, headerEndTrack, MidiTrackEventType.END_TRACK);
}

function TempoEvent(bpm: number, deltaTime: number): MidiTrackEvent
{
    const tempoDuration = 60000000/bpm; // in microseconds per quarter note
    const bytesDuration = ToBytesInt24(tempoDuration);
    //DisplayHexBytesArray(bytesDuration);

    const bytesDurationArray : Array<number> = [bytesDuration[0], bytesDuration[1], bytesDuration[2]];
    const tempoArray : Array<number> = headerTempo.concat(bytesDurationArray);
    //DisplayHexArray(tempoArray);

    return new MidiTrackEvent(deltaTime, tempoArray, MidiTrackEventType.TEMPO, bpm);
}

function TimeSignatureEvent(numerator: number, denominator: number, deltaTime: number): MidiTrackEvent
{
    const tsValuesArray : Array<number> = [numerator, Math.floor(Math.log2(denominator)), 0x18, 0x08];
    const tsArray : Array<number> = headerTimeSignature.concat(tsValuesArray);
    //DisplayHexArray(tsArray);

    return new MidiTrackEvent(deltaTime, tsArray, MidiTrackEventType.TIME_SIGNATURE);
}

function NameEvent(name: string, deltaTime: number): MidiTrackEvent
{
    const utf8EncodeText = new TextEncoder();

    const nameBytesArray : Array<number> = Array.from(utf8EncodeText.encode(name));
    const nameLength = nameBytesArray.length;
    const nameArray : Array<number> = headerName.concat(nameLength).concat(nameBytesArray);
    //DisplayHexArray(nameArray);

    return new MidiTrackEvent(deltaTime, nameArray, MidiTrackEventType.NAME);
}

function NoteOnTrackEvent(channel: number, note: number, deltaTime: number, velocity: number): MidiTrackEvent
{
    const start: number = 0x90 + (channel & 0xF); // note on event = "9" + <channel_nibble>
    const data : Array<number> = [start, note, velocity];
    
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.NOTE_ON);
}

function NoteOffTrackEvent(channel: number, note: number, deltaTime: number): MidiTrackEvent
{
    const start: number = 0x80 + (channel & 0xF); // note off event = "8" + <channel_nibble>
    const data : Array<number> = [start, note, 0 /*velocity*/];
    
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.NOTE_OFF);
}

function InstrumentEvent(channel: number, instrumentId: number, deltaTime: number): MidiTrackEvent
{
    const start: number = 0xC0 + (channel & 0xF);
    const data : Array<number> = [start, instrumentId - 1];
    //console.log(DisplayHexArray(data));
    
    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.INSTRUMENT, instrumentId);
}

function PitchBendEvent(channel: number, cents: number, deltaTime: number): MidiTrackEvent
{
    const start: number = 0xE0 + (channel & 0xF);
    const valuesArray : Array<number> = Array.from(ToPitchBendBytes(cents));
    const data : Array<number> = [start].concat(valuesArray);

    return new MidiTrackEvent(deltaTime, data, MidiTrackEventType.PICTH_BEND, cents);
}

function ControlChangeEntrySliderEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 6, refParam];
    
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_ENTRY_SLIDER);
}

function ControlChangeVolumeEvent(channel: number, volume: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 7, volume];
    //console.log(DisplayHexArray(data));
    
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_ENTRY_SLIDER);
}

function ControlChangeFineEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 100, refParam];
    
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_FINE);
}

function ControlChangeCoarseEvent(channel: number, refParam: number = 0): MidiTrackEvent
{
    const start: number = 0xB0 + (channel & 0xF);
    const data : Array<number> = [start, 101, refParam];
    
    return new MidiTrackEvent(0, data, MidiTrackEventType.CONTROL_CHANGE_COARSE);
}
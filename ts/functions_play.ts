// for MIDI.js usage
declare let MIDI: any;


function playNote(noteValue: number, delay: number): void
{
    // delay: play one note every quarter second
    const note: number = 48 + noteValue; // the MIDI note
    const velocity: number = 96; // how hard the note hits
    const volume: number = 60; // volume
    const length: number = 0.75;

    // play the note
    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + length);
}

function playScale(noteValue: number, scaleValues: Array<number>): void
{
    const duration: number = 1;
    scaleValues.forEach(function (intervalValue, index)
    {
        playNote(noteValue + intervalValue, duration*index);
    });
    playNote(noteValue + 12, duration*(scaleValues.length));
}

function playChord(noteValue: number, chordValues:  Array<number>,
    duration: number, delay: number = 0): void
{
    chordValues.forEach(function (intervalValue, index)
    {
        playNote(noteValue + intervalValue, duration + index*delay);
    });
}

function playChords(noteValue: number, scaleValues: Array<number>,
    chordValuesArray: Array<Array<number>>, duration: number): void
{
    chordValuesArray.forEach(function(chordValues, index)
    {
        const noteCurrent = noteValue + scaleValues[index];
        playChord(noteCurrent, chordValues, index*duration);    
    });

    const nbNotesInScale = scaleValues.length;
    playChord(noteValue + 12, chordValuesArray[0], nbNotesInScale*duration);
}

/////////////////////////////////// CALLBACKS /////////////////////////////////


function onPlayScale(): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getSelectedScaleValues();

    playScale(noteValue, scaleValues);
}

function onPlayNoteInScale(index: number): void
{
    const duration: number = 0;

    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getSelectedScaleValues();
    const intervalValue: number = scaleValues[index];

    playNote(noteValue + intervalValue, duration);
}

function onPlayChords(nbNotesInChords: number): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getSelectedScaleValues();

    let chordValuesArray: Array<Array<number>> = new Array<Array<number>>();
    scaleValues.forEach(function (noteValue, index)
    {
      const chordValues: Array<number> = getChordNumberInScale(scaleValues, index, nbNotesInChords);
      chordValuesArray.push(chordValues);
    });

    const duration: number = 1;
    playChords(noteValue, scaleValues, chordValuesArray, duration);
}

function onPlayChordInScale(nbNotesInChords: number, index: number, delay: number = 0): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getSelectedScaleValues();
    const chordValues: Array<number> = getChordNumberInScale(scaleValues, index, nbNotesInChords);

    const duration: number = 0;
    const noteCurrent: number = noteValue + scaleValues[index];
    playChord(noteCurrent, chordValues, duration, delay);   
}
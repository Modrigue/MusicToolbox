// for MIDI.js usage
declare let MIDI: any;


function initializePlay(): void
{
    // init MIDI plugins
    MIDI.loadPlugin(
    {
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state: any, progress: any)
        {
                    //console.log(state, progress);
        },
        onsuccess: function()
        {
            //
        }
    });
}


function playNote(noteValue: number, delay: number): void
{
    // delay: play one note every quarter second
    const note: number = Math.floor(48 + noteValue); // the MIDI note (48 = C2)
    const velocity: number = 96; // how hard the note hits
    const volume: number = 60; // volume
    const length: number = 0.75;

    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

    // play the note
    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, note, velocity, delay, pitchBend);
    MIDI.noteOff(0, note, delay + length);
}

function playScale(noteValue: number, scaleValues: Array<number>,
    bass: boolean = false, backwards: boolean = false): void
{
    const duration: number = bass ? 0.5 : 1;

    let noteBassValue = noteValue - 12; // tonic at inferior octave
    let scaleValuesToPlay: Array<number> = cloneIntegerArray(scaleValues);
    scaleValuesToPlay.push(12); // final note at superior octave

    if (backwards)
        scaleValuesToPlay = scaleValuesToPlay.reverse();

    scaleValuesToPlay.forEach(function (intervalValue, index)
    {
        let noteCurValue = noteValue + intervalValue;

        if (bass)
        {
            playNote(noteBassValue, duration*2*index);
            playNote(noteCurValue, duration*(2*index + 1));
        }
        else
            playNote(noteCurValue, duration*index);
    });

    // // disabled for now: forward + backwards
    // {
    //     const nbNotes = scaleValues.length;
    //     for (let i = 0; i < nbNotes; i++)
    //     {
    //         // forward
    //         const intervalValue = scaleValues[i];
    //         const noteCurValue = noteValue + intervalValue;

    //         // backwards
    //         const intervalBackValue = scaleValues[(nbNotes - i) % nbNotes];
    //         const noteBackCurValue = noteValue + intervalBackValue - 12;

    //         playNote(noteCurValue, duration*i);
    //         if (i > 0)
    //             playNote(noteBackCurValue, duration*i);
    //     };
    //     playNote(noteValue + 12, duration*(nbNotes));
    //     playNote(noteValue - 12, duration*(nbNotes));
    // }
}

function playChord(noteValue: number, chordValues: Array<number>,
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
    const scaleValues: Array<number> = getScaleValues();

    playScale(noteValue, scaleValues);
}

function onPlayScaleWithBass(): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();

    playScale(noteValue, scaleValues, true /*bass*/);
}

function onPlayScaleBackwards(): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();

    playScale(noteValue, scaleValues, false, true /*backwards*/);
}

function onPlayScaleBackwardsWithBass(): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();

    playScale(noteValue, scaleValues, true /*bass*/, true /*backwards*/);
}

function onPlayNoteInScale(index: number): void
{
    const duration: number = 0;

    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();
    const intervalValue: number = scaleValues[index];

    playNote(noteValue + intervalValue, duration);
}

function onPlayChords(nbNotesInChords: number, step: number = 2): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();

    let chordValuesArray: Array<Array<number>> = new Array<Array<number>>();
    scaleValues.forEach(function (noteValue, index)
    {
      const chordValues: Array<number> = getChordNumberInScale(scaleValues, index, nbNotesInChords, step);
      chordValuesArray.push(chordValues);
    });

    const duration: number = 1;
    playChords(noteValue, scaleValues, chordValuesArray, duration);
}

function onPlayChordInScale(nbNotesInChords: number, index: number, step: number = 2, delay: number = 0): void
{
    // get selected note and scale values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getScaleValues();
    const chordValues: Array<number> = getChordNumberInScale(scaleValues, index, nbNotesInChords, step);

    const duration: number = 0;
    const noteCurrent: number = noteValue + scaleValues[index];
    playChord(noteCurrent, chordValues, duration, delay);   
}
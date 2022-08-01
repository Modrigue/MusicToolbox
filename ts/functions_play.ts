// for MIDI.js usage
// from: https://github.com/mudcube/MIDI.js
// soundfonts from: https://cindyjs.org/dist/v0.8.6/soundfonts/
declare let MIDI: any;

const channelPlay = 0;

function initializePlay(): void
{
    const instruments: Array<string> = ["acoustic_grand_piano", "acoustic_guitar_steel", "pad_1_new_age"];

    // init MIDI plugins
    MIDI.loadPlugin(
    {
        soundfontUrl: "./soundfont/",
        /*instrument: "acoustic_grand_piano",*/
        instruments: instruments,
        onprogress: function(state: any, progress: any)
        {
                    //console.log(state, progress);
        },
        onsuccess: function()
        {
            //
        }
    });

    // set MIDI instruments ids
    MIDI.channels[0].program = "0";
    //MIDI.channels[0].program = "25";
    //MIDI.channels[0].program = "88";
}

function playNote(noteValue: number, delay: number): void
{
    // for test purposes only
    //playTestTrack();
    //playTestSong();
    //return;

    // delay: play one note every quarter second
    const note: number = Math.floor(48 + noteValue); // the MIDI note (Ex.: 48 = C2)
    const velocity: number = 96; // how hard the note hits
    const volume: number = 60; // volume
    const length: number = 0.75;

    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

    // play the note
    MIDI.setVolume(channelPlay, volume);
    MIDI.noteOn(channelPlay, note, velocity, delay, pitchBend);
    MIDI.noteOff(channelPlay, note, delay + length);
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

function playChord(fondamentalValue: number, chordValues: Array<number>,
    duration: number, delay: number = 0, bassValue: number = -1): void
{
    let chordValuesToPlay = getChordIntervalsWithBass(fondamentalValue, chordValues, bassValue);
    chordValuesToPlay.forEach(function (intervalValue, index)
    {
        playNote(fondamentalValue + intervalValue, duration + index*delay);
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

// not working
function stopPlaying()
{
    MIDI.stopAllNotes();
    //console.log("stop playing");
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


///////////////////////////// KEYBOARD PLAY FUNCTIONS /////////////////////////


const noteValueMin = 24;  // C0
const noteValueMax = 108; // C7
let notesPressed: Array<number> = [];

document.addEventListener('keydown', function(e)
{
  // get tonic value and scale values
  const tonicValue = getSelectedNoteValue();
  const scaleValues: Array<number> = getScaleValues();
  const nbNotesInScale = scaleValues.length;

  const position = getPositionFromInputKey(e, nbNotesInScale);
  //console.log(`Key down ${e.key} code: ${e.code} => pos: ${position}`);

  if (position < 0)
    return;

  const positionInScale = position % nbNotesInScale;
  const octave = Math.floor(position / nbNotesInScale);

  const noteValue = tonicValue + scaleValues[positionInScale] + 12*octave;

  // compute pitch bend if non-integer value
  let pitchBend = noteValue - Math.floor(noteValue);
  pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

  if(notesPressed.indexOf(noteValue) < 0 && noteValueMin + noteValue <= noteValueMax)
  {
      MIDI.noteOn(channelPlay, noteValueMin + Math.floor(noteValue), 60, 0, pitchBend);
      notesPressed.push(noteValue);
  }

  //console.log(notesPressed);
}, false);

document.addEventListener('keyup', function(e)
{
  // get tonic value and scale values
  const tonicValue = getSelectedNoteValue();
  const scaleValues: Array<number> = getScaleValues();
  const nbNotesInScale = scaleValues.length;
    
  const position = getPositionFromInputKey(e, nbNotesInScale);
  if (position < 0)
    return;


  const positionInScale = position % nbNotesInScale;
  const octave = Math.floor(position / nbNotesInScale);

  const noteValue = tonicValue + scaleValues[positionInScale] + 12*octave;

  const noteIndex = notesPressed.indexOf(noteValue, 0);
  if(noteIndex >= 0  && noteValueMin + noteValue <= noteValueMax)
  {
    MIDI.noteOff(channelPlay, noteValueMin + Math.floor(noteValue));
    notesPressed.splice(noteIndex, 1);
  }

  //console.log(notesPressed);
}, false);


function getPositionFromInputKey(e: KeyboardEvent, nbNotesInScale: number): number
{
    let position = -999;
    switch (e.code)
    {
        // 1st row
        case "IntlBackslash":
            position = 0;
            break;
        case "KeyZ":
            position = 1;
            break;
        case "KeyX":
            position = 2;
            break;
        case "KeyC":
            position = 3;
            break;
        case "KeyV":
            position = 4;
            break;
        case "KeyB":
            position = 5;
            break;
        case "KeyN":
            position = 6;
            break;
        case "KeyM":
            position = 7;
            break;
        case "Comma":
            position = 8;
            break;
        case "Period":
            position = 9;
            break;
        case "Slash":
            position = 10;
            break;

        // 2nd row
        case "KeyA":
            position = 11;
            break;
        case "KeyS":
            position = 12;
            break;
        case "KeyD":
            position = 13;
            break;
        case "KeyF":
            position = 14;
            break;
        case "KeyG":
            position = 15;
            break;
        case "KeyH":
            position = 16;
            break;
        case "KeyJ":
            position = 17;
            break;
        case "KeyK":
            position = 18;
            break;
        case "KeyL":
            position = 19;
            break;
        case "Semicolon":
            position = 20;
            break;
        case "Quote":
            position = 21;
            break;
        case "Backslash":
            position = 22;
            break;      

        // 3rd row
        case "KeyQ":
            position = 23;
            break;
        case "KeyW":
            position = 24;
            break;
        case "KeyE":
            position = 25;
            break;
        case "KeyR":
            position = 26;
            break;
        case "KeyT":
            position = 27;
            break;
        case "KeyY":
            position = 28;
            break;
        case "KeyU":
            position = 29;
            break;
        case "KeyI":
            position = 30;
            break;
        case "KeyO":
            position = 31;
            break;
        case "KeyP":
            position = 32;
            break;
        case "BracketLeft":
            position = 33;
            break;
        case "BracketRight":
            position = 34;
            break;
    
        // 4th row
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
            for (let i = 1; i <= 9; i++)
            {
                if (e.code == `Digit${i}`)
                {
                    position = 34 + i;
                    break;
                }
            }
            break;
        case "Digit0":
            position = 44;
            break;
        case "Minus":
            position = 45;
            break;
        case "Equal":
            position = 46;
            break;
    }

    return position;
}
// for MIDI.js usage
// from: https://github.com/mudcube/MIDI.js
// soundfonts from: https://cindyjs.org/dist/v0.8.8/soundfonts/
declare let MIDI: any;

let channelPlay = 0;
let volumePlay: number = 80;

function loadJSFile(file: string)
{
    document.body.appendChild(document.createElement("script")).src = file;
}

function loadDefaultInstrument(): void
{
    instrumentsLoading = true;
    instrumentLoadingId = 1;
    
    updateLocales(); // force text update

    // init MIDI plugin / soundfont
    MIDI.loadPlugin(
    {
        //soundfontUrl: "./../../soundfonts/",
        soundfontUrl: "./soundfonts/",
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

    // set default MIDI instrument
    MIDI.channels[0].program = "0";
}

function loadSoundfont(instrument: string = "Acoustic Grand Piano"): void
{
    const instrFilename = instrument.toLowerCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "");
    //console.log(instrument, instrFilename);
    
    loadJSFile(`./js/midi/soundfonts/${instrFilename}-ogg.js`);
    
    instrumentsLoading = true;
    updateLocales(); // force text update

    //for (const page of pagesArray)
    //    setEnabled(`button_${page}`, false);

    const instruments: Array<string> = [instrFilename];
    let retry = false;

    // init MIDI plugins / soundfonts
    MIDI.loadPlugin(
    {
        soundfontUrl: "./soundfonts/",
        /*instrument: "acoustic_grand_piano",*/
        instruments: instruments,
        onprogress: function(state: any, progress: any)
        {
            //console.log(state, progress);
        },
        onsuccess: function()
        {
            //console.log("success")
        },
        onerror: function()
        {
            loadSoundfont(instrument); // retry to load soundfont
        }
    });
}

function playNote(noteValue: number, delay: number): void
{
    if (!hasAudio)
        return;
    
    // for test purposes only
    //playTestTrack();
    //playTestSong();
    //return;

    // delay: play one note every quarter second
    const note: number = Math.floor(48 + noteValue); // the MIDI note (Ex.: 48 = C2)
    const velocity: number = 96; // how hard the note hits
    const length: number = 0.75;

    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

    // play the note
    MIDI.setVolume(channelPlay, volumePlay);
    MIDI.noteOn(channelPlay, note, velocity, delay, pitchBend);
    MIDI.noteOff(channelPlay, note, delay + length);
}

function playScale(noteValue: number, scaleValues: Array<number>,
    bass: boolean = false, backwards: boolean = false): void
{
    const duration: number = bass ? 0.5 : 1;

    let noteBassValue = noteValue - 12; // tonic at inferior octave
    let scaleValuesToPlay: Array<number> = cloneIntegerArray(scaleValues);

    // if octave scale, final note at superior octave
    if (isOctaveScale(scaleValuesToPlay))
        scaleValuesToPlay.push(12);
    else
        scaleValuesToPlay.unshift(0);

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
    let scaleValuesToPlay: Array<number> = cloneIntegerArray(scaleValues);
    if (!isOctaveScale(scaleValuesToPlay))
      scaleValuesToPlay.unshift(0);

    const intervalValue: number = scaleValuesToPlay[index];

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
    if (!hasAudio)
        return;
  
    if (pageSelected != "page_scale_keyboard")
        return;
  
  // get tonic value and scale values
  const tonicValue = getSelectedNoteValue("scale_keyboard_tonic");
  const scaleId = (<HTMLSelectElement>document.getElementById("scale_keyboard_scale")).value;
  const scaleValues: Array<number> = getScaleValues(scaleId);
  const scaleValuesPositions = getScaleValuesPositions(scaleValues);
  const scaleCharIntervals = getScaleCharIntervals(scaleId); 

  const position = getPositionFromInputKey(e);
  //console.log(`Key down ${e.key} code: ${e.code} => pos: ${position}`);
  if (position < 0)
    return;

  // get selected start octave
  const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`scale_keyboard_start_octave`)).value;
  const octaveStartValue: number = parseInt(octaveStartSelected);
  const noteValueMinOctave = 12*octaveStartValue + noteValueMin;

  const noteValue = noteValueMinOctave + tonicValue + scaleValuesPositions[position];
  //console.log(noteValue, position, scaleValuesPositions[position]);
  
  // compute pitch bend if non-integer value
  let pitchBend = noteValue - Math.floor(noteValue);
  pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone

  if(notesPressed.indexOf(noteValue) < 0 && noteValue <= noteValueMax)
  {
      MIDI.setVolume(channelPlay, volumePlay);
      MIDI.noteOn(channelPlay, Math.floor(noteValue), 60, 0, pitchBend);
      
      notesPressed.push(noteValue);
      updateScaleKeyboard(tonicValue, scaleValues, octaveStartValue, scaleCharIntervals);
  }

  //console.log(notesPressed);
}, false);

document.addEventListener('keyup', function(e)
{
    if (!hasAudio)
        return;
    if (pageSelected != "page_scale_keyboard")
        return;
  
  // get tonic value and scale values
  const tonicValue = getSelectedNoteValue("scale_keyboard_tonic");
  const scaleId = (<HTMLSelectElement>document.getElementById("scale_keyboard_scale")).value;
  const scaleValues: Array<number> = getScaleValues(scaleId);
  const scaleValuesPositions = getScaleValuesPositions(scaleValues);
  const scaleCharIntervals = getScaleCharIntervals(scaleId); 
    
  const position = getPositionFromInputKey(e);
  if (position < 0)
    return;

  // get selected start octave
  const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`scale_keyboard_start_octave`)).value;
  const octaveStartValue: number = parseInt(octaveStartSelected);
  const noteValueMinOctave = 12*octaveStartValue + noteValueMin;

  const noteValue = noteValueMinOctave + tonicValue + scaleValuesPositions[position];

  // release note if pressed
  const noteIndex = notesPressed.indexOf(noteValue, 0);
  if(noteIndex >= 0 && noteValue <= noteValueMax)
  {
    MIDI.noteOff(channelPlay, Math.floor(noteValue));
    
    notesPressed.splice(noteIndex, 1);
    updateScaleKeyboard(tonicValue, scaleValues, octaveStartValue, scaleCharIntervals);
  }

  //console.log(notesPressed);
}, false);

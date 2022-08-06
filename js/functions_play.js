"use strict";
let channelPlay = 0;
let volumePlay = 80;
function initializePlay() {
    const instruments = ["acoustic_grand_piano", "acoustic_guitar_steel", "pad_1_new_age"];
    // init MIDI plugins
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        /*instrument: "acoustic_grand_piano",*/
        instruments: instruments,
        onprogress: function (state, progress) {
            //console.log(state, progress);
        },
        onsuccess: function () {
            //
        }
    });
    // set default MIDI instrument
    MIDI.channels[0].program = "0";
}
function playNote(noteValue, delay) {
    // for test purposes only
    //playTestTrack();
    //playTestSong();
    //return;
    // delay: play one note every quarter second
    const note = Math.floor(48 + noteValue); // the MIDI note (Ex.: 48 = C2)
    const velocity = 96; // how hard the note hits
    const length = 0.75;
    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone
    // play the note
    MIDI.setVolume(channelPlay, volumePlay);
    MIDI.noteOn(channelPlay, note, velocity, delay, pitchBend);
    MIDI.noteOff(channelPlay, note, delay + length);
}
function playScale(noteValue, scaleValues, bass = false, backwards = false) {
    const duration = bass ? 0.5 : 1;
    let noteBassValue = noteValue - 12; // tonic at inferior octave
    let scaleValuesToPlay = cloneIntegerArray(scaleValues);
    scaleValuesToPlay.push(12); // final note at superior octave
    if (backwards)
        scaleValuesToPlay = scaleValuesToPlay.reverse();
    scaleValuesToPlay.forEach(function (intervalValue, index) {
        let noteCurValue = noteValue + intervalValue;
        if (bass) {
            playNote(noteBassValue, duration * 2 * index);
            playNote(noteCurValue, duration * (2 * index + 1));
        }
        else
            playNote(noteCurValue, duration * index);
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
function playChord(fondamentalValue, chordValues, duration, delay = 0, bassValue = -1) {
    let chordValuesToPlay = getChordIntervalsWithBass(fondamentalValue, chordValues, bassValue);
    chordValuesToPlay.forEach(function (intervalValue, index) {
        playNote(fondamentalValue + intervalValue, duration + index * delay);
    });
}
function playChords(noteValue, scaleValues, chordValuesArray, duration) {
    chordValuesArray.forEach(function (chordValues, index) {
        const noteCurrent = noteValue + scaleValues[index];
        playChord(noteCurrent, chordValues, index * duration);
    });
    const nbNotesInScale = scaleValues.length;
    playChord(noteValue + 12, chordValuesArray[0], nbNotesInScale * duration);
}
// not working
function stopPlaying() {
    MIDI.stopAllNotes();
    //console.log("stop playing");
}
/////////////////////////////////// CALLBACKS /////////////////////////////////
function onPlayScale() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues);
}
function onPlayScaleWithBass() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues, true /*bass*/);
}
function onPlayScaleBackwards() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues, false, true /*backwards*/);
}
function onPlayScaleBackwardsWithBass() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues, true /*bass*/, true /*backwards*/);
}
function onPlayNoteInScale(index) {
    const duration = 0;
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    const intervalValue = scaleValues[index];
    playNote(noteValue + intervalValue, duration);
}
function onPlayChords(nbNotesInChords, step = 2) {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    let chordValuesArray = new Array();
    scaleValues.forEach(function (noteValue, index) {
        const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords, step);
        chordValuesArray.push(chordValues);
    });
    const duration = 1;
    playChords(noteValue, scaleValues, chordValuesArray, duration);
}
function onPlayChordInScale(nbNotesInChords, index, step = 2, delay = 0) {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords, step);
    const duration = 0;
    const noteCurrent = noteValue + scaleValues[index];
    playChord(noteCurrent, chordValues, duration, delay);
}
///////////////////////////// KEYBOARD PLAY FUNCTIONS /////////////////////////
const noteValueMin = 24; // C0
const noteValueMax = 108; // C7
let notesPressed = [];
document.addEventListener('keydown', function (e) {
    if (pageSelected != "page_scale_keyboard")
        return;
    // get tonic value and scale values
    const tonicValue = getSelectedNoteValue("scale_keyboard_tonic");
    const scaleId = document.getElementById("scale_keyboard_scale").value;
    const scaleValues = getScaleValues(scaleId);
    const scaleValuesPositions = getScaleValuesPositions(scaleValues);
    const position = getPositionFromInputKey(e);
    //console.log(`Key down ${e.key} code: ${e.code} => pos: ${position}`);
    if (position < 0)
        return;
    // get selected start octave
    const octaveStartSelected = document.getElementById(`scale_keyboard_start_octave`).value;
    const octaveStartValue = parseInt(octaveStartSelected);
    const noteValueMinOctave = 12 * octaveStartValue + noteValueMin;
    const noteValue = tonicValue + scaleValuesPositions[position];
    //console.log(noteValue, position, scaleValuesPositions[position]);
    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone
    if (notesPressed.indexOf(noteValue) < 0 && noteValueMinOctave + noteValue <= noteValueMax) {
        MIDI.setVolume(channelPlay, volumePlay);
        MIDI.noteOn(channelPlay, noteValueMinOctave + Math.floor(noteValue), 60, 0, pitchBend);
        notesPressed.push(noteValue);
    }
    //console.log(notesPressed);
}, false);
document.addEventListener('keyup', function (e) {
    if (pageSelected != "page_scale_keyboard")
        return;
    // get tonic value and scale values
    const tonicValue = getSelectedNoteValue("scale_keyboard_tonic");
    const scaleId = document.getElementById("scale_keyboard_scale").value;
    const scaleValues = getScaleValues(scaleId);
    const scaleValuesPositions = getScaleValuesPositions(scaleValues);
    const position = getPositionFromInputKey(e);
    if (position < 0)
        return;
    // get selected start octave
    const octaveStartSelected = document.getElementById(`scale_keyboard_start_octave`).value;
    const octaveStartValue = parseInt(octaveStartSelected);
    const noteValueMinOctave = 12 * octaveStartValue + noteValueMin;
    const noteValue = tonicValue + scaleValuesPositions[position];
    // release note if pressed
    const noteIndex = notesPressed.indexOf(noteValue, 0);
    if (noteIndex >= 0 && noteValueMinOctave + noteValue <= noteValueMax) {
        MIDI.noteOff(channelPlay, noteValueMinOctave + Math.floor(noteValue));
        notesPressed.splice(noteIndex, 1);
    }
    //console.log(notesPressed);
}, false);
//# sourceMappingURL=functions_play.js.map
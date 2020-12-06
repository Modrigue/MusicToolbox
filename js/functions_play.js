"use strict";
function initializePlay() {
    // init MIDI plugins
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function (state, progress) {
            //console.log(state, progress);
        },
        onsuccess: function () {
            //
        }
    });
}
function playNote(noteValue, delay) {
    // delay: play one note every quarter second
    const note = 48 + noteValue; // the MIDI note
    const velocity = 96; // how hard the note hits
    const volume = 60; // volume
    const length = 0.75;
    // play the note
    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + length);
}
function playScale(noteValue, scaleValues) {
    const duration = 1;
    scaleValues.forEach(function (intervalValue, index) {
        playNote(noteValue + intervalValue, duration * index);
    });
    playNote(noteValue + 12, duration * (scaleValues.length));
}
function playChord(noteValue, chordValues, duration, delay = 0) {
    chordValues.forEach(function (intervalValue, index) {
        playNote(noteValue + intervalValue, duration + index * delay);
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
/////////////////////////////////// CALLBACKS /////////////////////////////////
function onPlayScale() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getSelectedScaleValues();
    playScale(noteValue, scaleValues);
}
function onPlayNoteInScale(index) {
    const duration = 0;
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getSelectedScaleValues();
    const intervalValue = scaleValues[index];
    playNote(noteValue + intervalValue, duration);
}
function onPlayChords(nbNotesInChords) {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getSelectedScaleValues();
    let chordValuesArray = new Array();
    scaleValues.forEach(function (noteValue, index) {
        const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
        chordValuesArray.push(chordValues);
    });
    const duration = 1;
    playChords(noteValue, scaleValues, chordValuesArray, duration);
}
function onPlayChordInScale(nbNotesInChords, index, delay = 0) {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getSelectedScaleValues();
    const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
    const duration = 0;
    const noteCurrent = noteValue + scaleValues[index];
    playChord(noteCurrent, chordValues, duration, delay);
}
//# sourceMappingURL=functions_play.js.map
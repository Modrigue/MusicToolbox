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
    const note = Math.floor(48 + noteValue); // the MIDI note (48 = C2)
    const velocity = 96; // how hard the note hits
    const volume = 60; // volume
    const length = 0.75;
    // compute pitch bend if non-integer value
    let pitchBend = noteValue - Math.floor(noteValue);
    pitchBend *= 1 / 8 / 2; // 1/8/2 = 1/2 tone
    // play the note
    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, note, velocity, delay, pitchBend);
    MIDI.noteOff(0, note, delay + length);
}
function playScale(noteValue, scaleValues, backwards = false) {
    const duration = 1;
    if (!backwards) {
        scaleValues.forEach(function (intervalValue, index) {
            let noteCurValue = noteValue + intervalValue;
            playNote(noteCurValue, duration * index);
        });
        playNote(noteValue + 12, duration * (scaleValues.length));
    }
    else // backwards
     {
        playNote(noteValue + 12, 0);
        scaleValues.reverse().forEach(function (intervalValue, index) {
            let noteCurValue = noteValue + intervalValue;
            playNote(noteCurValue, duration * (index + 1));
        });
    }
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
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues);
}
function onPlayScaleBackwards() {
    // get selected note and scale values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getScaleValues();
    playScale(noteValue, scaleValues, true /*backwards*/);
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
//# sourceMappingURL=functions_play.js.map
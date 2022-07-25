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
    // for test purposes only
    //playTestTrack();
    //playTestSong();
    //return;
    // delay: play one note every quarter second
    const note = Math.floor(48 + noteValue); // the MIDI note (Ex.: 48 = C2)
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
function playChord(noteValue, chordValues, duration, delay = 0, bass = -1) {
    let intervalsToPlay = cloneIntegerArray(chordValues);
    // play bass if specified
    if (bass >= 0 && bass != noteValue) {
        const bassInterval = ((bass - noteValue) % 12) - 12;
        intervalsToPlay.unshift(bassInterval);
    }
    intervalsToPlay.forEach(function (intervalValue, index) {
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
//////////////////////////// MUSIC GENERATION TESTS ///////////////////////////
function playGeneratedSong() {
    // get selected start note
    const noteStartSelected = document.getElementById(`song_generator_start_note`).value;
    const noteStartValue = parseInt(noteStartSelected);
    // get selected start octave
    const octaveStartSelected = document.getElementById(`song_generator_start_octave`).value;
    const octaveStartValue = parseInt(octaveStartSelected);
    // get selected tempo
    const tempoSelected = document.getElementById(`song_generator_tempo`).value;
    const tempoValue = parseInt(tempoSelected);
    //playTestTrack(tempoValue, noteStartValue, octaveStartValue);
    playTestSong(tempoValue, noteStartValue, octaveStartValue);
}
function playTestTrack(tempo, note, octave) {
    let notes = [];
    notes.push(new Note(0, 0, 1, 0));
    notes.push(new Note(0, 0, 1, 1));
    notes.push(new Note(0, 0, 1, 2));
    notes.push(new Note(2, 0, 1, 3));
    notes.push(new Note(4, 0, 1, 4));
    notes.push(new Note(2, 0, 1, 6));
    notes.push(new Note(0, 0, 1, 8));
    notes.push(new Note(4, 0, 1, 9));
    notes.push(new Note(2, 0, 1, 10));
    notes.push(new Note(2, 0, 1, 11));
    notes.push(new Note(0, 0, 1, 12));
    const track = new Track(notes);
    track.Transpose(note + 12 * octave);
    track.Play(tempo);
}
function playTestSong(tempo, note, octave) {
    let notes1 = [];
    notes1.push(new Note(0, 0, 1, 0));
    notes1.push(new Note(0, 0, 1, 1));
    notes1.push(new Note(0, 0, 1, 2));
    notes1.push(new Note(2, 0, 1, 3));
    notes1.push(new Note(4, 0, 1, 4));
    notes1.push(new Note(2, 0, 1, 6));
    notes1.push(new Note(0, 0, 1, 8));
    notes1.push(new Note(4, 0, 1, 9));
    notes1.push(new Note(2, 0, 1, 10));
    notes1.push(new Note(2, 0, 1, 11));
    notes1.push(new Note(0, 0, 1, 12));
    const track1 = new Track(notes1);
    let notes2 = [];
    notes2.push(new Note(4, 0, 1, 0));
    notes2.push(new Note(4, 0, 1, 1));
    notes2.push(new Note(4, 0, 1, 2));
    notes2.push(new Note(5, 0, 1, 3));
    notes2.push(new Note(7, 0, 1, 4));
    notes2.push(new Note(5, 0, 1, 6));
    notes2.push(new Note(4, 0, 1, 8));
    notes2.push(new Note(7, 0, 1, 9));
    notes2.push(new Note(5, 0, 1, 10));
    notes2.push(new Note(5, 0, 1, 11));
    notes2.push(new Note(4, 0, 1, 12));
    const track2 = new Track(notes2);
    const song = new Song([track1, track2]);
    song.Transpose(note + 12 * octave);
    song.Tempo = tempo;
    song.Play();
}
//# sourceMappingURL=functions_play.js.map
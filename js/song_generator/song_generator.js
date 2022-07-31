"use strict";
let generatedSong = new Song();
function generateNewSong() {
    // get selected tonic
    const tonicSelected = document.getElementById(`song_generator_tonic`).value;
    const tonicValue = parseInt(tonicSelected);
    // get selected scale
    const scaleId = document.getElementById(`song_generator_scale`).value;
    const scaleValues = getScaleValues(scaleId);
    // get number of bars
    const nbBarsSelected = document.getElementById(`song_generator_nb_bars`).value;
    const nbBars = parseInt(nbBarsSelected);
    // get selected tempo
    const tempoSelected = document.getElementById(`song_generator_tempo`).value;
    const tempo = parseInt(tempoSelected);
    // get selected tracks
    let tracksSelected = getSelectedTracks();
    // generate tracks
    let track1 = generatedSong.tracks[0];
    let track2 = generatedSong.tracks[1];
    if (tracksSelected[0] && !tracksSelected[1]) {
        track1 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 2, track2);
    }
    else if (!tracksSelected[0] && tracksSelected[1]) {
        track2 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 4, track1);
    }
    else if (tracksSelected[0] && tracksSelected[1]) {
        track1 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 2);
        track2 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 4, track1);
    }
    generatedSong = new Song([track1, track2]);
    generatedSong.Tempo = tempo;
    updateSongGeneratorPage();
    setEnabled("song_generator_play", true);
    //generatedSong.Log();
}
function playGeneratedSong() {
    if (generatedSong == null)
        return;
    // get selected tempo
    const tempoSelected = document.getElementById(`song_generator_tempo`).value;
    const tempo = parseInt(tempoSelected);
    generatedSong.Tempo = tempo;
    // get selected tracks
    let tracksSelected = getSelectedTracks();
    generatedSong.EnableTracks(tracksSelected);
    generatedSong.Play();
    //playTestTrack(tempoValue, tonicValue, 2);
    //playTestSong(tempoValue, tonicValue, 2);
}
function resetGeneratedSong() {
    generatedSong = new Song();
    updateSongGeneratorPage();
}
function getSelectedTracks() {
    // get selected tracks
    let tracksSelected = [false, false];
    for (let i = 1; i <= 2; i++)
        tracksSelected[i - 1] = document.getElementById(`song_generator_checkbox_track${i}`).checked;
    return tracksSelected;
}
function updateSongGeneratorPage() {
    const hasSong = (generatedSong != null && generatedSong.tracks != null && generatedSong.tracks.length > 0);
    // get selected tracks
    let tracksSelected = getSelectedTracks();
    generatedSong.EnableTracks(tracksSelected);
    let nbTracksSelected = 0;
    for (let i = 0; i < 2; i++)
        if (tracksSelected[i])
            nbTracksSelected++;
    document.getElementById('song_generator_generate').innerText = (nbTracksSelected > 1) ?
        `${getString("generate_new_song")}` : `${getString("generate_new_track")}`;
    const hasSelectedTracks = (nbTracksSelected > 0);
    setEnabled('song_generator_generate', hasSelectedTracks);
    setEnabled('song_generator_play', hasSong && hasSelectedTracks);
    // update generated song texts if existing
    for (let i = 1; i <= 2; i++) {
        let trackText = "";
        let trackColor = "silver";
        if (hasSong) {
            const track = generatedSong.tracks[i - 1];
            if (track != null) {
                trackText = track.Text();
                trackColor = track.muted ? "silver" : "black";
            }
        }
        document.getElementById(`song_generator_track_text${i}`).innerText = trackText;
        document.getElementById(`song_generator_track_text${i}`).style.color = trackColor;
    }
    setEnabled("song_generator_reset", hasSong);
    // for debug purposes
    if (false)
        if (hasSong) {
            let intervalsStr = "";
            for (let i = 0; i < generatedSong.tracks[0].notes.length; i++) {
                const noteValue0 = generatedSong.tracks[0].GetNoteValue(i);
                const noteValue1 = generatedSong.tracks[1].GetNoteValue(i);
                intervalsStr += getIntervalBetweenNotes(noteValue1, noteValue0) + " ";
            }
            intervalsStr = intervalsStr.trim();
            document.getElementById(`song_generator_tracks_intervals`).innerText = intervalsStr;
        }
}
///////////////////////////////// TEST FUNCTIONS //////////////////////////////
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
    //song.Log();
    song.Play();
}
//# sourceMappingURL=song_generator.js.map
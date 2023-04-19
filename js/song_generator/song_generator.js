"use strict";
const qNote = 480; // quarter-note division
let generatedMidi = new MidiFile(1, 2, qNote);
let hasGeneratedMidi = false;
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
    // generate song
    generatedMidi = new MidiFile(1, 2, qNote);
    // track 0: tempo and time signature informations
    generatedMidi.Tempo(0, tempo, 0);
    generatedMidi.TimeSignature(0, 4, 4, 0);
    // generate tracks
    let track1 = new MidiTrack(1);
    let track2 = new MidiTrack(2);
    if (tracksSelected[0] && !tracksSelected[1]) {
        track1 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 2, qNote, 1, track2);
    }
    else if (!tracksSelected[0] && tracksSelected[1]) {
        track2 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 4, qNote, 2, track1);
    }
    else if (tracksSelected[0] && tracksSelected[1]) {
        track1 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 2, qNote, 1);
        track2 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 4, qNote, 2, track1);
    }
    generatedMidi.Tracks[1] = track1;
    generatedMidi.Tracks[2] = track2;
    hasGeneratedMidi = true;
    updateSongGeneratorPage();
    setEnabled("song_generator_play", true);
    setEnabled("song_generator_save", true);
}
function playGeneratedSong() {
    if (generatedMidi == null)
        return;
    // get selected tempo
    const tempoSelected = document.getElementById(`song_generator_tempo`).value;
    const tempo = parseInt(tempoSelected);
    generatedMidi.UpdateTempo(0, tempo, 0 /*general tempo*/);
    // get selected tracks
    let tracksSelected = getSelectedTracks();
    generatedMidi.EnableTracks(tracksSelected);
    generatedMidi.Play();
}
function saveGeneratedSong() {
    const fileName = `Counterpoint_1-1`;
    generatedMidi.Save(`${fileName}.mid`);
}
function resetGeneratedSong() {
    generatedMidi = new MidiFile(1, 2, qNote);
    ;
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
    // get selected tracks
    let tracksSelected = getSelectedTracks();
    generatedMidi.EnableTracks(tracksSelected);
    let nbTracksSelected = 0;
    for (let i = 0; i < 2; i++)
        if (tracksSelected[i])
            nbTracksSelected++;
    document.getElementById('song_generator_generate').innerText = (nbTracksSelected > 1) ?
        `${getString("generate_new_song")}` : `${getString("generate_new_track")}`;
    const hasSelectedTracks = (nbTracksSelected > 0);
    setEnabled('song_generator_generate', hasSelectedTracks);
    setEnabled('song_generator_play', hasGeneratedMidi && hasSelectedTracks);
    // update generated song texts if existing
    /*for (let i = 1; i <= 2; i++)
    {
        let trackText = "";
        let trackColor = "silver";

        if (hasSong)
        {
            const track = midiFile.Tracks[i];
            if (track != null)
            {
                trackText = track.Text();
                trackColor = track.muted ? "silver" : "black";
            }
        }

        (<HTMLSpanElement>document.getElementById(`song_generator_track_text${i}`)).innerText = trackText;
        (<HTMLSpanElement>document.getElementById(`song_generator_track_text${i}`)).style.color = trackColor;
    }*/
    setEnabled("song_generator_reset", hasGeneratedMidi);
    // for debug purposes
    /*if (false)
    if (hasSong)
    {
        let intervalsStr = "";
        for (let i = 0; i < generatedSong.tracks[0].notes.length; i++)
        {
            const noteValue0 = generatedSong.tracks[0].GetNoteValue(i);
            const noteValue1 = generatedSong.tracks[1].GetNoteValue(i);
            intervalsStr += getIntervalBetweenNotes(noteValue1, noteValue0) + " ";
        }
        intervalsStr = intervalsStr.trim();
        (<HTMLSpanElement>document.getElementById(`song_generator_tracks_intervals`)).innerText = intervalsStr;
    }*/
}
//# sourceMappingURL=song_generator.js.map
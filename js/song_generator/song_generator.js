"use strict";
const generatedSongTypes = new Map();
generatedSongTypes.set("counterpoint 2:1", "counterpoint_2-1");
generatedSongTypes.set("counterpoint 1:1", "counterpoint_1-1");
const qNote = 480; // quarter-note division
let generatedMidi = new MidiFile(1, 2, qNote);
generatedMidi.Tempo(0, 120, 0);
generatedMidi.TimeSignature(0, 4, 4, 0);
let hasGeneratedMidi = false;
function generateNewSong() {
    // get selected tonic
    const tonicSelected = document.getElementById(`song_generator_tonic`).value;
    const tonic = parseInt(tonicSelected);
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
    const selectedTypeId = getSelectedSongType('song_generator_type');
    const rhythmFactor2Array = [1 / 2, 3 / 4];
    const octave1 = 2;
    const octave2 = 4;
    const channelId1 = 1;
    const channelId2 = 2;
    // track 0: set selected tempo
    generatedMidi.UpdateTempo(0, tempo, 0);
    // generate tracks
    let track1 = generatedMidi.Tracks[1]; // bass
    let track2 = generatedMidi.Tracks[2];
    let trackCandidate = null;
    if (tracksSelected[0] && !tracksSelected[1]) {
        if (selectedTypeId == "counterpoint_2-1") {
            // reduce 2:1 counterpoint track to 1 note per bar track
            let track2Reduced = ReduceTrack21(track2, channelId2);
            trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave1, qNote, channelId1, track2Reduced);
        }
        else
            trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave1, qNote, channelId1, track2);
        if (trackCandidate != null)
            track1 = trackCandidate;
    }
    else if (!tracksSelected[0] && tracksSelected[1]) {
        if (selectedTypeId == "counterpoint_2-1")
            trackCandidate = GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octave2, qNote, channelId2, rhythmFactor2Array, track1);
        else
            trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave2, qNote, channelId2, track1);
        if (trackCandidate != null)
            track2 = trackCandidate;
    }
    else if (tracksSelected[0] && tracksSelected[1]) {
        // regenate CF track if no counterpoint melody generated
        const nbTries = 100;
        let trackCandidate2 = null;
        for (let i = 0; i < nbTries; i++) {
            trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave1, qNote, channelId1);
            if (trackCandidate != null) {
                if (selectedTypeId == "counterpoint_2-1")
                    trackCandidate2 = GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octave2, qNote, channelId2, rhythmFactor2Array, trackCandidate);
                else
                    trackCandidate2 = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave2, qNote, channelId2, trackCandidate);
            }
            if (trackCandidate != null && trackCandidate2 != null)
                break;
        }
        if (trackCandidate != null)
            track1 = trackCandidate;
        if (trackCandidate2 != null)
            track2 = trackCandidate2;
    }
    // update generated tracks
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
    // TODO: add option to merge into 1 track?
    const tonicName = getSelectorText("song_generator_tonic");
    const scaleName = getSelectorText("song_generator_scale");
    const fileName = `${getSelectedSongTypeText('song_generator_type')} - ${tonicName} ${scaleName}`;
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
function updateSongTypeSelector(id) {
    // get selector
    const typeSelect = document.getElementById(id);
    const initialized = (typeSelect.options != null && typeSelect.options.length > 0);
    if (!initialized) {
        // add song types
        for (const [key, value] of generatedSongTypes) {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = key.replace("counterpoint", getString("counterpoint"));
            typeSelect.appendChild(option);
        }
    }
    else {
        // update
        for (const option of typeSelect.options) {
            const key = option.value;
            option.innerHTML = key.replace("counterpoint", getString("counterpoint"));
        }
    }
    // disable if only 1 option
    typeSelect.disabled = (typeSelect.options.length <= 1);
}
function getSelectedSongType(id) {
    const typeSelect = document.getElementById(id);
    const typeString = typeSelect.value;
    const typeId = generatedSongTypes.get(typeString);
    return typeId;
}
function getSelectedSongTypeText(id) {
    const typeSelect = document.getElementById(id);
    const typeIndex = typeSelect.selectedIndex;
    const typeText = typeSelect.options[typeIndex].text;
    return typeText;
}
//# sourceMappingURL=song_generator.js.map
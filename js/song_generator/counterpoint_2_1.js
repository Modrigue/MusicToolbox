"use strict";
function GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [1 / 2], trackCF = null) {
    // generate track candidate and check its melodic fluency
    const nbTries = 10000;
    let track = new MidiTrack(channelId);
    for (let i = 0; i < nbTries; i++) {
        track = generateCounterpointTrack12Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray, trackCF);
        if (hasMelodicFluency(track, tonic, octave, scaleValues))
            break;
    }
    return track;
}
function generateCounterpointTrack12Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [1 / 2], trackCF = null) {
    let track = new MidiTrack(channelId);
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;
    // build 1:1 counterpoint
    const track11 = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
    const track11NbNotes = track11.GetNbNotes();
    // TODO: forbid tone repetition for 1st and 2nd notes
    // TODO: allow dissonant intervals for 2nd notes iff. passing tones
    // TODO: allow direct 5ths/8ves for 2nd notes
    // TODO: allow direct 5ths/8ves for 1st notes iff. contrary motion
    // TODO: avoid consecutive tone repetition for 2nd notes of 2 consecutive bars
    // TODO: prevent melodies' lowest/highest points happening at the same bar
    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
    let index1 = 0;
    for (const event of track11.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        const note1Value = track11.GetNoteValue(index1);
        const note1 = GetNoteFromValue(note1Value);
        const octave1 = GetOctaveFromValue(note1Value);
        const duration = event.DeltaTime;
        const rhythmsFactor = rhythmFactorArray[index1 % nbRhythms];
        // 1st bar: start with delay to enhance separation effect
        if (index1 == 0 && hasTrackCF) {
            // no 1st note
            AddNoteEvent(track, note1, octave1, rhythmsFactor * duration, (1 - rhythmsFactor) * duration);
        }
        // last bar: replace 1st note by consonnant interval and set tonic as 2nd note
        else if (index1 == track11NbNotes - 1) {
            // replace 1st note with new value
            const note1Index = scaleNotesValues.indexOf(note1Value);
            const track2NbNotes = track.GetNbNotes();
            const note2ValuePrev = track.GetNoteValue(track2NbNotes - 1);
            const note2Prev = GetNoteFromValue(note2ValuePrev);
            const octave2Prev = GetOctaveFromValue(note2ValuePrev);
            let note2PrevIndex = scaleNotesValues.indexOf(note2ValuePrev);
            let note1ValueNew = GetRandomNoteValueInScale(note2PrevIndex - 1, note1Index + 1, scaleNotesValues);
            // prevent tonic
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++) {
                let acceptNote = (GetNoteFromValue(note1ValueNew) != tonic);
                if (acceptNote)
                    break;
                else // generate new note
                    note1ValueNew = GetRandomNoteValueInScale(note2PrevIndex - 1, note1Index + 1, scaleNotesValues);
            }
            AddNoteValueEvent(track, note1ValueNew, 0, rhythmsFactor * duration);
            // set tonic as 2nd note
            AddNoteEvent(track, note1, octave1, 0, (1 - rhythmsFactor) * duration);
        }
        else {
            // keep existing note as 1st bar note
            AddNoteEvent(track, note1, octave1, 0, rhythmsFactor * duration);
            // create new 2nd note
            const note1Index = scaleNotesValues.indexOf(note1Value);
            const note1ValueNext = track11.GetNoteValue(index1 + 1);
            const note1Next = GetNoteFromValue(note1ValueNext);
            const octave1Next = GetOctaveFromValue(note1ValueNext);
            let note1NextIndex = scaleNotesValues.indexOf(note1ValueNext);
            let note2ValueNew = GetRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
            // prevent specific notes
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++) {
                let acceptNote = false;
                // at penultimate bar, prevent tonic as 2nd note
                if (index1 == track11NbNotes - 2)
                    acceptNote = (GetNoteFromValue(note2ValueNew) != tonic);
                // prevent 3 consecutive same notes
                else if (index1 < track11NbNotes - 2) {
                    // new 2nd note between 2 existing consecutive same notes
                    let has3ConsecutiveSameNotes = (note1Value == note1ValueNext && note2ValueNew == note1ValueNext);
                    // new 2nd note after 1 new and 1 existing consecutive same notes
                    const track2NbNotes = track.GetNbNotes();
                    if (track2NbNotes >= 2) {
                        const note2ValuePrev = track.GetNoteValue(track2NbNotes - 2);
                        has3ConsecutiveSameNotes = has3ConsecutiveSameNotes
                            || (note2ValuePrev == note1Value && note2ValueNew == note2ValuePrev);
                    }
                    acceptNote = !has3ConsecutiveSameNotes;
                }
                if (acceptNote)
                    break;
                else // generate new note
                    note2ValueNew = GetRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
                //console.log(noteCurIndex, noteNewIndex, noteNextIndex);
            }
            // TODO: apply counterpoint rules to accept new note
            AddNoteValueEvent(track, note2ValueNew, 0, (1 - rhythmsFactor) * duration);
        }
        index1++;
    }
    return track;
}
//# sourceMappingURL=counterpoint_2_1.js.map
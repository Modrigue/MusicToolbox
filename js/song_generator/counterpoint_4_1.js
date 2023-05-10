"use strict";
function GenerateCounterpointTrack41(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [[1 / 4, 1 / 4, 1 / 4, 1 / 4]], trackCF = null) {
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // generate candidate track and check its melodic fluency and coherency
    const nbTries = 1000;
    let track = null;
    let success = false;
    for (let i = 0; i < nbTries; i++) {
        track = generateCounterpointTrack41Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray, trackCF);
        if (track == null)
            return null;
        //if (hasTrackCF)
        //    success = (hasMelodicFluency(track, tonic, octave, scaleValues) && checkCounterpoint41(<MidiTrack>trackCF, track));
        //else
        //    success = hasMelodicFluency(track, tonic, octave, scaleValues);
        //
        //if (success)
        return track;
    }
    return null;
}
function generateCounterpointTrack41Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [[1 / 4, 1 / 4, 1 / 4, 1 / 4]], trackCF = null) {
    let track41 = new MidiTrack(channelId);
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;
    // build 2:1 counterpoint
    const track21 = GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octave, qNote, channelId, [[1 / 2, 1 / 2]], trackCF);
    if (track21 == null)
        return null;
    const track21NbNotes = track21.GetNbNotes();
    const track11NbNotes = Math.ceil(track21NbNotes / 2);
    let index21 = 0;
    for (const event of track21.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        const note21Value = track21.GetNoteValue(index21);
        //const note21 = GetNoteFromValue(note21Value);
        //const octave21 = GetOctaveFromValue(note21Value);
        //const note1Index = scaleNotesValues.indexOf(note1Value);
        //const duration = event.DeltaTime;
        if (index21 == 0 && hasTrackCF) {
            // 1st note
            AddNoteValueEvent(track41, note21Value, 2 * qNote, qNote);
            AddNoteValueEvent(track41, note21Value, 0, qNote);
        }
        else if (index21 == track21NbNotes - 1) {
            // last note: ends on 3rd beat
            AddNoteValueEvent(track41, note21Value, 0, qNote);
        }
        else {
            AddNoteValueEvent(track41, note21Value, 0, qNote);
            AddNoteValueEvent(track41, note21Value, 0, qNote);
        }
        //const rhythmsArray = rhythmFactorArray[index21 % nbRhythms];
        //const rhythmsFactor1 = rhythmsArray[0];
        index21++;
    }
    return track41;
}
function acceptNoteInCounterpoint41(note2Value, tonicValue, barIndex, nbBars, track41, track11, trackCF = null) {
    // TODO: on 4th note, allow only disonnant intervals if passing tones
    // TODO: on 3rd note, allow only disonnant intervals
    //       if 2nd and 4th notes form consonant intervals
    // TODO: Nota cambiata:?
    //  If 2nd note form a dissonant internal,
    //  and if there is a gap (in scale) to fill between 2nd and 3rd notes,
    //  fill gap in 4th note
    // TODO: 3 possible cadences for penultimate bar:
    //  - All 4 notes asc/descend to tonic
    //  - 1st, 2nd and 3rd notes desc/ascend and 4th note asc/descends to tonic
    //  - 1st note desc/ascends and 2nd, 3rd, 4th notes asc/descends to tonic
    return true;
}
function checkCounterpoint41(track1, track2) {
    return true;
}
// reduce 4:1 counterpoint track to 1 note per bar track
function ReduceTrack41(track41, channelId) {
    let track11 = new MidiTrack(channelId);
    const track41NbNotes = track41.GetNbNotes();
    // build reduced 1 note par bar track
    let noteIndex = 2;
    for (const event of track41.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        // take only 1st bar note,
        // except for 1st bar when 1st note starts on half bar (= 3rd note)
        // and for last bar when 3rd note is tonic
        let skipNote = ((noteIndex % 4) != 0);
        if (noteIndex == 2) // 2nd note of first bar
            skipNote == false;
        else if (noteIndex == track41NbNotes - 3) // 1st note of last bar
            skipNote == true;
        else if (noteIndex == track41NbNotes - 1) // 3rd note of last bar
            skipNote == false;
        if (skipNote) {
            noteIndex++;
            continue;
        }
        const noteValue = track41.GetNoteValue(noteIndex);
        AddNoteValueEvent(track11, noteValue, 0, 4 * qNote);
        noteIndex++;
    }
    return track11;
}
//# sourceMappingURL=counterpoint_4_1.js.map
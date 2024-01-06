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
        if (hasTrackCF)
            success = ( /*hasMelodicFluency(track, tonic, octave, scaleValues) &&*/checkCounterpoint41(trackCF, track));
        else
            success = true; //hasMelodicFluency(track, tonic, octave, scaleValues);
        if (success)
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
    // build scale notes values array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
    let index21 = 0;
    for (const event of track21.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        const note21Value = track21.GetNoteValue(index21);
        const note21 = GetNoteFromValue(note21Value);
        const octave21 = GetOctaveFromValue(note21Value);
        const note21Index = scaleNotesValues.indexOf(note21Value);
        const duration = event.DeltaTime;
        const note21ValueNext = track21.GetNoteValue(index21 + 1);
        let note21NextIndex = scaleNotesValues.indexOf(note21ValueNext);
        const barIndex = Math.floor(index21 / 2);
        const rhythmsArray = rhythmFactorArray[barIndex % nbRhythms];
        if (index21 == 0 && hasTrackCF) {
            // 1st note on 4th beat
            AddNoteMonoValueEvent(track41, note21Value, 3 * qNote, qNote);
            //// 1st notes: 3rd and 4th beats
            //AddNoteValueEvent(track41, note21Value, 2*qNote, qNote);
            //AddNoteValueEvent(track41, note21Value, 0, qNote);
        }
        else if (index21 == track21NbNotes - 1) {
            //// last note: ends on 3rd beat
            //AddNoteValueEvent(track41, note21Value, 0, qNote);
        }
        else {
            // create new note on 2nd / 4th beat
            let note4ValueNew = -1;
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++) {
                note4ValueNew = GetRandomNoteValueInScale(note21Index - 2, note21NextIndex + 2, scaleNotesValues);
                if (acceptNoteInCounterpoint41(note4ValueNew, tonic, index21, nbBars, track41, track21, trackCF))
                    break;
            }
            const note21PosInBar = ((index21 + 1) % 2);
            AddNoteMonoValueEvent(track41, note21Value, 0, rhythmsArray[2 * note21PosInBar] * 2 * duration);
            AddNoteMonoValueEvent(track41, note4ValueNew, 0, rhythmsArray[2 * note21PosInBar + 1] * 2 * duration);
        }
        index21++;
    }
    return track41;
}
function acceptNoteInCounterpoint41(note4Value, tonicValue, barIndex, nbBars, track41, track21, trackCF = null) {
    const track21NbNotes = track21.GetNbNotes();
    const track41NbNotes = track41.GetNbNotes();
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    let note4PosInBar = ((track41NbNotes + 1) % 4);
    if (note4PosInBar == 0)
        note4PosInBar = 4;
    const note2Value = track21.GetNoteValue(2 * barIndex + Math.floor(note4PosInBar / 4));
    const note2ValueNext = track21.GetNoteValue(2 * barIndex + Math.floor(note4PosInBar / 4) + 1);
    const note4ValuePrev = track41.GetNoteValue(track41NbNotes - 1);
    // prevent tone repetition for 1st and 2nd notes
    if (GetNoteFromValue(note4Value) == GetNoteFromValue(note2Value))
        return false;
    // prevent consecutive tone repetition for 2nd notes of 2 consecutive bars
    if (GetNoteFromValue(note4Value) == GetNoteFromValue(note4ValuePrev))
        return false;
    if (hasTrackCF) {
        if (0 < barIndex) {
            // compute current candidate interval with existing track note
            const noteCFValue = trackCF.GetNoteValue(barIndex);
            const noteCFValueNext = trackCF.GetNoteValue(barIndex + 1);
            const interval2Next = GetIntervalBetweenNotes(note2ValueNext, noteCFValueNext);
            const interval4Cur = GetIntervalBetweenNotes(note4Value, noteCFValue);
            if (note4PosInBar == 4) {
                // prevent parallel octaves and 5ths
                if (interval4Cur == 7 && interval2Next == 7)
                    return false;
                if (interval4Cur == 5 && interval2Next == 5)
                    return false;
                if (interval4Cur == 0 && interval2Next == 0)
                    return false;
                // on 4th note, allow only dissonnant intervals if passing tones
                const motion4_34 = GetMotionBetweenNotes(note2Value, note4Value);
                const motion4NextBar = GetMotionBetweenNotes(note4Value, note2ValueNext);
                if (isDissonantInterval(interval4Cur))
                    if (motion4_34 != motion4NextBar)
                        return false;
                // 3 possible cadences for penultimate bar:
                if (barIndex == Math.floor(track21NbNotes / 2) - 2) {
                    const note2ValuePrev = track21.GetNoteValue(2 * barIndex + Math.floor(note4PosInBar / 4) - 1);
                    const motion4_12 = GetMotionBetweenNotes(note2ValuePrev, note4ValuePrev);
                    const motion4_23 = GetMotionBetweenNotes(note4ValuePrev, note2Value);
                    let isCadenceAllowed = false;
                    //  - All 4 notes asc/descend to tonic
                    if (motion4_12 == motion4_23 && motion4_23 == motion4_34 && motion4_34 == motion4NextBar)
                        isCadenceAllowed = true;
                    //  - 1st, 2nd and 3rd notes desc/ascend and 4th note asc/descends to tonic
                    if (motion4_12 == motion4_23 && motion4_23 == motion4_34 && motion4_34 != motion4NextBar)
                        isCadenceAllowed = true;
                    //  - 1st note desc/ascends and 2nd, 3rd, 4th notes asc/descends to tonic
                    if (motion4_12 != motion4_23 && motion4_23 == motion4_34 && motion4_34 == motion4NextBar)
                        isCadenceAllowed = true;
                    if (!isCadenceAllowed)
                        return false;
                }
            }
            // on 3rd note, allow only disonnant intervals
            // if 2nd and 4th notes form consonant intervals
            const interval2Cur = GetIntervalBetweenNotes(note2Value, noteCFValue);
            if (isDissonantInterval(interval2Cur) && isDissonantInterval(interval4Cur))
                return false;
            // TODO: Nota cambiata:?
            //  If 2nd note form a dissonant internal,
            //  and if there is a gap (in scale) to fill between 2nd and 3rd notes,
            //  fill gap in 4th note
        }
    }
    return true;
}
function checkCounterpoint41(track1, track2) {
    // prevent melodies' lowest/highest points happening at close bars
    let nbNotes = [-1, -1];
    let indexTrack = 0;
    let noteValuesMax = [-1, -1];
    let noteValuesMin = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let indexValuesMax = [-1, -1];
    let indexValuesMin = [-1, -1];
    for (const track of [track1, track2]) {
        nbNotes[indexTrack] = track.GetNbNotes();
        let indexNote = 0;
        for (const event of track.Events) {
            if (event.Type != MidiTrackEventType.NOTE_OFF)
                continue;
            const noteValue = track.GetNoteValue(indexNote);
            if (noteValue > noteValuesMax[indexTrack]) {
                noteValuesMax[indexTrack] = noteValue;
                indexValuesMax[indexTrack] = indexNote;
            }
            if (noteValue < noteValuesMin[indexTrack]) {
                noteValuesMin[indexTrack] = noteValue;
                indexValuesMin[indexTrack] = indexNote;
            }
            indexNote++;
        }
        indexTrack++;
    }
    // set track with highest nb. of notes as counterpoint above
    const indexTrackBelow = (nbNotes[1] < nbNotes[0]) ? 1 : 0;
    const indexTrackAbove = 1 - indexTrackBelow;
    // prevent close highest and lowest notes
    if (Math.abs(indexValuesMax[indexTrackBelow] - 0.5 * indexValuesMax[indexTrackAbove]) <= 1)
        return false;
    if (Math.abs(indexValuesMin[indexTrackBelow] - 0.5 * indexValuesMin[indexTrackAbove]) <= 1)
        return false;
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
        AddNoteMonoValueEvent(track11, noteValue, 0, 4 * qNote);
        noteIndex++;
    }
    return track11;
}
//# sourceMappingURL=counterpoint_4_1.js.map
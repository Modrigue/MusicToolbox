"use strict";
function GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [[1 / 2, 1 / 2]], trackCF = null) {
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // generate candidate track and check its melodic fluency and coherency
    const nbTries = 1000;
    let track = null;
    let success = false;
    for (let i = 0; i < nbTries; i++) {
        track = generateCounterpointTrack21Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray, trackCF);
        if (track == null)
            return null;
        if (hasTrackCF)
            success = (hasMelodicFluency(track, tonic, octave, scaleValues) && checkCounterpoint21(trackCF, track));
        else
            success = hasMelodicFluency(track, tonic, octave, scaleValues);
        if (success)
            return track;
    }
    return null;
}
function generateCounterpointTrack21Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [[1 / 2, 1 / 2]], trackCF = null) {
    let track21 = new MidiTrack(channelId);
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;
    // build 1:1 counterpoint
    const track11 = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
    if (track11 == null)
        return null;
    const track11NbNotes = track11.GetNbNotes();
    // build scale notes values array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
    let index1 = 0;
    for (const event of track11.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        const note1Value = track11.GetNoteValue(index1);
        const note1 = GetNoteFromValue(note1Value);
        const octave1 = GetOctaveFromValue(note1Value);
        const note1Index = scaleNotesValues.indexOf(note1Value);
        const duration = event.DeltaTime;
        const note1ValueNext = track11.GetNoteValue(index1 + 1);
        let note1NextIndex = scaleNotesValues.indexOf(note1ValueNext);
        const rhythmsArray = rhythmFactorArray[index1 % nbRhythms];
        const rhythmsFactor1 = rhythmsArray[0];
        // 1st bar: start with delay to enhance separation effect
        if (index1 == 0 && hasTrackCF) {
            // no 1st note
            AddNoteMonoEvent(track21, note1, octave1, rhythmsFactor1 * duration, (1 - rhythmsFactor1) * duration);
        }
        // last bar: replace 1st note by consonnant interval and set tonic as 2nd note
        else if (index1 == track11NbNotes - 1) {
            // replace 1st note with new value
            const track21NbNotes = track21.GetNbNotes();
            const note2ValuePrev = track21.GetNoteValue(track21NbNotes - 1);
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
            AddNoteMonoValueEvent(track21, note1ValueNew, 0, rhythmsFactor1 * duration);
            // set tonic as 2nd note
            AddNoteMonoEvent(track21, note1, octave1, 0, (1 - rhythmsFactor1) * duration);
        }
        else {
            // keep existing note as 1st bar note
            AddNoteMonoEvent(track21, note1, octave1, 0, rhythmsFactor1 * duration);
            // create new 2nd note
            let note2ValueNew = -1;
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++) {
                note2ValueNew = GetRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
                if (acceptNoteInCounterpoint21(note2ValueNew, tonic, index1, nbBars, track21, track11, trackCF))
                    break;
            }
            AddNoteMonoValueEvent(track21, note2ValueNew, 0, (1 - rhythmsFactor1) * duration);
        }
        index1++;
    }
    return track21;
}
function acceptNoteInCounterpoint21(note2Value, tonicValue, barIndex, nbBars, track21, track11, trackCF = null) {
    const track11NbNotes = track11.GetNbNotes();
    const track21NbNotes = track21.GetNbNotes();
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    const note1Value = track11.GetNoteValue(barIndex);
    const note1ValueNext = track11.GetNoteValue(barIndex + 1);
    const note2ValuePrev = track21.GetNoteValue(track21NbNotes - 1);
    // prevent tone repetition for 1st and 2nd notes
    if (GetNoteFromValue(note2Value) == GetNoteFromValue(note1Value))
        return false;
    // prevent consecutive tone repetition for 2nd notes of 2 consecutive bars
    if (GetNoteFromValue(note2Value) == GetNoteFromValue(note2ValuePrev))
        return false;
    if (hasTrackCF) {
        if (0 < barIndex && barIndex < track11NbNotes - 1) {
            // compute current candidate interval with existing track note
            const noteCFValue = trackCF.GetNoteValue(barIndex);
            const noteCFValueNext = trackCF.GetNoteValue(barIndex + 1);
            const interval1Next = GetIntervalBetweenNotes(note1ValueNext, noteCFValueNext);
            const interval2Cur = GetIntervalBetweenNotes(note2Value, noteCFValue);
            // prevent parallel octaves and 5ths
            if (interval2Cur == 7 && interval1Next == 7)
                return false;
            if (interval2Cur == 5 && interval1Next == 5)
                return false;
            if (interval2Cur == 0 && interval1Next == 0)
                return false;
            // prevent direct 5ths/8ves for 2nd notes
            const motion12 = GetMotionBetweenNotes(note1Value, note2Value);
            const motionCF = GetMotionBetweenNotes(noteCFValue, noteCFValueNext);
            const hasSameMotion = (motion12 == motionCF);
            if (hasSameMotion && (interval2Cur == 0 || interval2Cur == 7 || interval2Cur == 5))
                return false;
            // allow dissonant intervals for 2nd notes iff. passing tones
            if (isDissonantInterval(interval2Cur)) {
                const motion1To2 = GetMotionBetweenNotes(note1Value, note2Value);
                const motion2ToNext = GetMotionBetweenNotes(note2Value, note1ValueNext);
                if (motion1To2 != motion2ToNext)
                    return false;
                // prevent dissonant neighbors with consonant suspension:
                //  2nd note forming dissonant interval
                //  with 1st note of current bar == 1st note of the next bar
                if (noteCFValue == noteCFValueNext)
                    return false;
            }
        }
    }
    // at penultimate bar, prevent tonic as 2nd note
    if (barIndex == track11NbNotes - 2) {
        if (GetNoteFromValue(note2Value) == GetNoteFromValue(tonicValue))
            return false;
    }
    // prevent 3 consecutive same notes
    else if (barIndex < track11NbNotes - 2) {
        // new 2nd note between 2 existing consecutive same notes
        let has3ConsecutiveSameNotes = (note1Value == note1ValueNext && note2Value == note1ValueNext);
        // new 2nd note after 1 new and 1 existing consecutive same notes
        const track21NbNotes = track21.GetNbNotes();
        if (track21NbNotes >= 2) {
            const note2ValuePrev = track21.GetNoteValue(track21NbNotes - 2);
            has3ConsecutiveSameNotes = has3ConsecutiveSameNotes
                || (note2ValuePrev == note1Value && note2Value == note2ValuePrev);
        }
        if (has3ConsecutiveSameNotes)
            return false;
    }
    return true;
}
function checkCounterpoint21(track1, track2) {
    // force contrary motion in penultimate bar (to avoid direct octave)?
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
// reduce 2:1 counterpoint track to 1 note per bar track
function ReduceTrack21(track21, channelId) {
    let track11 = new MidiTrack(channelId);
    const track21NbNotes = track21.GetNbNotes();
    // build reduced 1 note par bar track
    let noteIndex = 1;
    for (const event of track21.Events) {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        // take only 1st bar note,
        // except for 1st bar when 1st note starts on half bar
        // and for last bar when 2nd note is tonic
        let skipNote = ((noteIndex % 2) != 0);
        if (noteIndex == 1) // 2nd note of first bar
            skipNote == false;
        else if (noteIndex == track21NbNotes - 2) // 1st note of last bar
            skipNote == true;
        else if (noteIndex == track21NbNotes - 1) // 2nd note of last bar
            skipNote == false;
        if (skipNote) {
            noteIndex++;
            continue;
        }
        const noteValue = track21.GetNoteValue(noteIndex);
        AddNoteMonoValueEvent(track11, noteValue, 0, 4 * qNote);
        noteIndex++;
    }
    return track11;
}
//# sourceMappingURL=counterpoint_2_1.js.map
"use strict";
const perfectConsonances = [0, 7]; // unison, 8ves and 5ths
const imperfectConsonances = [3, 4, 8, 9]; // 3rds and 6ths
const dissonances = [1, 2, 5, 6, 10, 11]; // 2nds, 4ths and 7ths
const intervalCounterpoint11RangeFactor = 0.8;
function GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF = null) {
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // generate candidate track and check its melodic fluency and coherency
    const nbTries = 10000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++) {
        track = generateCounterpointTrack11Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
        if (hasTrackCF)
            success = (hasMelodicFluency(track, tonic, octave, scaleValues) && checkCounterpoint11(trackCF, track));
        else
            success = hasMelodicFluency(track, tonic, octave, scaleValues);
        if (success)
            return track;
    }
    return null;
}
function generateCounterpointTrack11Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF = null) {
    let track = new MidiTrack(channelId);
    const nbNotesInScale = scaleValues.length;
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    const intervalRange = Math.round(intervalCounterpoint11RangeFactor * nbNotesInScale);
    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
    // allow tonic as 1st note
    // in counterpoint above only: allow 3rds and 5ths (in scale) as start note
    let startIntervals = [0]; // tonic
    if (hasTrackCF) {
        const noteValueStartCF = trackCF.GetNoteValue(0);
        const octaveCF = GetOctaveFromValue(noteValueStartCF);
        let isCounterpointAbove = (octave > octaveCF);
        if (isCounterpointAbove) {
            let startIntervalsAllowed = [3, 4, 7, -5 /*5th below*/];
            for (const interval of startIntervalsAllowed)
                if (scaleValues.indexOf((interval + 12) % 12) >= 0)
                    startIntervals.push(interval);
        }
    }
    const startInterval = getRandomArrayElement(startIntervals);
    AddNoteEvent(track, tonic + startInterval, octave, 0, 4 * qNote);
    // generate random notes in scale
    const nbTries = 10000;
    let noteCurValue = GetNoteValueFromNoteOctave(tonic, octave);
    let noteCurIndex = scaleNotesValues.indexOf(noteCurValue);
    for (let barIndex = 1; barIndex < nbBars - 1; barIndex++) {
        let noteNextValue = -1;
        let noteNextIndex = -1;
        for (let i = 0; i < nbTries; i++) 
        //while (!acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
        {
            // get random step
            let indexIntervalNext = GetRandomGaussianNumber(-intervalRange + 1, intervalRange - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);
            noteNextIndex = noteCurIndex + indexIntervalNext;
            noteNextIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteNextIndex));
            noteNextValue = scaleNotesValues[noteNextIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);
            if (acceptNoteInCounterpoint11(noteNextValue, tonic, barIndex, nbBars, track, trackCF))
                break;
        }
        // ok, add note
        AddNoteValueEvent(track, noteNextValue, 0, 4 * qNote);
        noteCurIndex = noteNextIndex;
    }
    // last note: fetch nearest tonic
    let distMin = -1;
    let octaveEnd = -1;
    const lastNoteValue = track.GetNoteValue(track.GetNbNotes() - 1);
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++) {
        let tonicCurValue = GetNoteValueFromNoteOctave(tonic, octaveCur);
        const dist = Math.abs(lastNoteValue - tonicCurValue);
        if (distMin < 0 || dist < distMin) {
            distMin = dist;
            octaveEnd = octaveCur;
        }
    }
    AddNoteEvent(track, tonic, octaveEnd, 0, 4 * qNote);
    //console.log(track.LogText());
    return track;
}
function acceptNoteInCounterpoint11(noteValue, tonicValue, barIndex, nbBars, trackCurrent, trackCF = null) {
    if (noteValue < 0)
        return false;
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    // do not set tonic at starting or ending bars (except final bar)
    const range = 2;
    if (GetNoteFromValue(noteValue) == GetNoteFromValue(tonicValue))
        if (barIndex <= range /* start */ || nbBars - barIndex - 1 <= range /* end */)
            return false;
    //// do not allow 2 consecutive unissons
    //if (trackCurrent.GetNbNotes() > 2)
    //{
    //    const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
    //    const lastNoteValue2 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 2);
    //
    //    if (lastNoteValue1 == lastNoteValue2 && noteValue == lastNoteValue1)
    //        return false;
    //}
    // if cantus firmus, do not allow unisson
    if (!hasTrackCF && trackCurrent.Events.length > 1) {
        const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
        if (noteValue == lastNoteValue1)
            return false;
    }
    // apply counterpoint rules
    if (hasTrackCF) {
        // compute current candidate interval with existing track note
        const note1CFValue = trackCF.GetNoteValue(barIndex);
        const interval1 = GetIntervalBetweenNotes(noteValue, note1CFValue);
        // avoid dissonant intervals
        if (dissonances.indexOf(interval1) >= 0)
            return false;
        if (isMicrotonalInterval(interval1))
            return false;
        const note2CFValue = trackCF.GetNoteValue(barIndex - 1);
        const note2CurValue = trackCurrent.GetNoteValue(barIndex - 1);
        const interval2 = GetIntervalBetweenNotes(note2CurValue, note2CFValue);
        // avoid parallel octaves and 5ths
        if (interval1 == 7 && interval2 == 7)
            return false;
        if (interval1 == 5 && interval2 == 5)
            return false;
        if (interval1 == 0 && interval2 == 0)
            return false;
        if (interval1 == 0 && barIndex == nbBars - 2)
            return false;
        // avoid direct octaves and 5ths
        const curMotion = GetMotionBetweenNotes(note2CurValue, noteValue);
        const cfMotion = GetMotionBetweenNotes(note2CFValue, note1CFValue);
        const hasSameMotion = (curMotion == cfMotion);
        if (hasSameMotion && (interval1 == 0 || interval1 == 7 || interval1 == 5))
            return false;
        // avoid 2 consecutive perfect consonnances
        if (perfectConsonances.indexOf(interval1) >= 0 && perfectConsonances.indexOf(interval2) >= 0)
            return false;
        // avoid 3 consecutive 3rds and 6ths
        if (barIndex >= 2) {
            const existingNoteValue3 = trackCF.GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = GetIntervalBetweenNotes(curNoteValue3, existingNoteValue3);
            if (imperfectConsonances.indexOf(curInterval3) >= 0)
                if (curInterval3 == interval2 && interval2 == interval1)
                    return false;
        }
    }
    return true;
}
function checkCounterpoint11(track1, track2) {
    // force contrary motion in penultimate bar (to avoid direct octave)?
    // prevent melodies' lowest/highest points happening at close bars
    let indexTrack = 0;
    let noteValuesMax = [-1, -1];
    let noteValuesMin = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let indexValuesMax = [-1, -1];
    let indexValuesMin = [-1, -1];
    for (const track of [track1, track2]) {
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
    // prevent close highest and lowest notes
    if (Math.abs(indexValuesMax[0] - indexValuesMax[1]) <= 1)
        return false;
    if (Math.abs(indexValuesMin[0] - indexValuesMin[1]) <= 1)
        return false;
    return true;
}
//# sourceMappingURL=counterpoint_1_1.js.map
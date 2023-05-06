"use strict";
const perfectConsonances = [0, 7]; // unison, 8ves and 5ths
const imperfectConsonances = [3, 4, 8, 9]; // 3rds and 6ths
const dissonances = [1, 2, 5, 6, 10, 11]; // 2nds, 4ths and 7ths
const intervalCounterpoint11RangeFactor = 0.8;
function GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF = null) {
    // generate track candidate and check its melodic fluency
    const nbTries = 10000;
    let track = new MidiTrack(channelId);
    for (let i = 0; i < nbTries; i++) {
        track = generateCounterpointTrack11Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
        if (hasMelodicFluency(track, tonic, octave, scaleValues))
            break;
    }
    return track;
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
    let curNoteValue = GetNoteValueFromNoteOctave(tonic, octave);
    let curNoteIndex = scaleNotesValues.indexOf(curNoteValue);
    for (let barIndex = 1; barIndex < nbBars - 1; barIndex++) {
        let noteValueNext = -1;
        let nextNoteIndex = -1;
        for (let i = 0; i < nbTries; i++) 
        //while (!acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
        {
            // get random step
            let indexIntervalNext = GetRandomGaussianNumber(-intervalRange + 1, intervalRange - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);
            nextNoteIndex = curNoteIndex + indexIntervalNext;
            nextNoteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, nextNoteIndex));
            noteValueNext = scaleNotesValues[nextNoteIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);
            if (acceptNote11(noteValueNext, tonic, barIndex, nbBars, track, trackCF))
                break;
        }
        // ok, add note
        AddNoteValueEvent(track, noteValueNext, 0, 4 * qNote);
        curNoteIndex = nextNoteIndex;
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
    // TODO: force contrary motion in penultimate bar (to avoid direct octave)?
    // TODO: prevent melodies' lowest/highest points happening at the same bar
    AddNoteEvent(track, tonic, octaveEnd, 0, 4 * qNote);
    //console.log(track.LogText());
    return track;
}
function acceptNote11(noteValue, tonicValue, barIndex, nbBars, trackCurrent, trackCF = null) {
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
        const existingNoteValue1 = trackCF.GetNoteValue(barIndex);
        const curInterval1 = GetIntervalBetweenNotes(noteValue, existingNoteValue1);
        // avoid dissonant intervals
        if (dissonances.indexOf(curInterval1) >= 0)
            return false;
        if (isMicrotonalInterval(curInterval1))
            return false;
        const existingNoteValue2 = trackCF.GetNoteValue(barIndex - 1);
        const curNoteValue2 = trackCurrent.GetNoteValue(barIndex - 1);
        const curInterval2 = GetIntervalBetweenNotes(curNoteValue2, existingNoteValue2);
        // avoid parallel octaves and 5ths
        if (curInterval1 == 7 && curInterval2 == 7)
            return false;
        if (curInterval1 == 0 && curInterval2 == 0)
            return false;
        if (curInterval1 == 0 && barIndex == nbBars - 2)
            return false;
        // avoid direct octaves and 5ths
        const curMotion = GetMotionBetweenNotes(curNoteValue2, noteValue);
        const existingMotion = GetMotionBetweenNotes(existingNoteValue2, existingNoteValue1);
        const hasSameMotion = (curMotion == existingMotion);
        if (hasSameMotion && (curInterval1 == 0 || curInterval1 == 7))
            return false;
        // avoid 2 consecutive perfect consonnances
        if (perfectConsonances.indexOf(curInterval1) >= 0 && perfectConsonances.indexOf(curInterval2) >= 0)
            return false;
        // avoid 3 consecutive 3rds and 6ths
        if (barIndex >= 2) {
            const existingNoteValue3 = trackCF.GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = GetIntervalBetweenNotes(curNoteValue3, existingNoteValue3);
            if (imperfectConsonances.indexOf(curInterval3) >= 0)
                if (curInterval3 == curInterval2 && curInterval2 == curInterval1)
                    return false;
        }
    }
    return true;
}
//# sourceMappingURL=counterpoint_1_1.js.map
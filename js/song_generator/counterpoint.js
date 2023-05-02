"use strict";
const perfectConsonances = [0, 7]; // unison, 8ves and 5ths
const imperfectConsonances = [3, 4, 8, 9]; // 3rds and 6ths
const dissonances = [1, 2, 5, 6, 10, 11]; // 2nds, 4ths and 7ths
const intervalCounterpoint11RangeFactor = 0.8;
function generateCounterpointTrack12(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray = [1 / 2], trackCF = null) {
    let track = new MidiTrack(channelId);
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 0);
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;
    // build 1:1 counterpoint
    const track11 = generateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
    const track11NbNotes = track11.GetNbNotes();
    // build allowed scale notes array
    const scaleNotesValues = getScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
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
            addNoteEvent(track, note1, octave1, rhythmsFactor * duration, (1 - rhythmsFactor) * duration);
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
            let note1ValueNew = getRandomNoteValueInScale(note2PrevIndex - 1, note1Index + 1, scaleNotesValues);
            // prevent tonic
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++) {
                let acceptNote = (GetNoteFromValue(note1ValueNew) != tonic);
                if (acceptNote)
                    break;
                else // generate new note
                    note1ValueNew = getRandomNoteValueInScale(note2PrevIndex - 1, note1Index + 1, scaleNotesValues);
            }
            addNoteValueEvent(track, note1ValueNew, 0, rhythmsFactor * duration);
            // set tonic as 2nd note
            addNoteEvent(track, note1, octave1, 0, (1 - rhythmsFactor) * duration);
        }
        else {
            // keep existing note as 1st bar note
            addNoteEvent(track, note1, octave1, 0, rhythmsFactor * duration);
            // create new 2nd note
            const note1Index = scaleNotesValues.indexOf(note1Value);
            const note1ValueNext = track11.GetNoteValue(index1 + 1);
            const note1Next = GetNoteFromValue(note1ValueNext);
            const octave1Next = GetOctaveFromValue(note1ValueNext);
            let note1NextIndex = scaleNotesValues.indexOf(note1ValueNext);
            let note2ValueNew = getRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
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
                    note2ValueNew = getRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
                //console.log(noteCurIndex, noteNewIndex, noteNextIndex);
            }
            // TODO: apply counterpoint rules to accept new note
            addNoteValueEvent(track, note2ValueNew, 0, (1 - rhythmsFactor) * duration);
        }
        index1++;
    }
    return track;
}
function generateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF = null) {
    let track = new MidiTrack(channelId);
    const nbNotesInScale = scaleValues.length;
    //const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 0);
    const intervalRange = Math.round(intervalCounterpoint11RangeFactor * nbNotesInScale);
    // build allowed scale notes array
    const scaleNotesValues = getScaleNotesOctaveRangeValues(tonic, scaleValues, octave);
    // 1st note = tonic
    addNoteEvent(track, tonic, octave, 0, 4 * qNote);
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
            let indexIntervalNext = getRandomGaussianNumber(-intervalRange + 1, intervalRange - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);
            nextNoteIndex = curNoteIndex + indexIntervalNext;
            nextNoteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, nextNoteIndex));
            noteValueNext = scaleNotesValues[nextNoteIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);
            if (acceptNote(noteValueNext, tonic, barIndex, nbBars, track, trackCF))
                break;
        }
        // ok, add note
        addNoteValueEvent(track, noteValueNext, 0, 4 * qNote);
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
    addNoteEvent(track, tonic, octaveEnd, 0, 4 * qNote);
    //console.log(track.LogText());
    return track;
}
function acceptNote(noteValue, tonicValue, barIndex, nbBars, trackCurrent, trackCF = null) {
    if (noteValue < 0)
        return false;
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 0);
    // melodic fluency
    // TODO: do not allow too much leaps
    // TODO: after big ascending, resp. desc. leap, force small descending, resp. asc. intervals
    //       big = > major 3rd
    //       more important for upward leaps
    // TODO: after big leap, fill gap with intermediate scale notes
    // TODO: set highest and lowest notes as 3rds, 5ths, 6ths or 8ves of the tonic
    // TODO: set highest and lowest notes appear only once
    // TODO: no consecutive same notes for cantus firmus
    // 1:1
    // TODO: allow 3rds and 5ths as start note in counterpoint above (but not in counterpoint below)
    // TODO: force contrary motion in penultimate bar (to avoid direct octave)
    // TODO: prevent 2 consecutive perfect consonnances
    // TODO: prevent melodies' lowest/highest points happening at the same time
    // 2:1
    // TODO: forbid tone reptition for 1st and 2nd notes
    // TODO: allow dissonant intervals for 2nd notes iff. passing tones
    // TODO: allow direct 5ths/8ves for 2nd notes
    // TODO: allow direct 5ths/8ves for 1st notes iff. contrary motion
    // TODO: avoid consecutive tone repetition for 2nd notes of 2 consecutive bars
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
    // do not allow unisson
    if (trackCurrent.Events.length > 1) {
        const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
        if (noteValue == lastNoteValue1)
            return false;
    }
    // apply counterpoint rules
    if (hasTrackCF) {
        // compute current candidate interval with existing track note
        const existingNoteValue1 = trackCF.GetNoteValue(barIndex);
        const curInterval1 = getIntervalBetweenNotes(noteValue, existingNoteValue1);
        // avoid dissonant intervals
        if (dissonances.indexOf(curInterval1) >= 0)
            return false;
        if (isMicrotonalInterval(curInterval1))
            return false;
        const existingNoteValue2 = trackCF.GetNoteValue(barIndex - 1);
        const curNoteValue2 = trackCurrent.GetNoteValue(barIndex - 1);
        const curInterval2 = getIntervalBetweenNotes(curNoteValue2, existingNoteValue2);
        // avoid parallel octaves and 5ths
        if (curInterval1 == 7 && curInterval2 == 7)
            return false;
        if (curInterval1 == 0 && curInterval2 == 0)
            return false;
        if (curInterval1 == 0 && barIndex == nbBars - 2)
            return false;
        // avoid direct octaves and 5ths
        const curMotion = getMotionBetweenNotes(curNoteValue2, noteValue);
        const existingMotion = getMotionBetweenNotes(existingNoteValue2, existingNoteValue1);
        const hasSameMotion = (curMotion == existingMotion);
        if (hasSameMotion && (curInterval1 == 0 || curInterval1 == 7))
            return false;
        // no 3 consecutive 3rds and 6ths
        if (barIndex >= 2) {
            const existingNoteValue3 = trackCF.GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = getIntervalBetweenNotes(curNoteValue3, existingNoteValue3);
            if (imperfectConsonances.indexOf(curInterval3) >= 0)
                if (curInterval3 == curInterval2 && curInterval2 == curInterval1)
                    return false;
        }
    }
    return true;
}
function addNoteValueEvent(track, noteValue, start, duration) {
    const note = GetNoteFromValue(noteValue);
    const octave = GetOctaveFromValue(noteValue);
    addNoteEvent(track, note, octave, start, duration);
}
function addNoteEvent(track, note, octave, start, duration) {
    const vel = 102;
    let noteValue = GetNoteValueFromNoteOctave(note, octave);
    let noteValueInt = ToNoteValueInt(noteValue);
    // handle pitch bend if specified
    let cents = ToNoteValueCents(noteValue);
    const hasPitchBend = (cents != 0);
    if (hasPitchBend)
        track.PitchBend(cents, 0);
    track.NoteOn(noteValueInt, start, vel);
    track.NoteOff(noteValueInt, duration);
    if (hasPitchBend)
        track.PitchBend(0, 0);
}
function getIntervalBetweenNotes(noteValue1, noteValue2) {
    const note1 = (noteValue1 % 12);
    const note2 = (noteValue2 % 12);
    return (note1 - note2 + 12) % 12;
}
function getMotionBetweenNotes(noteValuePrev, noteValueNext) {
    if (noteValueNext > noteValuePrev)
        return 1;
    else if (noteValueNext < noteValuePrev)
        return -1;
    return 0;
}
// build allowed scale notes array from octaves range
function getScaleNotesOctaveRangeValues(tonicValue, scaleValues, octave) {
    const scaleNotesValues = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
        for (const scaleValue of scaleValues)
            scaleNotesValues.push(tonicValue + scaleValue + 12 * (octaveCur + 2));
    return scaleNotesValues;
}
function getRandomNoteValueInScale(indexMin, indexMax, scaleNotesValues, gaussian = true) {
    if (scaleNotesValues == null || scaleNotesValues.length == 0)
        return -1;
    let noteIndex = gaussian ? getRandomGaussianNumber(indexMin, indexMax) : getRandomNumber(indexMin, indexMax);
    noteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteIndex));
    return scaleNotesValues[noteIndex];
}
//# sourceMappingURL=counterpoint.js.map
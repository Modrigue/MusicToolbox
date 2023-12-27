// sources:
// https://www.youtube.com/watch?v=olvz-4tKiRc
// https://www.youtube.com/watch?v=g-4dw1T3v30


function GenerateCounterpointTrack4S(tonic: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, rhythmFactorArray: Array<Array<number>> = [[1/2, 1/2]], trackCF: (MidiTrack | null) = null): (MidiTrack | null)
{ 
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    
    // generate candidate track and check its melodic fluency and coherency
    const nbTries = 1000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {
        track = generateCounterpointTrack4SCandidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray, trackCF);

        if (hasTrackCF)
            success = (hasMelodicFluency(track, tonic, octave, scaleValues) && checkCounterpoint4S(<MidiTrack>trackCF, track));
        else
            success = hasMelodicFluency(track, tonic, octave, scaleValues);

        if (success)
            return track;
    }

    return null;
}

function generateCounterpointTrack4SCandidate(tonic: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, rhythmFactorArray: Array<Array<number>> = [[1/2, 1/2]], trackCF: (MidiTrack | null) = null): MidiTrack
{    
    let track = new MidiTrack(channelId);
    const nbNotesInScale = scaleValues.length;
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);

    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;

    const intervalRange = Math.round(intervalCounterpoint11RangeFactor*nbNotesInScale);

    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);

    // allow tonic as 1st note
    // in counterpoint above only: allow 3rds and 5ths (in scale) as start note
    let startIntervals: Array<number> = [0]; // tonic
    if (hasTrackCF)
    {
        const noteValueStartCF = (<MidiTrack>trackCF).GetNoteValue(0);
        const octaveCF = GetOctaveFromValue(noteValueStartCF);
        let isCounterpointAbove = (octave > octaveCF);

        if (isCounterpointAbove)
        {
            let startIntervalsAllowed: Array<number> = [3, 4, 7, -5 /*5th below*/];
            for (const interval of startIntervalsAllowed)
                if (scaleValues.indexOf((interval + 12) % 12) >= 0)
                    startIntervals.push(interval);
        }
    }

    const startInterval = <number>getRandomArrayElement(startIntervals);

    // set rhythm in 1st and 2nd bars
    const rhythmsArray0 = rhythmFactorArray[0];
    const rhythmsArray1 = rhythmFactorArray[1 % nbRhythms];
    AddNoteEvent(track, tonic + startInterval, octave, rhythmsArray0[0]*4*qNote,
        (rhythmsArray0[1] + rhythmsArray1[0])*4*qNote);

    // generate random notes in scale
    const nbTries = 10000;
    let noteCurValue = GetNoteValueFromNoteOctave(tonic, octave);
    let noteCurIndex = scaleNotesValues.indexOf(noteCurValue);
    for (let barIndex = 1; barIndex < nbBars - 1; barIndex++)
    {
        let noteNextValue = -1;
        let noteNextIndex = -1;

        const rhythmsArrayCur  = rhythmFactorArray[barIndex % nbRhythms];
        const rhythmsArrayNext = rhythmFactorArray[(barIndex + 1) % nbRhythms];

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
        AddNoteValueEvent(track, noteNextValue, 0, (rhythmsArrayCur[1] + rhythmsArrayNext[0])*4*qNote);
        noteCurIndex = noteNextIndex;
    }

    // last note: fetch nearest tonic
    let distMin = -1;
    let octaveEnd = -1;
    const lastNoteValue = track.GetNoteValue(track.GetNbNotes() - 1);
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
    {
        let tonicCurValue = GetNoteValueFromNoteOctave(tonic, octaveCur);
        const dist = Math.abs(lastNoteValue - tonicCurValue);
        if (distMin < 0 || dist < distMin)
        {
            distMin = dist;
            octaveEnd = octaveCur;
        }
    }

    const rhythmsArrayLast = rhythmFactorArray[(nbBars - 1) % nbRhythms];
    AddNoteEvent(track, tonic, octaveEnd, 0, rhythmsArrayLast[1]*4*qNote);
    //console.log(track.LogText());

    return track;
}

// reduced track must respect 1:1 counterpoint rules
function acceptNoteInCounterpoint4S(noteValue: number, tonicValue: number, barIndex: number, nbBars: number,
    trackCurrent: MidiTrack, trackCF: (MidiTrack | null) = null): boolean
{
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
    if (!hasTrackCF && trackCurrent.Events.length > 1)
    {
        const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
        if (noteValue == lastNoteValue1)
            return false;
    }

    // apply counterpoint rules
    if (hasTrackCF)
    {
        // compute current candidate interval with existing track note
        const note1CFValue = (<MidiTrack>trackCF).GetNoteValue(barIndex);
        const interval1 = GetIntervalBetweenNotes(noteValue, note1CFValue);

        // compute interval formed by syncope at next bar
        const note1CFSyncValue = (<MidiTrack>trackCF).GetNoteValue(barIndex + 1);
        const interval1Sync = GetIntervalBetweenNotes(noteValue, note1CFSyncValue);

        // dissonant syncopes must be prepared as consonances on previous upbeats
        // dissonant syncopes must resolve (downwards?) by step to a consonance
        if (isDissonantInterval(interval1Sync) && isDissonantInterval(interval1))
            return false;

        const note2CFValue = (<MidiTrack>trackCF).GetNoteValue(barIndex - 1);
        const note2CurValue = trackCurrent.GetNoteValue(barIndex - 1);
        const interval2 = GetIntervalBetweenNotes(note2CurValue, note2CFValue);

        // avoid parallel octaves and 5ths

        if (interval1 == 7 && interval2 == 7)
            return false;
        else if (interval1 == 5 && interval2 == 5)
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
        if (barIndex >= 2)
        {
            const existingNoteValue3 = (<MidiTrack>trackCF).GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = GetIntervalBetweenNotes(curNoteValue3, existingNoteValue3);

            if (imperfectConsonances.indexOf(curInterval3) >= 0)
            if (curInterval3 == interval2 && interval2 == interval1)
                return false;
        }

        // (at penultimate bar, resolve (upwards?) to tonic)
    }

    return true;
}

function checkCounterpoint4S(track1: MidiTrack, track2: MidiTrack): boolean
{
    // force contrary motion in penultimate bar (to avoid direct octave)?

    // prevent melodies' lowest/highest points happening at close bars

    let indexTrack = 0;
    let noteValuesMax: Array<number> = [-1, -1];
    let noteValuesMin: Array<number> = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let indexValuesMax: Array<number> = [-1, -1];
    let indexValuesMin: Array<number> = [-1, -1];
    for (const track of [track1, track2])
    {
        let indexNote = 0;
        for (const event of track.Events)
        {
            if (event.Type != MidiTrackEventType.NOTE_OFF)
                continue;
                
            const noteValue = track.GetNoteValue(indexNote);
    
            if (noteValue > noteValuesMax[indexTrack])
            {
                noteValuesMax[indexTrack] = noteValue;
                indexValuesMax[indexTrack] = indexNote;
            }
            if (noteValue < noteValuesMin[indexTrack])
            {
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
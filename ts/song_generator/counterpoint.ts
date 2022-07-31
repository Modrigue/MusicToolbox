const perfectConsonances   = [0, 7];                 // octave and 5th
const imperfectConsonances = [3, 4, 8, 9];           // 3rds and 6ths
const dissonances          = [1, 2, 5, 6, 10, 11];   // 2nds, 4ths and 7ths

function generateCounterpointTrack11(tonicValue: number, scaleValues: Array<number>, nbBars: number, octave: number,
    trackExisting: Track = new Track()): Track
{
    let track = new Track();
    const nbNotesInScale = scaleValues.length;
    const hasExistingTrack = (trackExisting.notes != null && trackExisting.notes.length > 0);

    // build allowed scale notes array
    let scaleNotesValues: Array<number> = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
    {
        for (const scaleValue of scaleValues)
        {
            scaleNotesValues.push(tonicValue + scaleValue + 12*(octaveCur + 2));  
        }
    }  

    // 1st note = tonic
    track.AddNote(new Note(tonicValue, octave, 4, 0));

    // generate random notes in scale
    const nbTries = 10000;
    let curNoteIndex = scaleNotesValues.indexOf(tonicValue + 12*(octave + 2));
    for (let barIndex = 1; barIndex < nbBars - 1; barIndex++)
    {
        let noteValueNext = -1;
        let nextNoteIndex = -1;
        for (let i = 0; i < nbTries; i++)
        //while (!acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
        {
            // get random step
            let indexIntervalNext = getRandomGaussianNumber(-nbNotesInScale + 1, nbNotesInScale - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);

            nextNoteIndex = curNoteIndex + indexIntervalNext;
            nextNoteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, nextNoteIndex));
            
            noteValueNext = scaleNotesValues[nextNoteIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);

            if (acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
                break;
        }

        // ok, add note
        const valueNext = noteValueNext % 12;
        const octaveNext = Math.floor(noteValueNext / 12) - 2;
        track.AddNote(new Note(valueNext, octaveNext, 4, 4*barIndex));

        curNoteIndex = nextNoteIndex;
    }

    // last note: fetch nearest tonic
    let distMin = -1;
    let octaveEnd = -1;
    const lastNoteValue = track.GetNoteValue(track.notes.length - 1);
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
    {
        const dist = Math.abs(lastNoteValue - (tonicValue + 12*(octaveCur + 2)));
        if (distMin < 0 || dist < distMin)
        {
            distMin = dist;
            octaveEnd = octaveCur;
        }
    }

    track.AddNote(new Note(tonicValue, octaveEnd, 4, 4*(nbBars - 1)));
    //console.log(track.LogText());
    return track;
}

function acceptNote(noteValue: number, tonicValue: number, barIndex: number, nbBars: number,
    trackCurrent: Track, trackExisting: Track = new Track()): boolean
{
    if (noteValue < 0)
        return false;
    
    const hasExistingTrack = (trackExisting.notes != null && trackExisting.notes.length > 0);

    // do not set tonic at starting or ending bars (except final bar)
    const range = 2;
    if (noteValue % 12 == tonicValue % 12)
    if (barIndex <= range /* start */ || nbBars - barIndex - 1 <= range /* end */)
        return false;

    //// do not allow 2 consecutive unissons
    //if (trackCurrent.notes.length > 2)
    //{
    //    const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.notes.length - 1);
    //    const lastNoteValue2 = trackCurrent.GetNoteValue(trackCurrent.notes.length - 2);
    //
    //    if (lastNoteValue1 == lastNoteValue2 && noteValue == lastNoteValue1)
    //        return false;
    //}

    // do not allow unisson
    if (trackCurrent.notes.length > 1)
    {
        const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.notes.length - 1);
        if (noteValue == lastNoteValue1)
            return false;
    }

    // apply counterpoint rules
    if (hasExistingTrack)
    {
        // compute current candidate interval with existing track note
        const existingNoteValue1 = trackExisting.GetNoteValue(barIndex);
        const curInterval1 = getIntervalBetweenNotes(noteValue, existingNoteValue1);

        // avoid dissonant intervals
        if (dissonances.indexOf(curInterval1) >= 0)
            return false;
        if (isMicrotonalInterval(curInterval1))
            return false;

        const existingNoteValue2 = trackExisting.GetNoteValue(barIndex - 1);
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
        if (barIndex >= 2)
        {
            const existingNoteValue3 = trackExisting.GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = getIntervalBetweenNotes(curNoteValue3, existingNoteValue3);

            if (imperfectConsonances.indexOf(curInterval3) >= 0)
            if (curInterval3 == curInterval2 && curInterval2 == curInterval1)
                return false;
        }
    }

    return true;
}

function getIntervalBetweenNotes(noteValue1: number, noteValue2: number): number
{
    const note1 = (noteValue1 % 12);
    const note2 = (noteValue2 % 12);
    return (note1 - note2 + 12) % 12;
}

function getMotionBetweenNotes(noteValuePrev: number, noteValueNext: number): number
{
    if (noteValueNext > noteValuePrev)
        return 1;
    else if (noteValueNext < noteValuePrev)
        return -1;
    
    return 0;
}
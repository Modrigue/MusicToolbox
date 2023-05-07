function hasMelodicFluency(track : MidiTrack, tonic: number, octave: number, scaleValues: Array<number>): boolean
{
    const tonicValue = GetNoteValueFromNoteOctave(tonic, octave);
    const nbNotesInScale = scaleValues.length;

    // compute highest and lowest note values
    let nbNotes = 0;
    let noteValueMax = -1;
    let noteValueMin = Number.MAX_SAFE_INTEGER;
    for (const event of track.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
            
        const noteValue = track.GetNoteValue(nbNotes);

        if (noteValue > noteValueMax)
            noteValueMax = noteValue;
        if (noteValue < noteValueMin)
            noteValueMin = noteValue;

        nbNotes++;
    }

    if (noteValueMax == tonicValue)
        return false;

    // ensure highest and lowest notes perfect/imperfect consonances
    const intervalMax = GetIntervalBetweenNotes(noteValueMax, tonicValue);
    const intervalMin = GetIntervalBetweenNotes(tonicValue, noteValueMin);
    if (perfectConsonances.indexOf(intervalMax) < 0 && imperfectConsonances.indexOf(intervalMax) < 0)
        return false;
    if (perfectConsonances.indexOf(intervalMin) < 0 && imperfectConsonances.indexOf(intervalMin) < 0)
        return false;
    //console.log(tonicValue, noteValueMin, noteValueMax, intervalMin, intervalMax);

    // compute highest and lowest note values nb. of occurrences
    // (do not count 1st and last notes)
    let noteValueMaxNb = 0;
    let noteValueMinNb = 0;
    let index = 0;
    for (const event of track.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        
        if (index == 0)
        {
            index++;
            continue;
        }
        else if (index == nbNotes - 1)
            continue;
        
        const noteValue = track.GetNoteValue(index);
        if (noteValue == noteValueMax)
            noteValueMaxNb++;
        if (noteValue == noteValueMin)
            noteValueMinNb++;
        
        index++;
    }

    // ensure highest and lowest notes appear only once
    if (noteValueMaxNb != 1 || noteValueMinNb != 1)
        return false;

    // prevent too much unisons and big leaps (|big leap| => major 3rd interval)

    const nbUnisonsAllowed = Math.floor(nbNotes / 8) + 1; // arbitrary
    let nbUnisons = 0;
    
    const intervalBigLeapMin = 5;
    let nbBigLeapsAsc = 0;
    let nbBigLeapsDesc = 0;
    let indexBigLeapAsc = -1;
    let indexBigLeapDesc = -1;
    const nbBigLeapsAllowed = Math.floor(nbNotes / 8) + 1; // arbitrary

    index = 0;
    for (const event of track.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        
        if (index == 0)
        {
            index++;
            continue;
        }

        const noteValueCur = track.GetNoteValue(index);
        const noteValuePrev = track.GetNoteValue(index - 1);
        const intervalCur = noteValueCur - noteValuePrev;

        const notePrev = GetNoteFromValue(noteValuePrev);
        const octavePrev = GetOctaveFromValue(noteValuePrev);

        // after big ascending leaps, ensure smallest descending intervals (in scale)
        if (nbNotesInScale >= 7)
        if (indexBigLeapAsc >= 0 && (index == indexBigLeapAsc + 1 || index == indexBigLeapAsc + 2))
        { 
            // compute expected smallest descending interval in scale
            const scaleIntervalPrev = (notePrev - tonic + 12) % 12;
            const scaleIntervalPrevPos = scaleValues.indexOf(scaleIntervalPrev)
            if (scaleIntervalPrevPos >= 0)
            {
                const scaleIntervalCurPosExpected = (scaleIntervalPrevPos - 1 + nbNotesInScale) % nbNotesInScale;
                const scaleIntervalCurExpected = scaleValues[scaleIntervalCurPosExpected];
                const noteValueCurExpected = GetNoteValueFromNoteOctave(tonic + scaleIntervalCurExpected, octavePrev);

                if (noteValueCur != noteValueCurExpected)
                    return false;
            }
        }

        // after big descending leaps, ensure small ascending intervals
        if (nbNotesInScale >= 7)
        if (indexBigLeapDesc >= 0 && (index == indexBigLeapDesc + 1 || index == indexBigLeapDesc + 2))
            if (intervalCur < 0 || intervalCur >= intervalBigLeapMin)
                return false;

        // count unisions and big leaps
        if (intervalCur == 0)
            nbUnisons++;
        if (intervalCur >= intervalBigLeapMin)
        {
            nbBigLeapsAsc++;
            indexBigLeapAsc = index;

            // prevent big ascending leap in penultimate bars
            if (nbNotesInScale >= 7)
            if (index == nbNotes - 1 || index == nbNotes - 2)
                return false;
        }
        if (intervalCur <= -intervalBigLeapMin)
        {
            nbBigLeapsDesc++;
            indexBigLeapDesc = index;

            // prevent big descending leap in penultimate bars?
            //if (nbNotesInScale >= 7)
            //if (index == nbNotes - 1 || index == nbNotes - 2)
            //    return false;
        }

        index++;
    }

    if (nbUnisons > nbUnisonsAllowed)
        return false;
    if (nbBigLeapsAsc > nbBigLeapsAllowed || nbBigLeapsDesc > nbBigLeapsAllowed)
        return false;

    //console.log("MELODIC FLUENCY OK");
    return true;
}
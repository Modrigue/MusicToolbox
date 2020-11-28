// find chords from notes
function findChords(notesValues, onlyFirstNoteAsFundamental = false)
{
    if (notesValues == null || notesValues.length < 2  || notesValues.length > 5)
        return [];

    let chordsArray = [];
    const nbNotesInChord = notesValues.length;
    let chordsDict = chords2Dict;
    if (nbNotesInChord == 3)
        chordsDict = chords3Dict;
    if (nbNotesInChord == 4)
        chordsDict = chords4Dict;
    else if (nbNotesInChord == 5)
        chordsDict = chords5Dict;

    // switch fundamental and compute intervals
    for (let i = 0; i < nbNotesInChord; i++)
    {
        if (onlyFirstNoteAsFundamental && i > 0)
            break;

        let fundamental = notesValues[i];
        let intervalsValues = [];
        for (let value of notesValues)
        {
            const interval = (value - fundamental + 10*12) % 12;
            intervalsValues.push(interval);
        }
        
        // sort intervals
        intervalsValues.sort((a, b) => a - b);

        // find chords ids with octave
        const chordsIdsFound = getChordsIdsWithOctave(intervalsValues);
        for (let chordId of chordsIdsFound)
        {
            if (chordId !=  null && chordId !=  "" && chordId !=  "?")
                chordsArray.push([fundamental, chordId]);
        }
    }

    return chordsArray;
}

function getChordsIdsWithOctave(intervalsValues)
{
    let chordsIdsArray = [];
    let intervalsValuesArray = [];

    const nbNotesInChord = intervalsValues.length;
    let chordsDict = chords2Dict;
    if (nbNotesInChord == 3)
        chordsDict = chords3Dict;
    if (nbNotesInChord == 4)
        chordsDict = chords4Dict;
    else if (nbNotesInChord == 5)
        chordsDict = chords5Dict;

    // compute all intervals combinations with octave
    getIntervalsWithOctave(intervalsValues, intervalsValuesArray);

    // serach corresponding chord ids
    for (let intervalsValuesFound of intervalsValuesArray)
    {
        const chordId = getKeyFromValue(chordsDict, intervalsValuesFound);
        if (chordId !=  null && chordId !=  "" && chordId !=  "?")
            chordsIdsArray.push(chordId);
    }

    return chordsIdsArray;
}

function getIntervalsWithOctave(intervalsValues, intervalsValuesArray, intervalIndex = 0)
{
    const nbNotesInChord = intervalsValues.length;
        
    // start: do not compute fundamental's octave
    if (intervalIndex == 0)
    {
        intervalsValuesArray.push([intervalsValues[0]]);
        getIntervalsWithOctave(intervalsValues, intervalsValuesArray, 1);
    }
    else if (intervalIndex < nbNotesInChord)
    {
        let nbTries = 0;
        let intervalsValuesArrayCur = cloneArrayArrayWithItemLength(intervalsValuesArray, intervalIndex);
        for (let intervalsValueBuild of intervalsValuesArrayCur)
        {   
            const intervalsBuildCurrent = cloneIntegerArray(intervalsValueBuild);
            const intervalsBuildOctave = cloneIntegerArray(intervalsValueBuild);
            
            // add current value and its octave
            intervalsBuildCurrent.push(intervalsValues[intervalIndex]);
            intervalsBuildOctave.push(intervalsValues[intervalIndex] + 12);
            
            intervalsValuesArray.push(intervalsBuildCurrent, intervalsBuildOctave);

            if (intervalIndex < nbNotesInChord - 1)
            {
                getIntervalsWithOctave(intervalsValues, intervalsValuesArray, intervalIndex + 1);
            }

            // secure
            nbTries++;
            if (nbTries > 16)
                break;
        }

        // keep only intervals array with expected number of notes
        arrayArrayFilterWithItemLength(intervalsValuesArray, nbNotesInChord);

        // sort found intervals arrays
        for (let intervals of intervalsValuesArray)
        {
            intervals.sort((a, b) => a - b);
        }
    }
}
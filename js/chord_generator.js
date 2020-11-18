const MAX_CHORD_FRET_RANGE = 4;

function getNotesPositionsOnString(noteValue, stringValue, posMin, posMax, includeEmptyString = true)
{
    let positions = [];

    // include empty string if option allowed
    if (includeEmptyString && noteValue == stringValue)
        positions.push(0);

    // browse positions on string
    for (let pos = posMin; pos <= posMax; pos++)
    {
        const curNoteValue = (stringValue + pos) % 12;
        if (curNoteValue == noteValue && !positions.includes(pos))
            positions.push(pos);
    }

    return positions;
}

function generateChords(notesValues)
{
    if (notesValues == null || notesValues.length < 2)
        return null;

    let chordsPositions = [];
    const fundamental = notesValues[0];

    const nbStrings = tuning.length;
    const nbNotes = notesValues.length;

    for (let startString = 0; startString <= nbStrings - nbNotes; startString++)
    {
        const positionsString0 = getNotesPositionsOnString(fundamental, tuning[startString], 0, 11);
        for (let p0 of positionsString0)
        {
            // get start positions
            let startPositions = [];
            for (let i = 0; i < startString; i++)
                startPositions.push(-1);
            startPositions.push(p0);

            // init algorithm
            addChordNoteOnString(notesValues, startString, startString + 1, startPositions, chordsPositions);
        }
    }

    return chordsPositions;
}

// recurse on strings
function addChordNoteOnString(notesValues, startIndex, stringIndex, positionsCur, chordsPositions)
{
    // secure
    const nbStrings = tuning.length;
    if (stringIndex >= nbStrings)
        return;

    // find notes on current string
    for (let noteValue of notesValues)
    {
        const range = getSearchRange(positionsCur);

        // exclude note from previous string
        if (stringIndex > startIndex && positionsCur != null)
            if (noteValue == (positionsCur[positionsCur.length - 1] + tuning[stringIndex - 1]) % 12)
                continue;

        const positionsOnString = getNotesPositionsOnString(noteValue, tuning[stringIndex], range[0], range[1]);

        for (let pos of positionsOnString)
        {
            let positionsCandidate = [...positionsCur];
            positionsCandidate.push(pos);
            
            if (chordPositionsValid(notesValues, positionsCandidate))
            {
                // complete positions with remaining not hit strings
                let positionsCandidateComplete = [...positionsCandidate];
                for (let i = 0; i < nbStrings - stringIndex - 1; i++)
                    positionsCandidateComplete.push(-1);

                chordsPositions.push(positionsCandidateComplete);
            }

            // find notes on next string
            if (stringIndex + 1 < nbStrings)
                addChordNoteOnString(notesValues, startIndex, stringIndex + 1, positionsCandidate, chordsPositions);
        }
    }
}

function chordPositionsValid(notesValues, positionsCandidate)
{
    // check if all notes are included
    if (!chordPositionsIncludeNotes(notesValues, positionsCandidate))
        return false;
    
    // check positions range
    let positionsNotEmpty = [...positionsCandidate];
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, 0);
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, -1);
    if (positionsNotEmpty != null && positionsNotEmpty > 1)
    {
        const posMax = Math.min(...positionsNotEmpty);
        const posMin = Math.max(...positionsNotEmpty);
        if (posMax - posMin > MAX_CHORD_FRET_RANGE)
            return false;
    }

    // check finger positions

    // sort chord by score
    
    return true;
}

function chordPositionsIncludeNotes(notesValues, positionsCandidate)
{
    if (notesValues == null || notesValues.length < 2)
        return false;
    if (positionsCandidate == null || positionsCandidate.length < 2)
        return false;

    if (positionsCandidate.length < notesValues)
        return false;

    let notesValuesToFind = [...notesValues];
    let stringIndex = 0;
    for (let pos of positionsCandidate)
    {
        // string not hit
        if (pos < 0)
        {
            stringIndex++;
            continue;
        }

        const curStringValue = tuning[stringIndex];
        const curNoteValue = (pos + curStringValue) % 12;

        if (!notesValues.includes(curNoteValue))
            return false;

        if (notesValuesToFind.includes(curNoteValue))
            notesValuesToFind = arrayRemoveValue(notesValuesToFind, curNoteValue);

        stringIndex++;
    }

    return (notesValuesToFind.length == 0);
}

function getSearchRange(positions)
{
    // do not count empty strings
    let positionsNotEmpty = [...positions];
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, 0); // empty position
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, -1); // no position
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return [0, 12];

    const posMin = Math.max(Math.max(...positionsNotEmpty) - MAX_CHORD_FRET_RANGE, 0);
    const posMax = Math.min(...positionsNotEmpty) + MAX_CHORD_FRET_RANGE;
    
    return [posMin, posMax];
}

function arrayRemoveValue(array, value)
{
    return array.filter(function(element){ return element != value; });
}

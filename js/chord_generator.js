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

    // generate all valid chord positions
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

    // sort positions

    let propertiesArray = [];
    for (let pos of chordsPositions)
    {
        let prop = new ChordPositionsProperties(pos)
        propertiesArray.push(prop);
    }
    propertiesArray.sort(compareChordPositionsProperties);

    let sortedChordsPositions = [];
    for (let prop of propertiesArray)
        sortedChordsPositions.push(prop.positions);

    return sortedChordsPositions;
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
    let positionsNotEmpty = removePositionsEmpty(positionsCandidate);
    if (positionsNotEmpty != null && positionsNotEmpty > 1)
    {
        const posMax = Math.min(...positionsNotEmpty);
        const posMin = Math.max(...positionsNotEmpty);
        if (posMax - posMin > MAX_CHORD_FRET_RANGE)
            return false;
    }

    // check finger positions

    
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
    let positionsNotEmpty = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return [0, 12];

    const posMin = Math.max(Math.max(...positionsNotEmpty) - MAX_CHORD_FRET_RANGE, 0);
    const posMax = Math.min(...positionsNotEmpty) + MAX_CHORD_FRET_RANGE;
    
    return [posMin, posMax];
}

function getChordPositionsRange(positions)
{
    // do not count empty strings
    let positionsNotEmpty = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return 0;

    const posMax = Math.max(...positionsNotEmpty);
    const posMin = Math.min(...positionsNotEmpty);
    
    return (posMax - posMin + 1);
}

function getChordPositionNbHitStrings(positions)
{
    return positions.filter(function(pos){ return pos >= 0; }).length;
}

// remove empty and not hit strings
function removePositionsEmpty(positions)
{
    if (positions == null || positions.length == 0)
        return positions;

    let positionsNotEmpty = [...positions];
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, 0); // empty position
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return positionsNotEmpty;

    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, -1); // not hit

    return positionsNotEmpty;
}


class ChordPositionsProperties
{
    constructor(positions)
    {
      this.positions = positions;
      this.computeScores();
    }

    // compute all scores
    computeScores()
    {
        this.maxPosition = Math.max(...this.positions);
        this.range = getChordPositionsRange(this.positions);
        this.nbStringsHit = getChordPositionNbHitStrings(this.positions);
    }
}

function compareChordPositionsProperties(a, b)
{
    // min max position
    if (a.maxPosition < b.maxPosition)
        return -1;
    if (a.maxPosition > b.maxPosition)
        return 1;

    //  min range
    if (a.range < b.range)
        return -1;
    if (a.range > b.range)
        return 1;

    // max nb. of hit strings
    if (a.nbStringsHit > b.nbStringsHit)
        return -1;
    if (a.nbStringsHit < b.nbStringsHit)
        return 1;

    return 0;
}

function chordGeneratorTest()
{
    //const positions = generateChords([5, 9, 0]); // D
    //const positions = generateChords([7, 11, 2]); // E
    const positions = generateChords([10, 2, 5]); // G
    console.log("positions", positions)
}
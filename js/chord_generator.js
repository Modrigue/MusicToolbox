const MAX_CHORD_FRET_RANGE = 4;

let cMaxPos = 1;
let cStretch = 2;
let cRange = 0;
let cEmptyStrings = 4;

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

function generateChords(notesValues, nbStrings = 99)
{
    if (notesValues == null || notesValues.length < 2)
        return null;

    let chordsPositions = [];
    const fundamental = notesValues[0];

    const nbStringsTotal = tuning.length;
    const nbNotes = notesValues.length;

    // generate all valid chord positions
    for (let startString = 0; startString <= nbStringsTotal - nbNotes; startString++)
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
            addChordNoteOnString(notesValues, startString, startString + 1, startPositions, chordsPositions, nbStrings);
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
function addChordNoteOnString(notesValues, startIndex, stringIndex, positionsCur, chordsPositions, nbStrings = 99, chordAddedArray = [])
{
    // secure
    const nbStringsTotal = tuning.length;
    if (stringIndex >= nbStringsTotal)
        return;

    // find notes on current string
    const isLastString = (stringIndex + 1 == nbStringsTotal);
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
            
            let valid = chordPositionsValid(notesValues, positionsCandidate, nbStrings);

            // fixed number of strings?
            const fixedNbString = (nbStrings >= 0 && nbStrings <= nbStringsTotal);

            // continue search condition
            let continueSearch = !isLastString;
            if (fixedNbString)
            {
                let positionsNotHit = [...positionsCandidate];
                positionsNotHit = arrayRemoveValue(positionsNotHit, -1); // not hit
                if (positionsNotHit != null)
                    continueSearch = (positionsNotHit.length != nbStrings);
            }

            // find notes on next string
            let chordAddedArrayCurrent = [];
            if (continueSearch)
                addChordNoteOnString(notesValues, startIndex, stringIndex + 1, positionsCandidate, chordsPositions, nbStrings, chordAddedArrayCurrent);

            // update added chord positions array
            for (let chordPos in chordAddedArrayCurrent)
                chordAddedArray.push(chordPos);
            
            // add chord position if not more complete position has been found
            const addCurrentChord = valid && (!continueSearch || chordAddedArrayCurrent.length == 0);
            if (addCurrentChord)
            {
                // complete positions with remaining not hit strings
                let positionsCandidateComplete = [...positionsCandidate];
                for (let i = 0; i < nbStringsTotal - stringIndex - 1; i++)
                    positionsCandidateComplete.push(-1);

                // check again
                valid = chordPositionsValid(notesValues, positionsCandidateComplete, nbStrings);

                if (valid)
                {
                    chordsPositions.push(positionsCandidateComplete);
                    //console.log("positionsCandidateComplete", positionsCandidateComplete)
                }

                chordAddedArray.push(positionsCandidateComplete);
            }
        }
    }
}

function chordPositionsValid(notesValues, positionsCandidate, nbStrings = 99)
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

    // check number of used frets
    if (getNbFretsUsed(positionsCandidate) > 4)
        return false;

    // check number of strings used if specified
    if (nbStrings >= 0 && nbStrings <= tuning.length)
    {
        let positionsNotHit = [...positionsCandidate];
        positionsNotHit = arrayRemoveValue(positionsNotHit, -1); // not hit
        if (positionsNotHit.length != nbStrings)
            return false;
    }

    // disabled for now: check not hit strings
    // for (let i = 2; i < nbStrings; i++)
    // {
    //     if (positionsCandidate[i] < 0)
    //     {
    //         // requires at least one hit string after or before
    //         const indexPrev = Math.max(i - 1, 0);
    //         const indexNext = Math.min(i + 1, nbStrings - 1);
    //         const canBeBlocked = (positionsCandidate[indexPrev] > 0) || (positionsCandidate[indexNext] > 0);
    //         if (!canBeBlocked)
    //             return false;
    //     }
    // }

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

function getNbFretsUsed(positions)
{
    // do not count empty strings
    let positionsNotEmpty = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return 0;

    let fretsUsed = [];
    for (let pos of positionsNotEmpty)
    {
        if (!fretsUsed.includes(pos))
            fretsUsed.push(pos);
    }
    
    return fretsUsed.length;
}


///////////////////////////////// EXPERIMENTAL ////////////////////////////////


function getFretWidth(pos)
{
    if (pos < 0)
        return -1;

    // fret "0" width = 1
    return Math.pow(2, - pos / 12.0);
}

function getPositionX(pos)
{
    if (pos < 0)
        return -1;
    
    let x = 0;
    for (let i = 1; i <= pos; i++)
        x += getFretWidth(i);

    return x;
}

function getStringY(index)
{
    return 1 / 5.0 * index;
}

function getDistanceXY(pos1, index1, pos2, index2)
{
    return Math.sqrt(
        (getPositionX(pos2) - getPositionX(pos1))*(getPositionX(pos2) - getPositionX(pos1))
      + (getStringY(index2) - getStringY(index1))*(getStringY(index2) - getStringY(index1))
    );
}


//////////////////////////////// METRIC FUNCTIONS /////////////////////////////


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

function getChordPositionNbEmptyStrings(positions)
{
    return positions.filter(function(pos){ return pos < 0; }).length;
}

function getChordPositionStretch(positions)
{
    let dist = 0;
    let posLast = -1;
    let stringLast = -1;
    const nbPos = positions.length;

    // compute sum of distances between positions
    for (let i = 0; i < nbPos; i++)
    {
        const posCur = positions[i];

        // skip if empty
        if (posCur <= 0)
            continue;
        
        // add distance
        if (posLast >= 0 && stringLast >= 0)
            //dist += getDistanceXY(posCur, i, posLast, stringLast);
            dist += Math.sqrt((posCur - posLast)*(posCur - posLast) + (i - stringLast)*(i - stringLast));

        // update last non-empty position
        posLast = posCur;
        stringLast = i;
    }
    
    return dist;
}

/////////////////////////////// PROPERTIES CLASS //////////////////////////////


class ChordPositionsProperties
{
    constructor(positions)
    {
      this.positions = positions;
      this.computeMetrics();
    }

    // compute all metrics
    computeMetrics()
    {
        this.maxPosition = Math.max(...this.positions);
        this.range = getChordPositionsRange(this.positions);
        this.stretch = getChordPositionStretch(this.positions);
        this.nbEmptyStrings = getChordPositionNbEmptyStrings(this.positions);
    }
}

function getChordPositionsScore(pos)
{
    const maxPos = pos.maxPosition;
    const stretch = pos.stretch;
    const range = pos.range;
    const nbEmptyStrings = pos.nbEmptyStrings;  

    return cMaxPos*maxPos + cStretch*stretch + +cRange*range + cEmptyStrings*nbEmptyStrings;
}

function compareChordPositionsProperties(a, b)
{
    const scoreA = getChordPositionsScore(a);
    const scoreB = getChordPositionsScore(b);

    return scoreA - scoreB;
}


///////////////////////////////// GUI FUNCTIONS ///////////////////////////////


function updateFoundChordElements()
{
    const noteSelected = document.getElementById('note_explorer_chord').value;
    const chordSelected = document.getElementById('chord_explorer_chord').value;
    const notesDecomposed = document.getElementById('chord_explorer_notes_decomposed');

    const noteFondamental = parseInt(noteSelected);
    const chordValues = getChordValues(chordSelected);

    // update arpeggio text
    let chordNotesStr = "";
    chordValues.forEach(function (intervalValue)
    {
      const newNoteValue = addToNoteValue(noteFondamental, intervalValue);
      const noteName = getNoteName(newNoteValue);
      chordNotesStr += noteName + ",&nbsp;";
    });
    chordNotesStr = chordNotesStr.slice(0, -7);
    notesDecomposed.innerHTML = chordNotesStr;

    // update play chord button callback
    let buttonPlayChord = document.getElementById("play_found_chord");
    let chordValuesStr = "[";
    let index = 0;
    for (let interval of chordValues)
    {
        if (index > 0)
        chordValuesStr += ", ";

        chordValuesStr += interval.toString();
        index++;
    }
    chordValuesStr += "]";
    buttonPlayChord.setAttribute("onClick", `playChord(${noteSelected}, ${chordValuesStr}, 0)`);

    // update play arpeggio button callback
    let buttonPlayArpeggio = document.getElementById("play_found_arpeggio");
    buttonPlayArpeggio.setAttribute("onClick", `playChord(${noteSelected}, ${chordValuesStr}, 0, 0.25)`);
}

function updateGeneratedChordsOnFretboard(showBarres = true)
{
    const generatedGuitarChords = document.getElementById('generated_guitar_chords');

    // get selected chord notes values
    const noteSelected = document.getElementById('note_explorer_chord').value;
    const chordSelected = document.getElementById('chord_explorer_chord').value;
    const noteFondamental = parseInt(noteSelected);
    const chordValues = getChordValues(chordSelected);
    let chordNotesValues = [];
    for (let interval of chordValues)
    {
        newNoteValue = addToNoteValue(noteFondamental, interval);
        chordNotesValues.push(newNoteValue);
    }

    // compute chord positions
    const positionsArray = generateChords(chordNotesValues);

    // generate fretboard images
    generatedGuitarChords.innerHTML = initChordsFretboardHTML(noteFondamental, chordSelected, positionsArray.length);
    updateChordFretboard(positionsArray, showBarres);
}


/////////////////////////////// BARRES FUNCIONS ///////////////////////////////


function computeBarres(positions)
{
    if (positions == null || positions.length == 0)
        return [];

    let barres = {};
    const nbStrings = positions.length;

    // 1st pass: search for identical frets
    let barresCandidatesDict = {};
    let stringIndex = 0;
    for (let pos of positions)
    {
        if (pos <= 0)
        {
            stringIndex++;
            continue;
        }

        if (!barresCandidatesDict.hasOwnProperty(pos))
            barresCandidatesDict[pos] = [stringIndex];
        else
            barresCandidatesDict[pos].push(stringIndex);

        stringIndex++;
    }

    // 2nd pass: check barres candidates
    for (let pos in barresCandidatesDict)
    {
        const stringArray = barresCandidatesDict[pos];

        if (stringArray.length < 2) // no barre
            continue; 

        // compute extremities
        const stringMin = Math.min(...stringArray);
        const stringMax = Math.max(...stringArray);
        const barreLength = stringMax - stringMin + 1;

        if (barreLength < 3) // no barre
            continue;

        // check left positions presence between barre candidate extremities
        let isBarre = true;
        for (let stringCur = stringMin; stringCur < stringMax; stringCur++)
        {
            let posCur = positions[stringCur];
            if (posCur < pos)
            {
                isBarre = false; 
                break;
            }
        }
        if (!isBarre)
            continue;

        // check if barre is too difficult
        // >=4 strings => must include highest string
        if (barreLength >= 4 && stringMax != nbStrings - 1)
            continue;
        
        // ok, add barre
        barres[pos] = [stringMin, stringMax];
    }

    return barres;
}



//////////////////////////////// TEST FUNCTIONS ///////////////////////////////


function testGenerateChordPositions()
{
    // coefs start values
    const cMaxPosStart = 0;
    const cStretchStart = 0;
    const cRangeStart = 0;
    const cNbEmptyStringsStart = 0;

    // search parameters
    const stepMaxPos = 1;
    const stepStretch = 1;
    const stepRange = 0;
    const stepNbEmptyStrings = 1;
    const nbSteps = 10;
    let coefsBest = [];
    let errMin = -1;

    // brute-force search
    cMaxPos = cMaxPosStart;
    for (let i = 0; i < nbSteps; i++, cMaxPos += stepMaxPos)
    {
        if (stepMaxPos == 0 && i > 0)
            continue;

        cStretch = cStretchStart;
        for (let j = 0; j < nbSteps; j++, cStretch += stepStretch)
        {
            if (stepStretch == 0 && j > 0)
                continue;

            cRange = cRangeStart;
            for (let k = 0; k < nbSteps; k++, cRange += stepRange)
            {
                if (stepRange == 0 && k > 0)
                    continue;

                cEmptyStrings = cNbEmptyStringsStart;
                for (let l = 0; l < nbSteps; l++, cEmptyStrings += stepNbEmptyStrings)
                {
                    if (stepNbEmptyStrings == 0 && l > 0)
                        continue;

                    const coefsCur = [cMaxPos, cStretch, cRange, cEmptyStrings];
                    const errTotal = testGenerateChordPositionsError();
                    //console.log(`${cMaxPos}, ${cStretch}, ${cRange}, ${cEmptyStrings} -> ${errTotal.toFixed(3)}`);

                    if (errMin < 0 || errTotal < errMin)
                    {
                        errMin = errTotal;
                        coefsBest = []; // init/reset best coefs
                        coefsBest.push(coefsCur);
                    }
                    else if (errTotal == errMin)
                        coefsBest.push(coefsCur); // add coefs
                }
            }
        }
    }

    console.log("coefsBest", coefsBest);
    console.log("errMin", errMin);
}

function testGenerateChordPositionsError()
{    
    let errTotal = 0;

    errTotal += testChordPositionsError(generateChords([0 , 4 , 7 ]), [-1, 0,2,2,2,0]); // A MAJ
    errTotal += testChordPositionsError(generateChords([2 , 6 , 9 ]), [-1, 2,4,4,4,2]); // B MAJ
    errTotal += testChordPositionsError(generateChords([3 , 7 , 10]), [-1, 3,2,0,1,0]); // C MAJ
    errTotal += testChordPositionsError(generateChords([5 , 9 , 0 ]), [-1,-1,0,2,3,2]); // D MAJ
    errTotal += testChordPositionsError(generateChords([7 , 11, 2 ]), [ 0, 2,2,1,0,0]); // E MAJ
    errTotal += testChordPositionsError(generateChords([8 , 0 , 3 ]), [ 1, 3,3,2,1,1]); // F MAJ
    errTotal += testChordPositionsError(generateChords([10, 2 , 5 ]), [ 3, 2,0,0,0,3]); // G MAJ1
    errTotal += testChordPositionsError(generateChords([10, 2 , 5 ]), [ 3, 2,0,0,3,3], 1); // G MAJ2

    errTotal += testChordPositionsError(generateChords([0 , 3 , 7 ]), [-1, 0,2,2,1,0]); // A min
    errTotal += testChordPositionsError(generateChords([2 , 5 , 9 ]), [-1, 2,4,4,3,2]); // B min
    errTotal += testChordPositionsError(generateChords([5 , 8 , 0 ]), [-1,-1,0,2,3,1]); // D min
    errTotal += testChordPositionsError(generateChords([7 , 10, 2 ]), [ 0, 2,2,0,0,0]); // E min
    errTotal += testChordPositionsError(generateChords([8 , 11, 3 ]), [ 1, 3,3,1,1,1]); // F min

    errTotal += testChordPositionsError(generateChords([0 , 3,  7, 10]), [-1,0,2,0,1,0]); // A min7
    errTotal += testChordPositionsError(generateChords([5 , 10, 0 ]), [-1,-1,0,2,3,3]); // D sus4
    errTotal += testChordPositionsError(generateChords([5 , 7 , 0 ]), [-1,-1,0,2,3,0]); // D sus2
    errTotal += testChordPositionsError(generateChords([7 , 11, 2,9 ]), [0,2,4,1,0,0]); // E add9
    errTotal += testChordPositionsError(generateChords([7 , 10, 2,9 ]), [0,2,4,0,0,0]); // E madd9

    errTotal = Math.sqrt(errTotal);
    return errTotal;
}

function testChordPositionsError(positions, positionRef, indexPositionRef = 0)
{
    const index = getArrayArrayItemIndex(positions, positionRef);
    if (index < 0) // not found
        return 100;

    const err = index - indexPositionRef;

    return err*err;
}

function testChordPositionsLog()
{
    console.log("A MAJ  ->", getArrayArrayItemIndex(generateChords([0 , 4 , 7 ]), [-1, 0,2,2,2,0]));
    console.log("B MAJ  ->", getArrayArrayItemIndex(generateChords([2 , 6 , 9 ]), [-1, 2,4,4,4,2]));
    console.log("C MAJ  ->", getArrayArrayItemIndex(generateChords([3 , 7 , 10]), [-1, 3,2,0,1,0]));
    console.log("D MAJ  ->", getArrayArrayItemIndex(generateChords([5 , 9 , 0 ]), [-1,-1,0,2,3,2]));//
    console.log("E MAJ  ->", getArrayArrayItemIndex(generateChords([7 , 11, 2 ]), [ 0, 2,2,1,0,0]));//
    console.log("F MAJ  ->", getArrayArrayItemIndex(generateChords([8 , 0 , 3 ]), [ 1, 3,3,2,1,1]));//
    console.log("G MAJ1 ->", getArrayArrayItemIndex(generateChords([10, 2 , 5 ]), [ 3, 2,0,0,0,3]));//
    console.log("G MAJ2 ->", getArrayArrayItemIndex(generateChords([10, 2 , 5 ]), [ 3, 2,0,0,3,3]))////;

    console.log("A min  ->", getArrayArrayItemIndex(generateChords([0 , 3 , 7 ]), [-1, 0,2,2,1,0]));
    console.log("B min  ->", getArrayArrayItemIndex(generateChords([2 , 5 , 9 ]), [-1, 2,4,4,3,2]));
    console.log("D min  ->", getArrayArrayItemIndex(generateChords([5 , 8 , 0 ]), [-1,-1,0,2,3,1]));
    console.log("E min  ->", getArrayArrayItemIndex(generateChords([7 , 10, 2 ]), [ 0, 2,2,0,0,0]));
    console.log("F min  ->", getArrayArrayItemIndex(generateChords([8 , 11, 3 ]), [ 1, 3,3,1,1,1]));
    
    console.log("A min7 ->", getArrayArrayItemIndex(generateChords([0 , 3,  7, 10]), [-1,0,2,0,1,0]));
    console.log("B dim  ->", getArrayArrayItemIndex(generateChords([2 , 5,  8]), [-1,2,3,4,3,-1]));
    console.log("D sus4 ->", getArrayArrayItemIndex(generateChords([5 , 10, 0 ]), [-1,-1,0,2,3,3]));
    console.log("D sus2 ->", getArrayArrayItemIndex(generateChords([5 , 7 , 0 ]), [-1,-1,0,2,3,0]));
    console.log("E add9 ->", getArrayArrayItemIndex(generateChords([7 , 11, 2,9 ]), [0,2,4,1,0,0]));
    console.log("Emadd9 ->", getArrayArrayItemIndex(generateChords([7 , 10, 2,9 ]), [0,2,4,0,0,0]));
}
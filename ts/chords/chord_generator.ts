const MAX_CHORD_FRET_RANGE: number = 4;

let cMaxPos: number = 1;
let cStretch: number = 2;
let cRange: number = 0;
let cEmptyStrings: number = 4;

function getNotesPositionsOnString(noteValue: number, stringValue: number,
    posMin: number, posMax: number, includeEmptyString: boolean = false,
    qTones = false): Array<number>
{
    let positions = [];

    // include empty string if option allowed
    if (includeEmptyString && noteValue == stringValue)
        positions.push(0);

    // browse positions range on string
    const posStep = (qTones ? 0.5 : 1);
    for (let pos = posMin; pos <= posMax; pos += posStep)
    {
        const curNoteValue = (stringValue + pos) % 12;
        if (curNoteValue == noteValue && positions.indexOf(pos) < 0)
            positions.push(pos);
    }

    return positions;
}

function generateChords(notesValues: Array<number>, nbStrings: number = 99,
    includeEmptyStrings = false, noteBass = -1, qTones = false): Array<Array<number>>
{
    if (notesValues == null || notesValues.length < 2)
        return new Array<Array<number>>();

    let chordsPositions: Array<Array<number>> = new Array<Array<number>>();
    const fundamental: number = notesValues[0];

    const tuningValues: Array<number> = getSelectedGuitarTuningValue("chord_explorer_guitar_tuning");
    const nbStringsTotal: number = tuningValues.length;
    const nbNotes: number = notesValues.length;

    // generate all valid chord positions
    for (let startString = 0; startString <= nbStringsTotal - nbNotes; startString++)
    {
        const bassNote = (noteBass >= 0) ? noteBass : fundamental;
        const positionsString0 = getNotesPositionsOnString(bassNote, tuningValues[startString], 0, 11, true, qTones);
        for (let p0 of positionsString0)
        {
            // get start positions
            let startPositions = [];
            for (let i = 0; i < startString; i++)
                startPositions.push(-1);
            startPositions.push(p0);

            // init algorithm
            addChordNoteOnString(notesValues, noteBass, startString, startString + 1, startPositions, chordsPositions,
                tuningValues, nbStrings, includeEmptyStrings, qTones);
        }
    }

    // sort positions

    let propertiesArray: Array<ChordPositionsProperties> = new Array<ChordPositionsProperties>();
    for (let pos of chordsPositions)
    {
        let prop: ChordPositionsProperties = new ChordPositionsProperties(pos)
        propertiesArray.push(prop);
    }
    propertiesArray.sort(compareChordPositionsProperties);

    let sortedChordsPositions = [];
    for (let prop of propertiesArray)
        sortedChordsPositions.push(prop.positions);

    return sortedChordsPositions;
}

// recurse on strings
//    nbStrings = 99 => recurse until valid max. number of strings reached
//    nbStrings = 0  => recurse until valid min. number of strings reached
function addChordNoteOnString(notesValues: Array<number>, bass: number,
    startIndex: number, stringIndex: number,
    positionsCur: Array<number>, chordsPositions: Array<Array<number>>,
    tuningValues: Array<number>, nbStrings: number = 99, includeEmptyStrings = false,
    qTones = false, chordAddedArray: Array<Array<number>> = [])
{
    // secure
    const nbStringsTotal: number = tuningValues.length;
    if (stringIndex >= nbStringsTotal)
        return;

    // find notes on current string
    const isLastString = (stringIndex + 1 == nbStringsTotal);
    for (let noteValue of notesValues)
    {
        const range = getSearchRange(positionsCur);

        // exclude note from previous string
        if (stringIndex > startIndex && positionsCur != null)
            if (noteValue == (positionsCur[positionsCur.length - 1] + tuningValues[stringIndex - 1]) % 12)
                continue;

        const positionsOnString = getNotesPositionsOnString(noteValue, tuningValues[stringIndex], range[0], range[1], includeEmptyStrings, qTones);

        for (let pos of positionsOnString)
        {
            let positionsCandidate = [...positionsCur];
            positionsCandidate.push(pos);
            
            let valid = chordPositionsValid(notesValues, bass, positionsCandidate, tuningValues, nbStrings);

            // fixed number of strings?
            const fixedNbString = (nbStrings > 0 && nbStrings <= nbStringsTotal);

            // continue search condition
            let continueSearch = !isLastString;
            if (fixedNbString)
            {
                let positionsNotHit = [...positionsCandidate];
                positionsNotHit = arrayRemoveValue(positionsNotHit, -1); // not hit
                if (positionsNotHit != null)
                    continueSearch = (positionsNotHit.length != nbStrings);
            }
            else if (nbStrings <= 0)
            {
                if (valid)
                    continueSearch = false;
            }

            // find notes on next string
            let chordAddedArrayCurrent: Array<Array<number>> = new Array<Array<number>>();
            if (continueSearch)
                addChordNoteOnString(notesValues, bass, startIndex, stringIndex + 1, positionsCandidate, chordsPositions,
                    tuningValues, nbStrings, includeEmptyStrings, qTones, chordAddedArrayCurrent);

            // update added chord positions array
            for (let chordPos of chordAddedArrayCurrent)
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
                valid = chordPositionsValid(notesValues, bass, positionsCandidateComplete, tuningValues, nbStrings);

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

function chordPositionsValid(notesValues: Array<number>, bass: number,
    positionsCandidate: Array<number>, tuningValues: Array<number>, nbStrings: number = 99): boolean
{
    // check if all notes are included
    if (!chordPositionsIncludeNotes(notesValues, bass, tuningValues, positionsCandidate))
        return false;
    
    // check positions range
    let positionsNotEmpty: Array<number> = removePositionsEmpty(positionsCandidate);
    if (positionsNotEmpty != null && positionsNotEmpty.length > 1)
    {
        const posMax: number = Math.min(...positionsNotEmpty);
        const posMin: number = Math.max(...positionsNotEmpty);
        if (posMax - posMin > MAX_CHORD_FRET_RANGE)
            return false;
    }

    // check number of used frets
    if (getNbFretsUsed(positionsCandidate) > 4)
        return false;

    // check number of strings used if specified
    if (nbStrings > 0 && nbStrings <= tuningValues.length)
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

    // check number of placed fingers with barres
    if (getNbFingersPlaced(positionsCandidate) > 4)
        return false;

    return true;
}

function chordPositionsIncludeNotes(notesValues: Array<number>, bass: number,
    tuningValues: Array<number>, positionsCandidate: Array<number>): boolean
{
    if (notesValues == null || notesValues.length < 2)
        return false;
    if (positionsCandidate == null || positionsCandidate.length < 2)
        return false;

    if (positionsCandidate.length < notesValues.length)
        return false;

    let notesValuesToFind = [...notesValues];
    let posIndex = 0, stringIndex = 0;
    for (let pos of positionsCandidate)
    {
        // string not hit
        if (pos < 0)
        {
            stringIndex++;
            continue;
        }

        const curStringValue = tuningValues[stringIndex];
        const curNoteValue = (pos + curStringValue) % 12;

        // check bass if specified
        let isBass = false;
        if (bass >= 0 && posIndex == 0)
        {
            if (curNoteValue != bass)
                return false;
            
            isBass = true;
        }

        if (notesValues.indexOf(curNoteValue) < 0 && !isBass)
            return false;

        if (notesValuesToFind.indexOf(curNoteValue) >= 0 && !isBass)
            notesValuesToFind = arrayRemoveValue(notesValuesToFind, curNoteValue);

        stringIndex++;
        posIndex++;
    }

    return (notesValuesToFind.length == 0);
}

function getSearchRange(positions: Array<number>): [number, number]
{
    // do not count empty strings
    let positionsNotEmpty: Array<number> = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return [0, 12];

    const posMin: number = Math.max(Math.max(...positionsNotEmpty) - MAX_CHORD_FRET_RANGE, 0);
    const posMax: number = Math.min(...positionsNotEmpty) + MAX_CHORD_FRET_RANGE;
    
    return [posMin, posMax];
}

// remove empty and not hit strings
function removePositionsEmpty(positions: Array<number>): Array<number>
{
    if (positions == null || positions.length == 0)
        return positions;

    let positionsNotEmpty: Array<number> = [...positions];
    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, 0); // empty position
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return positionsNotEmpty;

    positionsNotEmpty = arrayRemoveValue(positionsNotEmpty, -1); // not hit

    return positionsNotEmpty;
}

function getNbFretsUsed(positions: Array<number>): number
{
    // do not count empty strings
    let positionsNotEmpty: Array<number> = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return 0;

    let fretsUsed: Array<number> = new Array<number>();
    for (let pos of positionsNotEmpty)
    {
        if (fretsUsed.indexOf(pos) < 0)
            fretsUsed.push(pos);
    }
    
    return fretsUsed.length;
}


///////////////////////////////// EXPERIMENTAL ////////////////////////////////


function getFretWidth(pos: number): number
{
    if (pos < 0)
        return -1;

    // fret "0" width = 1
    return Math.pow(2, - pos / 12.0);
}

function getPositionX(pos: number): number
{
    if (pos < 0)
        return -1;
    
    let x = 0;
    for (let i = 1; i <= pos; i++)
        x += getFretWidth(i);

    return x;
}

function getStringY(index: number): number
{
    return 1 / 5.0 * index;
}

function getDistanceXY(pos1: number, index1: number, pos2: number, index2: number)
{
    return Math.sqrt(
        (getPositionX(pos2) - getPositionX(pos1))*(getPositionX(pos2) - getPositionX(pos1))
      + (getStringY(index2) - getStringY(index1))*(getStringY(index2) - getStringY(index1))
    );
}


//////////////////////////////// METRIC FUNCTIONS /////////////////////////////


function getChordPositionsRange(positions: Array<number>): number
{
    // do not count empty strings
    let positionsNotEmpty: Array<number> = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return 0;

    const posMax: number = Math.max(...positionsNotEmpty);
    const posMin: number = Math.min(...positionsNotEmpty);
    
    return (posMax - posMin + 1);
}

function getChordPositionNbEmptyStrings(positions: Array<number>): number
{
    return positions.filter(function(pos: number){ return pos < 0; }).length;
}

function getChordPositionStretch(positions: Array<number>): number
{
    let dist: number = 0;
    let posLast: number = -1;
    let stringLast: number = -1;
    const nbPos: number = positions.length;

    // compute sum of distances between positions
    for (let i: number = 0; i < nbPos; i++)
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

function getNbFingersPlaced(positions: Array<number>): number
{
    let nbFingers: number = 0;
    let stringsPlaced: Array<number> = new Array<number>();

    // browse barres positions
    const barres: Map<number, [number, number]> = computeBarres(positions);
    for (let [pos, barre] of barres)
    {
        const minString = barre[0];
        const maxString = barre[1];

        for (let curString = minString; curString <= maxString; curString++)
        {
            if (positions[curString] == pos)
                stringsPlaced.push(curString);
        }

        nbFingers++;
    }

    // browse remaining positions
    const nbStrings: number = positions.length;
    for (let i = 0; i < nbStrings; i++)
    {
        const position = positions[i];
        if (position > 0 && stringsPlaced.indexOf(i) < 0)
            nbFingers++;
    }

    return nbFingers;
}

/////////////////////////////// PROPERTIES CLASS //////////////////////////////


class ChordPositionsProperties
{
    positions: Array<number>;

    maxPosition: number;
    range: number;
    stretch: number;
    nbEmptyStrings: number;

    constructor(positions: Array<number>,
        maxPosition: number = -1, range: number = -1, stretch: number = -1, nbEmptyStrings: number = -1)
    {
      this.positions = positions;

      this.maxPosition = maxPosition;
      this.range = range;
      this.stretch = stretch;
      this.nbEmptyStrings = nbEmptyStrings;

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

function getChordPositionsScore(pos: ChordPositionsProperties): number
{
    const maxPos = pos.maxPosition;
    const stretch = pos.stretch;
    const range = pos.range;
    const nbEmptyStrings = pos.nbEmptyStrings;  

    return cMaxPos*maxPos + cStretch*stretch + +cRange*range + cEmptyStrings*nbEmptyStrings;
}

function compareChordPositionsProperties(a: ChordPositionsProperties, b: ChordPositionsProperties)
{
    const scoreA = getChordPositionsScore(a);
    const scoreB = getChordPositionsScore(b);

    return scoreA - scoreB;
}


///////////////////////////////// GUI FUNCTIONS ///////////////////////////////


function getSelectedChordExplorerNotes(): Array<number>
{
    let noteValues: Array<number> = new Array<number>();
    for (let i = 0; i <= 6; i++)
    {
        const chordExplorerNoteSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`chord_explorer_note${i}`);
        const value = parseFloat(chordExplorerNoteSelector.value);
        if (value >= 0 && noteValues.indexOf(value) < 0 && !chordExplorerNoteSelector.disabled)
            noteValues.push(value);
    }

    return noteValues;
}


function updateFoundChordElements()
{
    let fondamentalValue = -1;
    let bassValue = -1;
    let fundamentalSelected = "";
    let intervalValues: Array<number> = [];

    let selectedNotesValues: Array<number> = [];
    let bassInterval = -1;

    let selectedMode: string = chordExplorerUpdateMode;
    switch(selectedMode)
    {
        case "name":
            {
                // update arpeggios texts
                fondamentalValue = getChordExplorerFondamentalValue();
                intervalValues = getChordExplorerChordValues();
                bassValue = getChordExplorerBassValue();
                bassInterval = (bassValue >= 0) ? (bassValue - fondamentalValue + 12) % 12 : -1;

                // get corresponding notes values

                for (const intervalValue of intervalValues)
                    selectedNotesValues.push(addToNoteValue(fondamentalValue, intervalValue));

                if (bassValue >= 0 && selectedNotesValues.indexOf(bassValue) == -1)
                    selectedNotesValues.push(bassValue);

                break;
            }
        
        case "notes":
        default:
            {
                // take 1st selected note as fundamental
                selectedNotesValues = getSelectedChordExplorerNotes();
                fondamentalValue = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
                const selectedChordId = getChordExplorerChordId(); 
                if (selectedChordId != null && selectedChordId != "")
                {
                    // TODO: duplicated code
                    intervalValues = getChordExplorerChordValues();
                    bassValue = getChordExplorerBassValue();
                    const bassInterval = (bassValue >= 0) ? (bassValue - fondamentalValue + 12) % 12 : -1;
                }
                else
                {
                    // compute chord relative values given fundamental
                    for (let noteValue of selectedNotesValues)
                        intervalValues.push((noteValue - fondamentalValue) % 12);
                    
                    // handle octaves at search? (ie. add9,...)
                }

                break;
            }
    }

    // update intervals
    const chordIntervals = getArpeggioIntervals(intervalValues, bassInterval);
    let indexInterval = 0;
    
    for (let indexNote = 0; indexNote < 7; indexNote++)
    {
        const noteSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`chord_explorer_note${indexNote}`);
        const hasInterval = (indexInterval < chordIntervals.length && noteSelector.value != "-1");
        const intervalName = hasInterval ? chordIntervals[indexInterval] : "";
        
        (<HTMLLabelElement>document.getElementById(`chord_explorer_interval${indexNote}`)).innerText = intervalName;
        if (hasInterval)
            indexInterval++;
    }

    // update found chords text
    fundamentalSelected = fondamentalValue.toString();
    const foundChordsTexts: HTMLSpanElement = <HTMLSpanElement>document.getElementById('chord_explorer_found_chords_texts');
    
    // 1st pass: display entire relative chords
    let foundChords: Array<[number, string, number]> = findChords(selectedNotesValues, false, true);
    let foundChordsStr = getFoundChordsButtonsHTML(foundChords, fondamentalValue, bassValue, selectedMode);
    
    //// 2nd pass with bass: display relative chords with bass
    //if (bassValue >= 0 && bassValue != fondamentalValue && selectedNotesValues.indexOf(bassValue) >= 0)
    //{
    //    let selectedNotesValuesWoBass: Array<number> = [];
    //    for (const noteValue of selectedNotesValues)
    //    {
    //        if (noteValue != bassValue)
    //            selectedNotesValuesWoBass.push(noteValue);
    //    }
    //    
    //    foundChords = findChords(selectedNotesValuesWoBass);
    //    foundChordsStr += getFoundChordsButtonsHTML(foundChords, fondamentalValue, bassValue, false, selectedMode);
    //}
    //// 2nd pass without bass: display relative chords with fondamental as bass
    //else
    //{
    //    if (selectedNotesValues != null && selectedNotesValues.length >= 4)
    //    {
    //        let selectedNotesValuesWoFondamental: Array<number> = [];
    //        for (const noteValue of selectedNotesValues)
    //        {
    //            if (noteValue != fondamentalValue)
    //                selectedNotesValuesWoFondamental.push(noteValue);
    //        }
    //        
    //        foundChords = findChords(selectedNotesValuesWoFondamental);
    //        foundChordsStr += getFoundChordsButtonsHTML(foundChords, fondamentalValue, fondamentalValue, false, selectedMode);
    //    }
    //}

    foundChordsTexts.innerHTML = foundChordsStr;

    // update play chord button callback
    let buttonPlayChord: HTMLButtonElement = <HTMLButtonElement>document.getElementById("play_found_chord");
    buttonPlayChord.setAttribute("onClick", `playChord(${fundamentalSelected}, [${intervalValues.toString()}], 0, 0, ${bassValue})`);
    buttonPlayChord.disabled = !hasAudio;

    // update play arpeggio button callback
    let buttonPlayArpeggio: HTMLButtonElement = <HTMLButtonElement>document.getElementById("play_found_arpeggio");
    buttonPlayArpeggio.setAttribute("onClick", `playChord(${fundamentalSelected}, [${intervalValues.toString()}], 0, 0.25, ${bassValue})`);
    buttonPlayArpeggio.disabled = !hasAudio;
}

function getFoundChordsButtonsHTML(foundChords: Array<[number, string, number]>, fondamentalValue: number, bassValue: number,
    selectedMode: string): string
{
    let foundChordsStr = "";
    const culture = getSelectedCulture();

    let index = 0;
    for (let noteChord of foundChords)
    {
        const noteValue = noteChord[0];
        const chordId = noteChord[1];
        let foundBassValue = noteChord[2];

        // skip already selected chord
        if (selectedMode == "name" && noteValue == fondamentalValue)
            continue;

        const noteName = getNoteName(noteValue);
        const chordNoteName = getCompactChordNotation(noteName, chordId);

        if (bassValue < 0)
        {
            if (noteValue != fondamentalValue)
                foundBassValue = fondamentalValue;
        }
        else
        {
            if (noteValue != bassValue)
                foundBassValue = bassValue;
        }

        // build button
        let button = document.createElement('button');
        button.innerText = chordNoteName + (foundBassValue >= 0 ? ` / ${getNoteName(foundBassValue)}` : "");
        //button.classList.add("border-left-radius");

        // build URL
        let url = window.location.pathname;
        url += "?note=" + noteValue.toString();
        url += "&chord=" + chordId;
        if (foundBassValue >= 0)
            url += "&bass=" + foundBassValue;
        url += "&lang=" + culture;
        url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("chord_explorer_guitar_nb_strings");
        url += "&guitar_tuning=" + getSelectedGuitarTuningId("chord_explorer_guitar_tuning");
        
        const callbackString = `openNewTab(\"${url}\")`;
        button.setAttribute("onClick", callbackString);

        if (index > 0)
            foundChordsStr += " ";
        foundChordsStr += button.outerHTML;

        //// disabled: build play button
        //const chordValues = getChordValues(chordId);
        //let buttonPlay = document.createElement('button');
        //buttonPlay.innerText = "♪";
        //buttonPlay.classList.add("border-right-radius");
        //buttonPlay.setAttribute("onClick", `playChord(${noteValue}, [${chordValues.toString()}], 0, 0, ${foundBassValue})`);
        //buttonPlay.disabled = !hasAudio;
        //foundChordsStr += `${buttonPlay.outerHTML}\r\n`;

        index++;
    }

    return foundChordsStr;
}

function updateGeneratedChordsOnFretboard(showBarres = true, includeEmptyStrings = false, showQTones = false)
{
    const generatedGuitarChords: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('generated_guitar_chords');
    generatedGuitarChords.classList.add("flex-container");
    let chordNotesValues: Array<number> = new Array<number>();
    let noteFondamental: number = -1;
    let noteBass: number = -1;
    let chordSelectedId: string = "";
    let freeNotesValues: Array<number> = new Array<number>();

    // get selected parameters given mode
    let selectedMode: string = chordExplorerUpdateMode; //getSelectedChordGeneratorMode();
    switch(selectedMode)
    {
        /*case "name":
            {
                noteFondamental = getChordExplorerFondamentalValue();
                chordSelectedId = getChordExplorerChordId();
                const chordValues = getChordValues(chordSelectedId);

                for (let interval of chordValues)
                {
                    const newNoteValue: number = addToNoteValue(noteFondamental, interval);
                    chordNotesValues.push(newNoteValue);            
                }

                const bassSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById('chord_explorer_bass');
                const bassSelected = bassSelector.value;
                noteBass = parseInt(bassSelected);
                break;
            }
        case "notes":*/
        default:
            {
                chordNotesValues = getSelectedChordExplorerNotes();
                freeNotesValues = [...chordNotesValues];
                noteFondamental = (chordNotesValues.length > 0) ? chordNotesValues[0] : -1;
                chordSelectedId = getChordExplorerChordId();
                break;
            }
    }

    // compute chord positions
    const nbStringsSelectedStr = (<HTMLSelectElement>document.getElementById('chord_explorer_nb_strings_max')).value;
    const nbStringsSelected = parseInt(nbStringsSelectedStr);
    //console.log(chordNotesValues, nbStringsSelected, includeEmptyStrings, noteBass, selectedMode); 
    const positionsArray: Array<Array<number>> = generateChords(chordNotesValues, nbStringsSelected, includeEmptyStrings, noteBass, showQTones); 
    if (positionsArray == null || positionsArray.length == 0)
    {        
        generatedGuitarChords.innerHTML = getString("no_result");
        return;
    }

    // generate fretboard images
    let selectedFondamentalValue = getChordExplorerFondamentalValue();
    let selectedBassValue = getChordExplorerBassValue();
    generatedGuitarChords.innerHTML = initChordsFretboardHTML(selectedFondamentalValue, selectedBassValue, chordSelectedId, freeNotesValues, positionsArray.length);
    updateChordFretboard(positionsArray, showBarres, showQTones);
}

// disable incoherent number of strings options
function updateNbStringsForChordSelector()
{
    let nbNotesInChord = -1;
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');

    //if (selectedMode == "name")
    //{
    //    const chordValues = getChordExplorerChordValues();
    //    nbNotesInChord = chordValues.length;
    //}
    //else
    {
        const selectedFreeNotes = getSelectedChordExplorerNotes();
        nbNotesInChord = selectedFreeNotes.length;
    }
    
    // enable values given nb. of notes
    let setDefaultValue: boolean = false;
    for (let i = 2; i <= 7; i++)
    {
        let option: HTMLOptionElement = <HTMLOptionElement>document.getElementById(`chord_explorer_nb_strings_max_option_${i}`);
        option.disabled = (i < nbNotesInChord) || (i > nbStrings);

        if (option.selected && option.disabled) // incoherent
            setDefaultValue = true;
    }

    // set default value if needed
    if (setDefaultValue)
    {
        let option: HTMLOptionElement = <HTMLOptionElement>document.getElementById('chord_explorer_nb_strings_max_option_max');
        option.selected = true;
    }
}

/////////////////////////////// BARRES FUNCIONS ///////////////////////////////


function computeBarres(positions: Array<number>): Map<number, [number, number]>
{
    if (positions == null || positions.length == 0)
        return new Map<number, [number, number]>();

    let barres = new Map<number, [number, number]>();
    const nbStrings = positions.length;

    // 1st pass: search for identical frets
    let barresCandidatesDict = new Map<number, Array<number>>();
    let stringIndex = 0;
    for (let pos of positions)
    {
        if (pos <= 0)
        {
            stringIndex++;
            continue;
        }

        if (!barresCandidatesDict.has(pos))
            barresCandidatesDict.set(pos, [stringIndex]);
        else
        {
            let stringsCur: Array<number> = <Array<number>>barresCandidatesDict.get(pos);
            stringsCur.push(stringIndex);
            barresCandidatesDict.set(pos, stringsCur);
        }

        stringIndex++;
    }

    // 2nd pass: check barres candidates
    for (let [pos, stringArray] of barresCandidatesDict)
    {
        if (stringArray.length < 2) // no barre
            continue; 

        // compute extremities
        const stringMin: number = Math.min(...stringArray);
        const stringMax: number = Math.max(...stringArray);
        const barreLength: number = stringMax - stringMin + 1;

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
        barres.set(pos, [stringMin, stringMax]);
    }

    return barres;
}



//////////////////////////////// TEST FUNCTIONS ///////////////////////////////


function testGenerateChordPositions(): void
{
    // coefs start values
    const cMaxPosStart: number = 0;
    const cStretchStart: number = 0;
    const cRangeStart: number = 0;
    const cNbEmptyStringsStart: number = 0;

    // search parameters
    const stepMaxPos: number = 1;
    const stepStretch: number = 1;
    const stepRange: number = 0;
    const stepNbEmptyStrings: number = 1;
    const nbSteps: number = 10;
    let coefsBest: Array<Array<number>> = new Array<Array<number>>();
    let errMin: number = -1;

    // brute-force search
    cMaxPos = cMaxPosStart;
    for (let i = 0; i < nbSteps; i++, cMaxPos += stepMaxPos)
    {
        //if (stepMaxPos == 0 && i > 0)
        //    continue;

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

                    const coefsCur: Array<number> = [cMaxPos, cStretch, cRange, cEmptyStrings];
                    const errTotal: number = testGenerateChordPositionsError();
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

function testGenerateChordPositionsError(): number
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

function testChordPositionsError(positions: Array<Array<number>>, positionRef: Array<number>,
    indexPositionRef: number = 0): number
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
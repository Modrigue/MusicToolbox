// find chords from notes
function findChords(notesValues: Array<number>,
    onlyFirstNoteAsFundamental: boolean = false): Array<[number, string]>
{
    if (notesValues == null || notesValues.length < 2 || notesValues.length > 6)
        return [];

    let chordsArray: Array<[number, string]> = new Array<[number, string]>();
    const nbNotesInChord: number = notesValues.length;
    const chordsDict: Map<string, Array<number>> = getChordDictionary(nbNotesInChord);

    // switch fundamental and compute intervals
    for (let i = 0; i < nbNotesInChord; i++)
    {
        if (onlyFirstNoteAsFundamental && i > 0)
            break;

        let fundamental: number = notesValues[i];
        let intervalsValues: Array<number> = new Array<number>();
        for (let value of notesValues)
        {
            const interval = (value - fundamental + 10*12) % 12;
            intervalsValues.push(interval);
        }
        
        // sort intervals
        intervalsValues.sort((a, b) => a - b);

        // find chords ids with octave
        const chordsIdsFound: Array<string> = getChordsIdsWithOctave(intervalsValues);
        for (let chordId of chordsIdsFound)
        {
            if (chordId !=  null && chordId !=  "" && chordId !=  "?")
                chordsArray.push([fundamental, chordId]);
        }
    }

    return chordsArray;
}

function getChordsIdsWithOctave(intervalsValues: Array<number>): Array<string>
{
    let chordsIdsArray: Array<string> = new Array<string>();
    let intervalsValuesArray: Array<Array<number>> = new Array<Array<number>>();

    const nbNotesInChord: number = intervalsValues.length;
    const chordsDict: Map<string, Array<number>> = getChordDictionary(nbNotesInChord);

    // compute all intervals combinations with octave
    getIntervalsWithOctave(intervalsValues, intervalsValuesArray);

    // serach corresponding chord ids
    for (let intervalsValuesFound of intervalsValuesArray)
    {
        const chordId = getKeyFromArrayValue(chordsDict, intervalsValuesFound);
        if (chordId !=  null && chordId !=  "" && chordId !=  "?")
            chordsIdsArray.push(chordId);
    }

    return chordsIdsArray;
}

function getIntervalsWithOctave(intervalsValues: Array<number>,
    intervalsValuesArray: Array<Array<number>>, intervalIndex: number = 0): void
{
    const nbNotesInChord: number = intervalsValues.length;
        
    // start: do not compute fundamental's octave
    if (intervalIndex == 0)
    {
        intervalsValuesArray.push([intervalsValues[0]]);
        getIntervalsWithOctave(intervalsValues, intervalsValuesArray, 1);
    }
    else if (intervalIndex < nbNotesInChord)
    {
        let nbTries: number = 0;
        let intervalsValuesArrayCur: Array<Array<number>> = cloneArrayArrayWithItemLength(intervalsValuesArray, intervalIndex);
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


//////////////////////////////// CHORDS IN SCALE //////////////////////////////


function findChordsFromScaleScalesHTML(tonicValue: number, scaleValues: Array<number>,
    charIntervals: Array<number> = []): string
{
    let foundChordsHTML = "<br>";

    const nbNotesMax = 6;
    let noteValues = [];
    const culture = getSelectedCulture();

    // compute scale note values
    for (let intervalValue of scaleValues)
        noteValues.push((tonicValue + intervalValue) % 12);

    // compute characteristic note values
    const charNotesValues = new Array<number>();
    for (const index of charIntervals)
    {
        const charNoteValue = noteValues[index];
        charNotesValues.push(charNoteValue);
    }

    // find all chords
    const foundChordsDict = findChordInScales(noteValues, nbNotesMax);

    // build buttons
    for (let nbNotes = 2; nbNotes <= nbNotesMax; nbNotes++)
    {
        let paragraph = document.createElement('p');
        paragraph.innerHTML = `${getString("chords_N_notes_all", nbNotes.toString())} `;

        const foundChordsNbNotes = foundChordsDict.get(nbNotes);

        let foundChordsNbNotesHTML = "";
        if (foundChordsNbNotes == null || foundChordsNbNotes.length == 0)
            foundChordsNbNotesHTML = getString("no_result");
        else
        {
            for (let noteChord of foundChordsNbNotes)
            {
                let noteValue = noteChord[0];
                const chordId = noteChord[1];
                const chordValues = getChordValues(chordId);

                const isTonic: boolean = (noteValue % 12 == tonicValue % 12);
                const isCharacteristic: boolean = isChordCharacteristic(noteValue, chordValues, charNotesValues);
    
                const noteName = getNoteName(noteValue);
                const chordNoteName = getCompactChordNotation(noteName, chordId);

                // build button
                let button = document.createElement('button');
                button.innerText = chordNoteName;
                button.classList.add("border-left-radius");
                if (isTonic)
                    button.classList.add("button-tonic-interactive");
                else if (isCharacteristic)
                    button.classList.add("button-char-interactive");

                // build URL (if not microtonal)
                if (!isMicrotonalInterval(noteValue))
                {
                    let url = window.location.pathname;
                    url += "?note=" + noteValue.toString();
                    url += "&chord=" + chordId;
                    url += "&lang=" + culture;
                    if (pageSelected == "page_scale_explorer")
                    {
                        const nbStrings = Math.max(getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings"), nbNotes);
                        url += "&guitar_nb_strings=" + nbStrings;
                        url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
                    }

                    const callbackString = `openNewTab(\"${url}\")`;
                    button.setAttribute("onClick", callbackString);
                }

                // set notes as tooltip
                button.title =
                    getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");

                foundChordsNbNotesHTML += `${button.outerHTML}`;

                // build play button

                let buttonPlay = document.createElement('button');
                buttonPlay.innerText = "♪";
                buttonPlay.classList.add("border-right-radius");
                if (isTonic)
                    buttonPlay.classList.add("button-tonic-interactive");
                else if (isCharacteristic)
                    buttonPlay.classList.add("button-char-interactive");

                // set notes as tooltip
                buttonPlay.title =
                    getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");  

                if (noteValue < tonicValue)
                    noteValue += 12;
                buttonPlay.setAttribute("onClick", `playChord(${noteValue}, [${chordValues.toString()}], 0, 0)`);

                foundChordsNbNotesHTML += `${buttonPlay.outerHTML}\r\n`;
            }
        }

        paragraph.innerHTML += foundChordsNbNotesHTML;
        foundChordsHTML += paragraph.outerHTML;
    }

    return foundChordsHTML;
}

function findChordInScales(scaleValues: Array<number>,
    nbNotesMax: number): Map<number,Array<[number, string]>>
{
    let chordsArray: Array<[number, string]> = new Array<[number, string]>();
    const nbNotesInScale: number = scaleValues.length;

    for (let i: number = 0; i < nbNotesInScale; i++)
    {
        // build scale values starting from cycling fundamental
        let scaleValuesCur = [];
        for (let j: number = 0; j < nbNotesInScale; j++)
        {
            const value = scaleValues[(i + j) % nbNotesInScale];
            scaleValuesCur.push(value);
        }

        let fundamental = scaleValuesCur[0];

        // compute all intervals
        let intervalsValuesArray: Array<Array<number>> = new Array<Array<number>>();
        getIntervalsInScale(scaleValuesCur, nbNotesMax, intervalsValuesArray);

        // search corresponding chord ids
        for (let intervalsValuesFound of intervalsValuesArray)
        {
            const nbNotes = intervalsValuesFound.length;
            if (nbNotes < 2)
                continue;

            let chordsFound = findChords(intervalsValuesFound, true);
            for (let chordFound of chordsFound)
            {
                if (chordFound[0] == fundamental)
                    chordsArray.push(chordFound);
            }
        }
    }

    // sort given number of notes in chords
    let foundChordsDict: Map<number,Array<[number, string]>> = new Map<number,Array<[number, string]>>();
    for (let nbNotesInChord = 2; nbNotesInChord <= 6; nbNotesInChord++)
    {
        let foundChordsNbNotes = [];
        for (let foundChord of chordsArray)
        {
            const chordId = foundChord[1];
            const chordValues = getChordValues(chordId);
            if (chordValues.length == nbNotesInChord)
                foundChordsNbNotes.push(foundChord);
        }

        foundChordsDict.set(nbNotesInChord, foundChordsNbNotes);
    }

    return foundChordsDict;
}


function getIntervalsInScale(scaleValues: Array<number>, nbNotesMax: number,
    intervalsValuesArray: Array<Array<number>>, onlyFirstNoteAsFundamental: boolean = false,
    intervalsValuesCur: Array<number> = [],
    startIndexCur: number = 0, nbNotesCur: number = 0): void
{
    let nbNotesInScale: number = scaleValues.length;
    
    if (nbNotesCur < nbNotesMax)
    {
        let intervalsValuesArrayCur: Array<Array<number>> = cloneArrayArrayWithItemLength(intervalsValuesArray, nbNotesCur);

        let nbTries = 0;
        for (let i = startIndexCur; i < nbNotesInScale; i++)
        {
            // only first note as fundamental if option set
            if (onlyFirstNoteAsFundamental && nbNotesCur == 0 && i > startIndexCur)
                continue;

            const intervalsBuildCurrent: Array<number> = cloneIntegerArray(intervalsValuesCur);
            intervalsBuildCurrent.push(scaleValues[i]);
            
            if (intervalsValuesArray.indexOf(intervalsBuildCurrent) < 0)
                intervalsValuesArray.push(intervalsBuildCurrent);
            getIntervalsInScale(scaleValues, nbNotesMax, intervalsValuesArray, onlyFirstNoteAsFundamental, intervalsBuildCurrent, i + 1, nbNotesCur + 1);

            // secure
            nbTries++;
            if (nbTries > 16)
                break;
        }
    }
}


////////////////////////////// SPECIFIC CHORDS ////////////////////////////////


function findNeapChordFromTonicHTML(tonicValue: number) : string
{
    let foundNeapChordHTML = "";

    const culture = getSelectedCulture();

    let paragraph = document.createElement('p');
    paragraph.innerHTML = `${getString("chord_neapolitan")} `;

    // bII chord at 1st inversion

    let noteValue = addToNoteValue(tonicValue, 1);
    const chordId = "M";
    const chordValues = getChordValues(chordId);

    const noteName = getNoteName(noteValue);
    const chordNoteName = getCompactChordNotation(noteName, chordId);

    const bassValue = addToNoteValue(noteValue, chordValues[1]);
    const bassName = getNoteName(bassValue);

    // build button
    let neapChordHTML = "";
    let button = document.createElement('button');
    button.innerText = `${chordNoteName} / ${bassName}`;
    button.classList.add("border-left-radius");
    button.classList.add("button-neap-interactive");

    // build chord URL (if not microtonal)
    if (!isMicrotonalInterval(noteValue))
    {
        let url = window.location.pathname;
        url += "?note=" + noteValue.toString();
        url += "&chord=" + chordId;
        url += "&bass=" + bassValue;
        url += "&lang=" + culture;
        if (pageSelected == "page_scale_explorer")
        {
            const nbStrings = getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
            url += "&guitar_nb_strings=" + nbStrings;
            url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
        }

        const callbackString = `openNewTab(\"${url}\")`;
        button.setAttribute("onClick", callbackString);
    }

    // set notes as tooltip
    button.title =
        getArpeggioNotesText(noteValue, chordValues, -1, [], bassValue).replace(/<span>/g, "").replace(/<\/span>/g, "");
    
    neapChordHTML += `${button.outerHTML}`;

    // build play button

    let buttonPlay = document.createElement('button');
    buttonPlay.innerText = "♪";
    buttonPlay.classList.add("border-right-radius");
    buttonPlay.classList.add("button-neap-interactive");

    // set notes as tooltip
    buttonPlay.title =
        getArpeggioNotesText(noteValue, chordValues, -1, [], bassValue).replace(/<span>/g, "").replace(/<\/span>/g, "");  

    if (noteValue < tonicValue)
        noteValue += 12;
    buttonPlay.setAttribute("onClick", `playChord(${noteValue}, [${chordValues.toString()}], 0, 0, ${bassValue})`);
    
    neapChordHTML += `${buttonPlay.outerHTML}\r\n`;

    paragraph.innerHTML += neapChordHTML;
    foundNeapChordHTML += paragraph.outerHTML;

    return foundNeapChordHTML;
}

function findAug6thChordsFromTonicHTML(tonicValue: number) : string
{
    let foundAug6ChordsHTML = "";

    const culture = getSelectedCulture();

    let paragraph = document.createElement('p');
    paragraph.innerHTML = `${getString("chords_aug_6th")} `;

    // Italian 6th chord: bVI7(no5)
    const it6Chord: [number, string, string] = [8, "It+6", ""];
  
    // French 6th chord: bVI7b5
    const fr6Chord: [number, string, string] = [8, "Fr+6", ""];

    // German 6th chord: bVI7
    const ger6Chord: [number, string, string] = [8, "7", "Ger+6"];

    const aug6Chords: Array<[number, string, string]> = [it6Chord, fr6Chord, ger6Chord];

    for (let [intervalValue, chordId, chordNameAux] of aug6Chords)
    {
        let noteValue = addToNoteValue(tonicValue, intervalValue);
        const chordValues = getChordValues(chordId);
        const noteName = getNoteName(noteValue);
        const chordNoteName = getCompactChordNotation(noteName, chordId);

        // build button
        let aug6ChordHTML = "";
        let button = document.createElement('button');
        button.innerText = chordNameAux ? `${chordNoteName} / ${noteName}${chordNameAux}` : chordNoteName;
        button.classList.add("border-left-radius");
        button.classList.add("button-aug6-interactive");

        // build chord URL (if not microtonal)
        if (!isMicrotonalInterval(noteValue))
        {
            let url = window.location.pathname;
            url += "?note=" + noteValue.toString();
            url += "&chord=" + chordId;
            url += "&lang=" + culture;
            if (pageSelected == "page_scale_explorer")
            {
                const nbStrings = getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
                url += "&guitar_nb_strings=" + nbStrings;
                url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
            }

            const callbackString = `openNewTab(\"${url}\")`;
            button.setAttribute("onClick", callbackString);
        }

        // set notes as tooltip
        button.title =
            getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");

        aug6ChordHTML += `${button.outerHTML}`;

        // build play button

        let buttonPlay = document.createElement('button');
        buttonPlay.innerText = "♪";
        buttonPlay.classList.add("border-right-radius");
        buttonPlay.classList.add("button-aug6-interactive");

        // set notes as tooltip
        buttonPlay.title =
            getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");  

        if (noteValue < tonicValue)
            noteValue += 12;
        buttonPlay.setAttribute("onClick", `playChord(${noteValue}, [${chordValues.toString()}], 0, 0)`);

        aug6ChordHTML += `${buttonPlay.outerHTML}\r\n`;

        paragraph.innerHTML += aug6ChordHTML;
    }

    foundAug6ChordsHTML += paragraph.outerHTML;

    return foundAug6ChordsHTML;
}
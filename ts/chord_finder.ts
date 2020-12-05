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


function findChordsFromScaleScalesHTML(noteValue: number, scaleValues: Array<number>): string
{
    let foundChordsHTML = "<br>";

    const nbNotesMax = 6;
    let noteValues = [];
    const culture = getSelectedCulture();

    // compute scale note values
    for (let intervalValue of scaleValues)
        noteValues.push((noteValue + intervalValue) % 12);

    // find all chords
    const foundChordsDict = findChordInScales(noteValues, nbNotesMax);

    // build buttons
    for (let nbNotes = 2; nbNotes <= nbNotesMax; nbNotes++)
    {
        let paragraph = document.createElement('p');
        paragraph.innerHTML = getString("chords_N_notes_all", nbNotes.toString());

        const foundChordsNbNotes = foundChordsDict.get(nbNotes);

        let foundChordsNbNotesHTML = "";
        if (foundChordsNbNotes == null || foundChordsNbNotes.length == 0)
            foundChordsNbNotesHTML = "&nbsp;" + getString("no_result");
        else
        {
            for (let noteChord of foundChordsNbNotes)
            {
                const noteValue = noteChord[0];
                const chordId = noteChord[1];
    
                const noteName = getNoteName(noteValue);
                const chordNoteName = getCompactChordNotation(noteName, chordId);

                // build button
                let button = document.createElement('button');
                button.innerText = chordNoteName;

                // build URL
                let url = window.location.pathname;
                url += "?note=" + noteValue.toString();
                url += "&chord=" + chordId;
                url += "&lang=" + culture;

                const callbackString = `openNewTab(\"${url}\")`;
                button.setAttribute("onClick", callbackString);

                foundChordsNbNotesHTML += "&nbsp;";
                foundChordsNbNotesHTML += button.outerHTML;
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
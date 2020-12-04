// find chords from notes
function findChords(notesValues, onlyFirstNoteAsFundamental = false)
{
    if (notesValues == null || notesValues.length < 2  || notesValues.length > 6)
        return [];

    let chordsArray = [];
    const nbNotesInChord = notesValues.length;
    const chordsDict = getChordDictionary(nbNotesInChord);

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
    const chordsDict = getChordDictionary(nbNotesInChord);

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


//////////////////////////////// CHORDS IN SCALE //////////////////////////////


function findChordsFromScaleScalesHTML(noteValue, scaleValues)
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
        paragraph.innerHTML = getString("chords_N_notes_all", nbNotes);

        const foundChordsNbNotes = foundChordsDict[nbNotes];

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

function findChordInScales(scaleValues, nbNotesMax)
{
    let chordsArray = [];
    const nbNotesInScale = scaleValues.length;

    for (let i = 0; i < nbNotesInScale; i++)
    {
        // build scale values starting from cycling fundamental
        let scaleValuesCur = [];
        for (let j = 0; j < nbNotesInScale; j++)
        {
            const value = scaleValues[(i + j) % nbNotesInScale];
            scaleValuesCur.push(value);
        }

        let fundamental = scaleValuesCur[0];

        // compute all intervals
        let intervalsValuesArray = [];
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
    let foundChordsDict = {}
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

        foundChordsDict[nbNotesInChord] = foundChordsNbNotes;
    }

    return foundChordsDict;
}


function getIntervalsInScale(scaleValues, nbNotesMax, intervalsValuesArray, onlyFirstNoteAsFundamental = false, intervalsValuesCur = [], startIndexCur = 0, nbNotesCur = 0)
{
    let nbNotesInScale = scaleValues.length;
    
    if (nbNotesCur < nbNotesMax)
    {
        let intervalsValuesArrayCur = cloneArrayArrayWithItemLength(intervalsValuesArray, nbNotesCur);

        let nbTries = 0;
        for (let i = startIndexCur; i < nbNotesInScale; i++)
        {
            // only first note as fundamental if option set
            if (onlyFirstNoteAsFundamental && nbNotesCur == 0 && i > startIndexCur)
                continue;

            const intervalsBuildCurrent = cloneIntegerArray(intervalsValuesCur);
            intervalsBuildCurrent.push(scaleValues[i]);
            
            if (!intervalsValuesArray.includes(intervalsBuildCurrent))
                intervalsValuesArray.push(intervalsBuildCurrent);
            getIntervalsInScale(scaleValues, nbNotesMax, intervalsValuesArray, onlyFirstNoteAsFundamental, intervalsBuildCurrent, i + 1, nbNotesCur + 1);

            // secure
            nbTries++;
            if (nbTries > 16)
                break;
        }
    }
}
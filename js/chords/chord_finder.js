"use strict";
// find chords from notes
function findChords(notesValues, onlyFirstNoteAsFundamental = false, firstNoteAsBass = false) {
    if (notesValues == null || notesValues.length < 2 || notesValues.length > 7)
        return [];
    let chordsArray = new Array();
    // 1st pass: find entire chords, without bass
    chordsArray = findEntireChords(notesValues, onlyFirstNoteAsFundamental, firstNoteAsBass);
    // 2nd pass: find relative chords with bass
    if (firstNoteAsBass) {
        let firstNote = notesValues[0];
        let notesValuesWoBass = [];
        for (const noteValue of notesValues) {
            if (noteValue != firstNote)
                notesValuesWoBass.push(noteValue);
        }
        chordsArray = chordsArray.concat(findChords(notesValuesWoBass));
    }
    return chordsArray;
}
// find entire chords (without bass) from notes
function findEntireChords(notesValues, onlyFirstNoteAsFundamental = false, firstNoteAsBass = false) {
    if (notesValues == null || notesValues.length < 2 || notesValues.length > 7)
        return [];
    let chordsArray = new Array();
    const nbNotesInChord = notesValues.length;
    // switch fundamental and compute intervals
    let firstNote = notesValues[0];
    for (let i = 0; i < nbNotesInChord; i++) {
        if (onlyFirstNoteAsFundamental && i > 0)
            break;
        let fundamental = notesValues[i];
        let bass = (firstNoteAsBass && fundamental != firstNote) ? firstNote : -1;
        let intervalsValues = new Array();
        for (let value of notesValues) {
            const interval = (value - fundamental + 10 * 12) % 12;
            intervalsValues.push(interval);
        }
        // sort intervals
        intervalsValues.sort((a, b) => a - b);
        // find chords ids with octave
        const chordsIdsFound = getChordsIdsWithOctave(intervalsValues);
        for (let chordId of chordsIdsFound) {
            if (chordId != null && chordId != "" && chordId != "?")
                chordsArray.push([fundamental, chordId, bass]);
        }
    }
    return chordsArray;
}
function getChordsIdsWithOctave(intervalsValues) {
    let chordsIdsArray = new Array();
    let intervalsValuesArray = new Array();
    const nbNotesInChord = intervalsValues.length;
    const chordsDict = getChordDictionary(nbNotesInChord);
    // compute all intervals combinations with octave
    getIntervalsWithOctave(intervalsValues, intervalsValuesArray);
    // search corresponding chord ids
    for (let intervalsValuesFound of intervalsValuesArray) {
        const chordId = getKeyFromArrayValue(chordsDict, intervalsValuesFound);
        if (chordId != null && chordId != "" && chordId != "?")
            chordsIdsArray.push(chordId);
    }
    return chordsIdsArray;
}
function getIntervalsWithOctave(intervalsValues, intervalsValuesArray, intervalIndex = 0) {
    const nbNotesInChord = intervalsValues.length;
    // start: do not compute fundamental's octave
    if (intervalIndex == 0) {
        intervalsValuesArray.push([intervalsValues[0]]);
        getIntervalsWithOctave(intervalsValues, intervalsValuesArray, 1);
    }
    else if (intervalIndex < nbNotesInChord) {
        let nbTries = 0;
        let intervalsValuesArrayCur = cloneArrayArrayWithItemLength(intervalsValuesArray, intervalIndex);
        for (let intervalsValueBuild of intervalsValuesArrayCur) {
            const intervalsBuildCurrent = cloneIntegerArray(intervalsValueBuild);
            const intervalsBuildOctave = cloneIntegerArray(intervalsValueBuild);
            // add current value and its octave
            intervalsBuildCurrent.push(intervalsValues[intervalIndex]);
            intervalsBuildOctave.push(intervalsValues[intervalIndex] + 12);
            intervalsValuesArray.push(intervalsBuildCurrent, intervalsBuildOctave);
            if (intervalIndex < nbNotesInChord - 1) {
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
        for (let intervals of intervalsValuesArray) {
            intervals.sort((a, b) => a - b);
        }
    }
}
//////////////////////////////// CHORDS IN SCALE //////////////////////////////
function findChordsFromScaleScalesHTML(tonicValue, scaleValues, charIntervals = []) {
    let foundChordsHTML = "<br>";
    const nbNotesMax = 6;
    let noteValues = [];
    const culture = getSelectedCulture();
    // compute scale note values
    for (let intervalValue of scaleValues)
        noteValues.push((tonicValue + intervalValue) % 12);
    // compute characteristic note values
    const charNotesValues = new Array();
    for (const index of charIntervals) {
        const charNoteValue = noteValues[index];
        charNotesValues.push(charNoteValue);
    }
    // find all chords
    const foundChordsDict = findChordInScales(noteValues, nbNotesMax);
    // build buttons
    for (let nbNotes = 2; nbNotes <= nbNotesMax; nbNotes++) {
        let paragraph = document.createElement('p');
        paragraph.innerHTML = `${getString("chords_N_notes_all", nbNotes.toString())} `;
        const foundChordsNbNotes = foundChordsDict.get(nbNotes);
        let foundChordsNbNotesHTML = "";
        if (foundChordsNbNotes == null || foundChordsNbNotes.length == 0)
            foundChordsNbNotesHTML = getString("no_result");
        else {
            for (let noteChord of foundChordsNbNotes) {
                let noteValue = noteChord[0];
                const chordId = noteChord[1];
                const chordValues = getChordValues(chordId);
                const isTonic = (noteValue % 12 == tonicValue % 12);
                const isCharacteristic = isChordCharacteristic(noteValue, chordValues, charNotesValues);
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
                // build chord URL (if not microtonal/xenharmonic)
                if (!isXenharmonicInterval(noteValue)) {
                    let url = window.location.pathname;
                    url += "?note=" + noteValue.toString();
                    url += "&chord=" + chordId;
                    url += "&lang=" + culture;
                    if (pageSelected == "page_scale_explorer") {
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
                buttonPlay.disabled = !hasAudio;
                foundChordsNbNotesHTML += `${buttonPlay.outerHTML}\r\n`;
            }
        }
        paragraph.innerHTML += foundChordsNbNotesHTML;
        foundChordsHTML += paragraph.outerHTML;
    }
    return foundChordsHTML;
}
function findChordInScales(scaleValues, nbNotesMax) {
    let chordsArray = new Array();
    const nbNotesInScale = scaleValues.length;
    for (let i = 0; i < nbNotesInScale; i++) {
        // build scale values starting from cycling fundamental
        let scaleValuesCur = [];
        for (let j = 0; j < nbNotesInScale; j++) {
            const value = scaleValues[(i + j) % nbNotesInScale];
            scaleValuesCur.push(value);
        }
        let fundamental = scaleValuesCur[0];
        // compute all intervals
        let intervalsValuesArray = new Array();
        getIntervalsInScale(scaleValuesCur, nbNotesMax, intervalsValuesArray);
        // search corresponding chord ids
        for (let intervalsValuesFound of intervalsValuesArray) {
            const nbNotes = intervalsValuesFound.length;
            if (nbNotes < 2)
                continue;
            let chordsFound = findChords(intervalsValuesFound, true);
            for (let chordFound of chordsFound) {
                if (chordFound[0] == fundamental)
                    chordsArray.push(chordFound);
            }
        }
    }
    // sort given number of notes in chords
    let foundChordsDict = new Map();
    for (let nbNotesInChord = 2; nbNotesInChord <= 6; nbNotesInChord++) {
        let foundChordsNbNotes = [];
        for (let foundChord of chordsArray) {
            const chordId = foundChord[1];
            const chordValues = getChordValues(chordId);
            if (chordValues.length == nbNotesInChord)
                foundChordsNbNotes.push(foundChord);
        }
        foundChordsDict.set(nbNotesInChord, foundChordsNbNotes);
    }
    return foundChordsDict;
}
function getIntervalsInScale(scaleValues, nbNotesMax, intervalsValuesArray, onlyFirstNoteAsFundamental = false, intervalsValuesCur = [], startIndexCur = 0, nbNotesCur = 0) {
    let nbNotesInScale = scaleValues.length;
    if (nbNotesCur < nbNotesMax) {
        let intervalsValuesArrayCur = cloneArrayArrayWithItemLength(intervalsValuesArray, nbNotesCur);
        let nbTries = 0;
        for (let i = startIndexCur; i < nbNotesInScale; i++) {
            // only first note as fundamental if option set
            if (onlyFirstNoteAsFundamental && nbNotesCur == 0 && i > startIndexCur)
                continue;
            const intervalsBuildCurrent = cloneIntegerArray(intervalsValuesCur);
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
function findNeapChordFromTonicHTML(tonicValue) {
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
    // build chord URL (if not microtonal/xenharmonic)
    if (!isQuarterToneInterval(noteValue) && !isXenharmonicInterval(noteValue)) {
        let url = window.location.pathname;
        url += "?note=" + noteValue.toString();
        url += "&chord=" + chordId;
        url += "&bass=" + bassValue;
        url += "&lang=" + culture;
        if (pageSelected == "page_scale_explorer") {
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
    buttonPlay.disabled = !hasAudio;
    neapChordHTML += `${buttonPlay.outerHTML}\r\n`;
    paragraph.innerHTML += neapChordHTML;
    foundNeapChordHTML += paragraph.outerHTML;
    return foundNeapChordHTML;
}
function findAug6thChordsFromTonicHTML(tonicValue) {
    let foundAug6ChordsHTML = "";
    const culture = getSelectedCulture();
    let paragraph = document.createElement('p');
    paragraph.innerHTML = `${getString("chords_aug_6th")} `;
    // Italian 6th chord: bVI7(no5)
    const it6Chord = [8, "It+6", ""];
    // French 6th chord: bVI7b5
    const fr6Chord = [8, "Fr+6", ""];
    // German 6th chord: bVI7
    const ger6Chord = [8, "7", "Ger+6"];
    const aug6Chords = [it6Chord, fr6Chord, ger6Chord];
    for (let [intervalValue, chordId, chordNameAux] of aug6Chords) {
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
        // build chord URL (if not microtonal/xenharmonic)
        if (!isQuarterToneInterval(noteValue) && !isXenharmonicInterval(noteValue)) {
            let url = window.location.pathname;
            url += "?note=" + noteValue.toString();
            url += "&chord=" + chordId;
            url += "&lang=" + culture;
            if (pageSelected == "page_scale_explorer") {
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
        buttonPlay.disabled = !hasAudio;
        aug6ChordHTML += `${buttonPlay.outerHTML}\r\n`;
        paragraph.innerHTML += aug6ChordHTML;
    }
    foundAug6ChordsHTML += paragraph.outerHTML;
    return foundAug6ChordsHTML;
}
//# sourceMappingURL=chord_finder.js.map
"use strict";
const commonChords = [
    /* 3 notes */ "M", "m", "sus2", "sus4", "dim", "aug",
    /* 4 notes */ "7M", "7", "m7", "add9", "madd9", "add11", "madd11", "m7flat5", "dor",
    /* 5 notes */ "9M", "9", "m9", "6slash9"
];
function updateChordTesterTables(noteStartValue, octaveStartValue, keys = [], qTones = false) {
    const nbKeys = (keys != null) ? keys.length : 0;
    const noteStep = (qTones ? 0.5 : 1);
    let keyNotesHTML = "";
    // get scale notes values if specified
    let scaleNotesValuesArray = [];
    let tonicScaleIdArray = [];
    if (nbKeys > 0) {
        for (const [tonicValueCur, scaleIdCur] of keys) {
            tonicScaleIdArray.push([tonicValueCur, scaleIdCur]);
            const scaleValues = getScaleValues(scaleIdCur);
            const scaleNotesValuesCur = getScaleNotesValues(tonicValueCur, scaleValues);
            scaleNotesValuesArray.push(scaleNotesValuesCur);
        }
    }
    // update key(s) notes
    const keyNotes = document.getElementById("key_notes_chord_tester");
    keyNotes.innerText = "";
    if (nbKeys == 1) {
        // highlight tonic and characteristic notes
        const tonicValue = tonicScaleIdArray[0][0];
        const scaleId = tonicScaleIdArray[0][1];
        const charNotesValues = getScaleCharValuesFromNotes(scaleId, scaleNotesValuesArray[0]);
        keyNotesHTML = getArpeggioNotesText(tonicValue, getScaleValues(scaleId), tonicValue, charNotesValues);
    }
    else if (nbKeys == 2) {
        // display keys notes with corresponding colors
        keyNotesHTML = get2KeysNotesText(scaleNotesValuesArray);
    }
    keyNotes.innerHTML = keyNotesHTML;
    let chordsTablesHTML = "";
    const commonChordsOnly = document.getElementById("checkboxCommonChords").checked;
    for (const [nbNotesInChords, chordsDict] of chordsDicts) {
        let chordsTableHTML = /*html*/ `<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())}</div><div id=\"resp-table-body\">`;
        let hasChordsWithNbNotes = false;
        // list all chords with current nb. notes
        for (const [chordId, chordValues] of chordsDict) {
            let chordsRowHTML = /*html*/ `<div class=\"resp-table-row\">`;
            // TODO: only show microtonal chord if option checked
            if (!qTones && isMicrotonalChord(chordId))
                continue;
            // if show common chords only, skip non-common chords
            if (commonChordsOnly && commonChords.indexOf(chordId) < 0)
                continue;
            hasChordsWithNbNotes = true;
            for (let noteValue = noteStartValue; noteValue < 12 + noteStartValue; noteValue += noteStep) {
                const noteValueInOctave = (noteValue % 12);
                const noteName = getNoteName(noteValueInOctave);
                const callbackString = `playChordTest(${noteValue + 12 * (octaveStartValue - 2)}, [${chordValues.toString()}])`;
                let classString = "table-body-cell";
                const divChord = document.createElement('div');
                // grey chords if not in specified scale(s)
                if (nbKeys == 1) {
                    let inScale = areChordNotesInScale(noteValueInOctave, chordValues, scaleNotesValuesArray[0]);
                    if (!inScale)
                        classString = "table-body-cell-grey";
                    else if (scaleNotesValuesArray[0] != null && scaleNotesValuesArray[0].length > 0) {
                        for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                            // highlight characteristic chords
                            const charNotesValues = getScaleCharValuesFromNotes(scaleId, scaleNotesValuesArray[0]);
                            const isCharacteristic = isChordCharacteristic(noteValueInOctave, chordValues, charNotesValues);
                            if (noteValueInOctave != tonicValue && isCharacteristic)
                                classString = "table-body-cell-char";
                            if (noteValueInOctave == tonicValue)
                                classString = "table-body-cell-tonic";
                        }
                    }
                    // highlight Neapolitan / augmented 6th chords
                    for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                        if (isChordNeapolitan(tonicValue, noteValueInOctave, chordId))
                            classString = "table-body-cell-neap";
                        if (isChordAugmented6th(tonicValue, noteValueInOctave, chordId))
                            classString = "table-body-cell-aug6";
                    }
                }
                else if (nbKeys == 2) {
                    let inScale1 = areChordNotesInScale(noteValueInOctave, chordValues, scaleNotesValuesArray[0]);
                    let inScale2 = areChordNotesInScale(noteValueInOctave, chordValues, scaleNotesValuesArray[1]);
                    if (!inScale1 && !inScale2)
                        classString = "table-body-cell-grey";
                    else if (inScale1 && !inScale2)
                        classString = "table-body-cell-key1";
                    else if (!inScale1 && inScale2)
                        classString = "table-body-cell-key2";
                    else if (inScale1 && inScale2)
                        classString = "table-body-cell-keyc";
                }
                if (hasAudio)
                    classString += "-interactive";
                divChord.classList.add(classString);
                if (qTones)
                    divChord.classList.add("table-body-cell-small");
                // set notes as tooltip
                divChord.title =
                    getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");
                divChord.setAttribute("onClick", callbackString);
                //divChord.innerText = (noteValue == 0) ?
                //    getCompactChordNotation(noteName, chordId) : noteName;
                divChord.innerText = getCompactChordNotation(noteName, chordId);
                // Neapolitan / German augmented 6th chord specific
                if (nbKeys == 1)
                    for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                        //if (isChordNeapolitan(tonicValue, noteValue, chordId))
                        //    divChord.innerText +=  ` / ${noteName}N6`;
                        if (isChordGermanAug6th(tonicValue, noteValue, chordId))
                            divChord.innerText += ` / ${noteName}Ger+6`;
                    }
                chordsRowHTML += divChord.outerHTML;
            }
            chordsRowHTML += "</div>";
            chordsTableHTML += chordsRowHTML;
        }
        chordsTableHTML += "</div>";
        if (hasChordsWithNbNotes) {
            chordsTablesHTML += chordsTableHTML;
            chordsTablesHTML += "</div>";
            chordsTablesHTML += "<br/>";
        }
    }
    document.getElementById('chord_tester').innerHTML = chordsTablesHTML;
}
function playChordTest(noteValue, chordValues) {
    // get delay given selected mode (arpeggios chord)
    const delay = document.getElementById("radioChordTesterArpeggios").checked ?
        0.25 : 0;
    playChord(noteValue, chordValues, 0, delay);
}
function get2KeysNotesText(scaleNotesValuesArray) {
    if (scaleNotesValuesArray == null || scaleNotesValuesArray.length != 2)
        return "";
    let keysNotesStr = "";
    for (let noteValue = 0; noteValue < 12; noteValue++) {
        const isInKey1 = (scaleNotesValuesArray[0].indexOf(noteValue) >= 0);
        const isInKey2 = (scaleNotesValuesArray[1].indexOf(noteValue) >= 0);
        if (!isInKey1 && !isInKey2)
            continue;
        // add note with corresponding color
        const noteName = getNoteName(noteValue);
        const noteSpan = document.createElement("span");
        noteSpan.textContent = noteName;
        if (isInKey1 && !isInKey2)
            noteSpan.classList.add("span-key1");
        else if (!isInKey1 && isInKey2)
            noteSpan.classList.add("span-key2");
        else if (isInKey1 && isInKey2)
            noteSpan.classList.add("span-keyc");
        keysNotesStr += noteSpan.outerHTML;
        keysNotesStr += `, `;
    }
    keysNotesStr = keysNotesStr.slice(0, -2);
    return keysNotesStr;
}
//# sourceMappingURL=chord_tester.js.map
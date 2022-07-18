"use strict";
const commonChords = [
    /* 3 notes */ "M", "m", "sus2", "sus4", "dim", "aug",
    /* 4 notes */ "7M", "7", "m7", "add9", "madd9", "add11", "madd11", "m7flat5", "m6M",
    /* 5 notes */ "9M", "9", "m9", "6slash9"
];
function updateChordTesterTables(noteStartValue, octaveStartValue, keys = []) {
    let commonNotesStr = "";
    // get scale notes values if specified
    let tonicScaleIdArray = [];
    let scaleNotesValues = [];
    if (keys != null && keys.length > 0) {
        let scaleNotesValuesArray = [];
        for (const [tonicValueCur, scaleIdCur] of keys) {
            tonicScaleIdArray.push([tonicValueCur, scaleIdCur]);
            const scaleValues = getScaleValues(scaleIdCur);
            const scaleNotesValuesCur = getScaleNotesValues(tonicValueCur, scaleValues);
            scaleNotesValuesArray.push(scaleNotesValuesCur);
        }
        // get scale(s) common notes
        if (scaleNotesValuesArray.length == 1)
            scaleNotesValues = scaleNotesValuesArray[0];
        else if (scaleNotesValuesArray.length == 2)
            scaleNotesValues = getArrayIntersection(scaleNotesValuesArray[0], scaleNotesValuesArray[1]);
        // compute common notes
        if (scaleNotesValues == null || scaleNotesValues.length == 0)
            commonNotesStr = getString("no_result");
        else {
            let index = 0;
            for (const noteValue of scaleNotesValues) {
                if (index > 0)
                    commonNotesStr += ", ";
                commonNotesStr += getNoteName(noteValue);
                index++;
            }
        }
    }
    // update common notes
    const commonNotes = document.getElementById("common_notes_chord_tester");
    commonNotes.innerText = commonNotesStr;
    let chordsTablesHTML = "";
    const commonChordsOnly = document.getElementById("checkboxCommonChords").checked;
    for (const [nbNotesInChords, chordsDict] of chordsDicts) {
        let chordsTableHTML = /*html*/ `<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())}</div><div id=\"resp-table-body\">`;
        let hasChordsWithNbNotes = false;
        // list all chords with current nb. notes
        for (const [chordId, chordValues] of chordsDict) {
            let chordsRowHTML = /*html*/ `<div class=\"resp-table-row\">`;
            // if show common chords only, skip non-common chords
            if (commonChordsOnly && commonChords.indexOf(chordId) < 0)
                continue;
            hasChordsWithNbNotes = true;
            for (let noteValue = noteStartValue; noteValue < 12 + noteStartValue; noteValue++) {
                const noteValueInOctave = (noteValue % 12);
                const noteName = getNoteName(noteValueInOctave);
                const callbackString = `playChordTest(${noteValue + 12 * (octaveStartValue - 2)}, [${chordValues.toString()}])`;
                let classString = "table-body-cell-interactive";
                const divChord = document.createElement('div');
                // grey chords if not in specified scale(s)
                if (keys != null && keys.length > 0) {
                    let inScale = areChordNotesInScale(noteValueInOctave, chordValues, scaleNotesValues);
                    if (!inScale)
                        classString = "table-body-cell-grey-interactive";
                    else if (scaleNotesValues != null && scaleNotesValues.length > 0) {
                        for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                            // highlight characteristic chords
                            const charIntervals = getScaleCharIntervals(scaleId);
                            const charNotesValues = new Array();
                            for (const index of charIntervals) {
                                const charNoteValue = scaleNotesValues[index];
                                charNotesValues.push(charNoteValue);
                            }
                            const isCharacteristic = isChordCharacteristic(noteValueInOctave, chordValues, charNotesValues);
                            if (noteValueInOctave != tonicValue && isCharacteristic)
                                classString = "table-body-cell-char-interactive";
                            if (noteValueInOctave == tonicValue)
                                classString = "table-body-cell-tonic-interactive";
                        }
                    }
                    // highlight Neapolitan / augmented 6th chords
                    for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                        if (isChordNeapolitan(tonicValue, noteValueInOctave, chordId))
                            classString = "table-body-cell-neap-interactive";
                        if (isChordAugmented6th(tonicValue, noteValueInOctave, chordId))
                            classString = "table-body-cell-aug6-interactive";
                    }
                }
                divChord.classList.add(classString);
                // set notes as tooltip
                divChord.title =
                    getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");
                divChord.setAttribute("onClick", callbackString);
                //divChord.innerText = (noteValue == 0) ?
                //    getCompactChordNotation(noteName, chordId) : noteName;
                divChord.innerText = getCompactChordNotation(noteName, chordId);
                // Neapolitan / German augmented 6th chord specific
                for (const [tonicValue, scaleId] of tonicScaleIdArray) {
                    if (isChordNeapolitan(tonicValue, noteValue, chordId))
                        divChord.innerText += ` / ${noteName}N6`;
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
//# sourceMappingURL=chord_tester.js.map
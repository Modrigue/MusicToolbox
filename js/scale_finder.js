"use strict";
function findScales(notesValues, sameNbNotes = false, refTonicValue = -1) {
    // at least 2 notes needed
    if (notesValues == null || notesValues.length < 2)
        return new Array();
    const nbNotes = notesValues.length;
    const noteValue1 = notesValues[0];
    let scalesIds = [];
    for (const [key, value] of scalesDict_int) {
        // parse scale id
        const scaleAttributes = key.split(",");
        if (scaleAttributes.length < 2)
            continue;
        const scaleName = scaleAttributes[0];
        const mode = scaleAttributes[1];
        if (isNaN(mode))
            continue;
        const modeValue = parseInt(mode);
        const scaleFamily = scaleFamiliesDict.get(scaleName);
        const scaleValues = getModeNotesValues(scaleFamily, modeValue);
        if (sameNbNotes && scaleValues.length != nbNotes)
            continue;
        for (let tonicValue = noteValue1; tonicValue < 12 + noteValue1; tonicValue++) {
            // only take ref tonic if specified
            if (refTonicValue >= 0 && (tonicValue % 12) != refTonicValue)
                continue;
            let includesAllNotes = true;
            // compute scale values given tonic
            const scaleNotesValues = getScaleNotesValues(tonicValue, scaleValues);
            // check is scale includes all notes
            for (let i = 0; i < nbNotes; i++) {
                const noteValue = notesValues[i];
                if (scaleNotesValues.indexOf(noteValue) < 0) {
                    includesAllNotes = false;
                    break;
                }
            }
            // add scale id if all notes found
            if (includesAllNotes) {
                const id = (tonicValue % 12).toString() + "|" + key;
                scalesIds.push(id);
            }
        }
    }
    return scalesIds;
}
// build found scales HTML
function getFoundScalesHTML(notesValues, sameNbNotes = false, excludedNote = -1, excludedScale = "", tonicValue = -1) {
    let foundScalesHTML = "";
    const foundScales = findScales(notesValues, sameNbNotes, tonicValue);
    if (foundScales == null)
        return "";
    let nbScales = 0;
    for (let scaleId of foundScales) {
        // get tonic and scale key
        const scaleAttributes = scaleId.split("|");
        const tonicValue = parseInt(scaleAttributes[0]);
        const tonic = getNoteName(tonicValue);
        const scaleKey = scaleAttributes[1];
        // exclude defined note, scale if defined
        if (excludedNote >= 0 && excludedScale != "")
            if (tonicValue == excludedNote && scaleKey == excludedScale)
                continue;
        const scaleName = getScaleString(scaleKey);
        const text = tonic + " " + scaleName;
        // hightlight scale
        let styleString = "";
        if (hightlightScale(scaleKey))
            styleString = "style=\"font-weight:bold;\" ";
        const culture = getSelectedCulture();
        // build URL
        let url = window.location.pathname;
        url += "?note=" + tonicValue.toString();
        url += "&scale=" + scaleKey;
        url += "&lang=" + culture;
        if (pageSelected == "page_scale_explorer") {
            url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
            url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
        }
        // disabled: update same page
        //foundScalesHTML += "<button " + styleString + "onclick=\'selectNoteAndScale(\"" + scaleId + "\")\'>" + text + "</button>"; 
        let button = document.createElement('button');
        button.innerText = text;
        button.setAttribute("onClick", `openNewTab(\"${url}\")`);
        foundScalesHTML += `${button.outerHTML}\r\n`;
        nbScales++;
    }
    if (nbScales == 0)
        foundScalesHTML += getString("no_result");
    return foundScalesHTML;
}
// build negative scale HTML
function getNegativeFoundScaleHTML(notesValues, tonicValue = -1) {
    let negScalesHTML = "";
    const negScaleValues = getNegativeScaleValues(notesValues);
    if (negScaleValues == null || negScaleValues.length == 0)
        return "";
    const refTonicValue = (tonicValue >= 0) ? tonicValue : negScaleValues[0];
    const foundScales = findScales(negScaleValues, true, refTonicValue);
    if (foundScales == null)
        return "";
    let nbScales = 0;
    for (let scaleId of foundScales) {
        // get tonic and scale key
        const scaleAttributes = scaleId.split("|");
        const tonicValue = parseInt(scaleAttributes[0]);
        const tonic = getNoteName(tonicValue);
        const scaleKey = scaleAttributes[1];
        const scaleName = getScaleString(scaleKey);
        const text = tonic + " " + scaleName;
        // hightlight scale
        let styleString = "";
        if (hightlightScale(scaleKey))
            styleString = "style=\"font-weight:bold;\" ";
        const culture = getSelectedCulture();
        // build URL
        let url = window.location.pathname;
        url += "?note=" + tonicValue.toString();
        url += "&scale=" + scaleKey;
        url += "&lang=" + culture;
        if (pageSelected == "page_scale_explorer") {
            url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
            url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
        }
        // disabled: update same page
        //foundScalesHTML += "<button " + styleString + "onclick=\'selectNoteAndScale(\"" + scaleId + "\")\'>" + text + "</button>"; 
        let button = document.createElement('button');
        button.innerText = text;
        button.setAttribute("onClick", `openNewTab(\"${url}\")`);
        negScalesHTML += `${button.outerHTML}\r\n`;
        nbScales++;
    }
    if (nbScales == 0)
        negScalesHTML += getString("no_result");
    return negScalesHTML;
}
// scale explorer mode: find relative scales
function getRelativeScalesHTML(noteValue, scaleValues) {
    let relScalesHTML = `${getString("relative_scales")} `;
    // get selected scale
    const selectedScale = document.getElementById("scale").value;
    // find scales from notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    const foundScalesHTML = getFoundScalesHTML(scaleNotesValues, true, noteValue, selectedScale);
    relScalesHTML += foundScalesHTML;
    return relScalesHTML;
}
// scale explorer mode: find negative scale
function getNegativeScaleHTML(noteValue, scaleValues) {
    let negScaleHTML = `${getString("negative_scale")} `;
    // get selected scale
    const selectedScale = document.getElementById("scale").value;
    // find scale from notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    const negFoundScaleHTML = getNegativeFoundScaleHTML(scaleNotesValues);
    negScaleHTML += negFoundScaleHTML;
    return negScaleHTML;
}
// scale finder mode: find scales containing notes
function findScalesFromNotesHTML() {
    let finderScalesHTML = getString("scales") + " ";
    let notesValues = getSelectedNotesChordsFinderValues();
    const tonicValue = getSelectedTonicValue();
    // update found notes label
    const foundNotesLabel = document.getElementById("scale_finder_found_notes_text");
    if (notesValues == null || notesValues.length == 0)
        foundNotesLabel.innerHTML = "&nbsp;";
    else {
        let notesValuesSorted = new Array();
        for (let note of notesValues) {
            //const noteValue = parseInt(note);
            notesValuesSorted.push(note);
        }
        notesValuesSorted.sort((a, b) => a - b);
        let foundNotesStr = "";
        let index = 0;
        for (let noteValue of notesValuesSorted) {
            if (index > 0)
                foundNotesStr += ", ";
            foundNotesStr += getNoteName(noteValue);
            index++;
        }
        foundNotesLabel.innerHTML = foundNotesStr;
    }
    // update found scales
    const foundScalesHTML = getFoundScalesHTML(notesValues, false, -1, "", tonicValue);
    if (foundScalesHTML == "")
        return getString("min_2_notes");
    finderScalesHTML += foundScalesHTML;
    return finderScalesHTML;
}
// get selected notes and chords from finder selectors
function getSelectedNotesChordsFinderValues() {
    let notesValues = new Array();
    for (let i = 1; i <= 8; i++) {
        const tonicSelected = document.getElementById(`note_finder${i.toString()}`).value;
        const tonicValue = parseInt(tonicSelected);
        if (tonicValue < 0)
            continue;
        const chordSelector = document.getElementById(`chord_finder${i.toString()}`);
        let notesToAdd = new Array();
        if (!chordSelector.disabled && chordSelector.value != "-1") {
            // add chord notes
            const chordValues = getChordValues(chordSelector.value);
            for (const interval of chordValues) {
                const noteValue = addToNoteValue(tonicValue, interval);
                notesToAdd.push(noteValue);
            }
        }
        else {
            // add only tonic note
            notesToAdd.push(tonicValue);
        }
        for (const noteValue of notesToAdd)
            if (notesValues.indexOf(noteValue) < 0)
                notesValues.push(noteValue);
    }
    return notesValues;
}
// get selected tonic note
function getSelectedTonicValue() {
    const note = document.getElementById('note_finder_tonic').value;
    return parseInt(note);
}
//# sourceMappingURL=scale_finder.js.map
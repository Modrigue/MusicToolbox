"use strict";
////////////////////////////// SELECTORS FUNCTIONS ////////////////////////////
// get selected note
function getSelectedNoteValue() {
    const noteSelected = document.getElementById("note").value;
    return parseInt(noteSelected);
}
// get selected scale and mode notes values
function getSelectedScaleValues() {
    const scaleSelected = document.getElementById("scale").value;
    const scaleAttributes = scaleSelected.split(",");
    const scaleName = scaleAttributes[0];
    const modeValue = parseInt(scaleAttributes[1]);
    const scaleFamily = scaleFamiliesDict.get(scaleName);
    return getModeNotesValues(scaleFamily, modeValue);
}
// get selected scale and mode characteristic interval(s)
function getSelectedScaleCharIntervals() {
    const scaleSelected = document.getElementById("scale").value;
    let refScaleAttributes = scaleSelected.split(",");
    // no characterisitic notes
    if (refScaleAttributes.length < 3)
        return new Array();
    // parse reference scale attribute
    const diffString = refScaleAttributes[2];
    const diffAttributes = scaleSelected.split(":");
    if (diffAttributes.length < 2)
        return new Array();
    const refScaleString = diffAttributes[1];
    refScaleAttributes = refScaleString.split(";");
    const refScaleName = refScaleAttributes[0];
    const refModeValue = parseInt(refScaleAttributes[1]);
    const refScaleFamily = scaleFamiliesDict.get(refScaleName);
    // get selected and reference scale values
    const refScaleValues = getModeNotesValues(refScaleFamily, refModeValue);
    const scaleValues = getSelectedScaleValues();
    // compute differences between selected and reference scale values
    return arraysDiff(scaleValues, refScaleValues);
}
//////////////////////////////// NOTES FUNCTIONS //////////////////////////////
// get mode notes values given scale and mode number
function getModeNotesValues(scaleValues, modeNumber) {
    let modeNotesValues = new Array();
    const nbNotes = scaleValues.length;
    for (let i = 0; i < nbNotes; i++) {
        const index = (i + (modeNumber - 1)) % nbNotes;
        const noteValue = scaleValues[index];
        modeNotesValues.push(noteValue);
    }
    const firstInterval = scaleValues[modeNumber - 1];
    for (let i = 0; i < nbNotes; i++) {
        modeNotesValues[i] = (modeNotesValues[i] - firstInterval + 12) % 12;
    }
    return modeNotesValues;
}
//////////////////////////////// CHORDS FUNCTIONS /////////////////////////////
// get chord position given scale values and number of notes
function getChordNumberInScale(scaleValues, pos, nbNotes) {
    let chordValues = new Array();
    let posCur = pos;
    const nbNotesInScale = scaleValues.length;
    let firstNoteValue = -1;
    for (let i = 0; i < nbNotes; i++) {
        const value = scaleValues[posCur];
        if (i == 0)
            firstNoteValue = value;
        const finalValue = (value - firstNoteValue + 12) % 12;
        chordValues.push(finalValue);
        posCur = (posCur + 2) % nbNotesInScale;
    }
    return chordValues;
}
// get roman representation of chord position
function getRomanChord(pos, chordId, nbNotesInChords) {
    let romanPos = romanDigits.get(pos + 1);
    // write minor chords in lower case
    const chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
    const chordValues = chordsDict.get(chordId);
    let isMinorChord = false;
    if (chordValues != null && chordValues.length > 1) {
        isMinorChord = (chordValues[1] == 3);
        if (isMinorChord)
            romanPos = romanPos.toLowerCase();
    }
    // do not display 3-notes minor and major chord notation
    if (chordId == "m" || chordId == "M")
        romanPos = romanPos;
    else if (isMinorChord && chordId.startsWith('m'))
        //romanPos += chordId.substring(1);
        romanPos = getCompactChordNotation(romanPos, chordId.substring(1));
    else
        romanPos = getCompactChordNotation(romanPos, chordId);
    return romanPos;
}
// get scale inner steps values
function getScaleSteps(scaleValues) {
    if (scaleValues == null)
        return new Array();
    if (scaleValues.length < 2)
        return scaleValues;
    let stepsValues = new Array();
    let nbNotes = scaleValues.length;
    for (let i = 0; i < nbNotes - 1; i++) {
        let stepValue = scaleValues[i + 1] - scaleValues[i];
        stepsValues.push(stepValue);
    }
    stepsValues.push(scaleValues[0] + 12 - scaleValues[nbNotes - 1]); // last step with octave
    return stepsValues;
}
// get scale inner step notation
function getStepNotation(stepValue) {
    const nbTones = Math.floor(stepValue / 2);
    let nbTonesString = nbTones.toString();
    if (stepValue == 1)
        nbTonesString = "";
    return ((stepValue % 2 == 0) ? nbTonesString : nbTonesString + "½");
}
/////////////////////////////// HTML FUNCTIONS ////////////////////////////////
function getScaleNotesTableHTML(noteValue, scaleValues, charIntervals) {
    const nbNotesInScale = scaleValues.length;
    // create play button
    let button = document.createElement('button');
    button.innerText = `${getString("play")} ♪`;
    button.setAttribute("onClick", "onPlayScale()");
    // build scale notes list
    let notesScaleTablesHTML = `<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes ${button.outerHTML}</div><div id=\"resp-table-body\">`;
    let notesScaleRowHTML = "<div class=\"resp-table-row\">";
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    scaleNotesValues.forEach(function (noteValue, index) {
        // highlight if tonic / characteristic note
        let classString = "table-body-cell-interactive";
        if (index == 0)
            classString = "table-body-cell-tonic-interactive";
        else if (charIntervals != null && charIntervals.indexOf(index) >= 0)
            classString = "table-body-cell-char-interactive";
        const callbackString = `onPlayNoteInScale(${index})`;
        const noteName = getNoteName(noteValue);
        notesScaleRowHTML += `<div class=${classString} onclick=${callbackString}>${noteName}</div>`;
    });
    notesScaleRowHTML += "</div>";
    // build intervals list
    let intervalsScaleRowHTML = /*html*/ `<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">`;
    scaleValues.forEach(function (intervalValue, index) {
        const intervalName = intervalsDict.get(intervalValue);
        const intervalNameAlt = getAltIntervalNotation(intervalValue, index);
        // highlight if tonic / characteristic interval
        let classString = "table-body-cell";
        if (index == 0)
            classString = "table-body-cell-tonic";
        else if (charIntervals != null && charIntervals.indexOf(index) >= 0)
            classString = "table-body-cell-char";
        // display alternate notation if 7-notes cale
        const intervalString = (nbNotesInScale == 7) ?
            getIntervalString(intervalName, intervalNameAlt) : intervalName;
        intervalsScaleRowHTML += `<div class=${classString}>`;
        intervalsScaleRowHTML += intervalString;
        intervalsScaleRowHTML += "</div>";
    });
    intervalsScaleRowHTML += "</div>";
    // build steps list
    const stepsScaleValues = getScaleSteps(scaleValues);
    let stepsScaleRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;\">";
    stepsScaleValues.forEach(function (stepValue, index) {
        const stepNotation = getStepNotation(stepValue);
        // highlight semi-tones and big steps
        let classString = "table-body-cell";
        if (stepValue == 1)
            classString = "table-body-cell-step-1";
        else if (stepValue == 3)
            classString = "table-body-cell-step-3";
        else if (stepValue >= 4)
            classString = "table-body-cell-step-4";
        stepsScaleRowHTML += `<div class=${classString}>${stepNotation}</div>`;
    });
    stepsScaleRowHTML += "</div>";
    notesScaleTablesHTML += notesScaleRowHTML;
    notesScaleTablesHTML += intervalsScaleRowHTML;
    notesScaleTablesHTML += stepsScaleRowHTML;
    notesScaleTablesHTML += "</div>";
    return notesScaleTablesHTML;
}
function getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, nbNotesInChords) {
    let chordValuesArray = new Array();
    const chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
    const culture = getSelectedCulture();
    // create play button
    let button = document.createElement('button');
    button.innerText = `${getString("play")} ♪`;
    button.setAttribute("onClick", `onPlayChords(${nbNotesInChords})`);
    // header
    let chordsTableHTML = `<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())} ${button.outerHTML}</div><div id=\"resp-table-body\">`;
    scaleValues.forEach(function (noteValue, index) {
        const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
        chordValuesArray.push(chordValues);
    });
    // get tonic and charcteristic notes values
    const tonicValue = scaleNotesValues[0];
    const charNotesValues = new Array();
    for (const index of charIntervals) {
        const charNoteValue = scaleNotesValues[index];
        charNotesValues.push(charNoteValue);
    }
    // chords
    let chordsRowHTML = "<div class=\"resp-table-row\">";
    chordValuesArray.forEach(function (chordValues, index) {
        const noteValue = scaleNotesValues[index];
        const noteName = getNoteName(noteValue);
        const chordName = getKeyFromArrayValue(chordsDict, chordValues);
        const chordNoteName = getCompactChordNotation(noteName, chordName);
        const callbackString = `onPlayChordInScale(${nbNotesInChords},${index})`;
        // highlight if tonic note
        let classString = "table-body-cell-interactive";
        if (index == 0)
            classString = "table-body-cell-tonic-interactive";
        chordsRowHTML += /*html*/ `<div class=${classString} onclick=${callbackString}>`;
        chordsRowHTML += chordNoteName;
        chordsRowHTML += "</div>";
    });
    chordsRowHTML += "</div>";
    // degree roman chord representation
    let chordsRomanRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
    chordValuesArray.forEach(function (chordValues, index) {
        const chordName = getKeyFromArrayValue(chordsDict, chordValues);
        const romanChord = getRomanChord(index, chordName, nbNotesInChords);
        // highlight if tonic degree
        let classString = "table-body-cell";
        if (index == 0)
            classString = "table-body-cell-tonic";
        chordsRomanRowHTML += /*html*/ `<div class=${classString}>`;
        chordsRomanRowHTML += romanChord;
        chordsRomanRowHTML += "</div>";
    });
    chordsRomanRowHTML += "</div>";
    // arpeggios notes
    let arpeggiosNotesRowHTML = "<div class=\"resp-table-row\">";
    chordValuesArray.forEach(function (chordValues, index) {
        const noteFondamental = scaleNotesValues[index];
        const callbackString = `onPlayChordInScale(${nbNotesInChords},${index},0.25)`;
        arpeggiosNotesRowHTML += /*html*/ `<div class=\"table-body-cell-interactive\" onclick=${callbackString}>`;
        arpeggiosNotesRowHTML += getArpeggioNotes(noteFondamental, chordValues, tonicValue, charNotesValues);
        arpeggiosNotesRowHTML += "</div>";
    });
    arpeggiosNotesRowHTML += "</div>";
    // arpeggios intervals
    let arpeggiosIntervalsRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
    chordValuesArray.forEach(function (chordValues, index) {
        // highlight if tonic degree
        let classString = "table-body-cell";
        if (index == 0)
            classString = "table-body-cell-tonic";
        arpeggiosIntervalsRowHTML += /*html*/ `<div class=${classString}>`;
        arpeggiosIntervalsRowHTML += getArpeggioIntervals(chordValues);
        arpeggiosIntervalsRowHTML += "</div>";
    });
    arpeggiosIntervalsRowHTML += "</div>";
    // chords details
    const imgMagnifier = new Image();
    imgMagnifier.src = 'img/magnifier_16.png';
    imgMagnifier.alt = "MAG";
    let chordsDetailsRowHTML = "<div class=\"resp-table-row\">";
    chordValuesArray.forEach(function (chordValues, index) {
        const chordId = getKeyFromArrayValue(chordsDict, chordValues);
        // build URL
        let url = window.location.pathname;
        const noteValue = scaleNotesValues[index];
        url += "?note=" + noteValue.toString();
        url += "&chord=" + chordId;
        url += "&lang=" + culture;
        url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
        url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
        const callbackString = `openNewTab(\"${url}\")`;
        chordsDetailsRowHTML += "<div class=\"table-body-cell-interactive\" onclick=" + callbackString + ">";
        //chordsDetailsRowHTML += "&#x1f50d";
        chordsDetailsRowHTML += imgMagnifier.outerHTML;
        chordsDetailsRowHTML += "</div>";
    });
    chordsDetailsRowHTML += "</div>";
    chordsTableHTML += chordsRowHTML;
    chordsTableHTML += chordsRomanRowHTML;
    chordsTableHTML += arpeggiosNotesRowHTML;
    chordsTableHTML += arpeggiosIntervalsRowHTML;
    chordsTableHTML += chordsDetailsRowHTML;
    chordsTableHTML += "</div>";
    return chordsTableHTML;
}
//# sourceMappingURL=scale_explorer.js.map
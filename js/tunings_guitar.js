"use strict";
// guitar tunings with 4 notes (bass)
const guitarTunings4Dict = new Map();
guitarTunings4Dict.set("standard", [7, 0, 5, 10]);
guitarTunings4Dict.set("dropped_d", [5, 0, 5, 10]);
// guitar tunings with 7 notes -bass / mandolin)
const guitarTunings5Dict = new Map();
guitarTunings5Dict.set("standard", [2, 7, 0, 5, 10]);
// guitar tunings with 6 notes
const guitarTunings6Dict = new Map();
guitarTunings6Dict.set("standard", [7, 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("dropped_d", [5, 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("open_g", [10, 2, 5, 10, 2, 5]);
guitarTunings6Dict.set("dadgad", [5, 0, 5, 10, 0, 5]);
// guitar tunings with 7 notes
const guitarTunings7Dict = new Map();
guitarTunings7Dict.set("standard", [2, 7, 0, 5, 10, 2, 7]);
// global guitar tunings dictionary
const guitarTuningsDict = new Map();
guitarTuningsDict.set(4, guitarTunings4Dict);
guitarTuningsDict.set(5, guitarTunings5Dict);
guitarTuningsDict.set(6, guitarTunings6Dict);
guitarTuningsDict.set(7, guitarTunings7Dict);
///////////////////////////////// GUITAR TUNING ///////////////////////////////
function initGuitarTuningSelector(id, useURLParams = true, nbStrings = 6, tuningId = "Standard") {
    // get chord selecor
    //const nbStringsSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const tuningSelect = document.getElementById(id);
    const initialized = (tuningSelect.options != null && tuningSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;
    // get nb. strings and tuning parameter if existing
    if (useURLParams) {
        const nbStringsParamValue = parseParameterById("nb_strings");
        const tuningParamValue = parseParameterById("guitar_tuning");
        if (nbStringsParamValue != "")
            nbStrings = parseInt(nbStringsParamValue);
        if (tuningParamValue != "")
            tuningId = tuningParamValue;
    }
    // init
    let guitarTuningDict = guitarTuningsDict.get(nbStrings);
    {
        // add tunings
        for (const [key, value] of guitarTuningDict) {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getGuitarTuningNotation(key);
            if (key == tuningId)
                option.selected = true;
            tuningSelect.appendChild(option);
        }
    }
    // disable if only 1 option
    tuningSelect.disabled = (tuningSelect.options.length <= 1);
}
function updateGuitarTuningGivenNbStrings(id, nbStrings) {
    const tuningSelect = document.getElementById(id);
    const tuningIdFormer = getSelectedGuitarTuningId(id);
    // get corresponding guitar tunings
    if (!guitarTuningsDict.has(nbStrings))
        return;
    const guitarTuningDict = guitarTuningsDict.get(nbStrings);
    // replace selector options and try to select former corresponding guitar tuning
    removeAllChildNodes(tuningSelect);
    const tuningId = guitarTuningDict.has(tuningIdFormer) ? tuningIdFormer : "standard";
    initGuitarTuningSelector(id, false, nbStrings, tuningId);
}
function getGuitarTuningNotation(tuningId) {
    // specific
    if (tuningId.toUpperCase() == "DADGAD")
        return "DADGAD";
    let tuning = tuningId.replace(/_/g, " ");
    tuning = toTitleCase(tuning);
    return tuning;
}
function getSelectedGuitarTuningId(id) {
    const tuningSelect = document.getElementById(id);
    let tuningId = tuningSelect.value;
    return tuningId;
}
function getSelectedGuitarTuningValue(id) {
    const tuningSelect = document.getElementById(id);
    let tuningId = tuningSelect.value;
    // get tunings dict corresponding to selected nb. strings
    const nbStringsSelectId = id.replace('guitar_tuning', 'guitar_nb_strings');
    const nbStrings = getSelectedGuitarNbStrings(nbStringsSelectId);
    const guitarTuningDict = guitarTuningsDict.get(nbStrings);
    if (!guitarTuningDict.has(tuningId))
        tuningId = "Standard"; // fallback
    return guitarTuningDict.get(tuningId);
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
////////////////////////////// NUMBER OF STRINGS //////////////////////////////
function initGuitarNbStringsSelector(id, minNbStrings = 4, maxNbStrings = 7, defaultNbStrings = 6) {
    // get chord selecor
    const nbStringsSelect = document.getElementById(id);
    const initialized = (nbStringsSelect.options != null && nbStringsSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;
    // get nb. strings and tuning parameter if existing
    const nbStringsParamValue = parseParameterById("nb_strings");
    if (nbStringsParamValue != "")
        defaultNbStrings = parseInt(nbStringsParamValue);
    // add tunings
    for (let i = minNbStrings; i <= maxNbStrings; i++) {
        let option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        if (i == defaultNbStrings)
            option.selected = true;
        nbStringsSelect.appendChild(option);
    }
}
function getSelectedGuitarNbStrings(id) {
    if (id.startsWith('chord_explorer'))
        return 6;
    const nbStringsSelect = document.getElementById(id);
    let nbStrings = parseInt(nbStringsSelect.value);
    return nbStrings;
}
//# sourceMappingURL=tunings_guitar.js.map
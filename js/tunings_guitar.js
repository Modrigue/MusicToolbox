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
/////////////////////////////////// FUNCTIONS /////////////////////////////////
function initGuitarTuningSelector(id, defaultNbStrings = 6, defaultTuningId = "Standard") {
    // get chord selecor
    //const nbStringsSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const tuningSelect = document.getElementById(id);
    const initialized = (tuningSelect.options != null && tuningSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;
    // get nb. strings and tuning parameter if existing
    const nbStringsParamValue = parseParameterById("nb_strings");
    const tuningParamValue = parseParameterById("guitar_tuning");
    if (nbStringsParamValue != "")
        defaultNbStrings = parseInt(nbStringsParamValue);
    if (tuningParamValue != "")
        defaultTuningId = tuningParamValue;
    // init
    let guitarTuningDict = guitarTunings6Dict;
    {
        // add tunings
        for (const [key, value] of guitarTuningDict) {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getGuitarTuningNotation(key);
            if (key == defaultTuningId)
                option.selected = true;
            tuningSelect.appendChild(option);
        }
    }
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
    // TODO: get tunings dict corresponding to selected nb. strings
    const guitarTuningDict = guitarTunings6Dict;
    if (!guitarTuningDict.has(tuningId))
        tuningId = "Standard"; // fallback
    return guitarTuningDict.get(tuningId);
}
//# sourceMappingURL=tunings_guitar.js.map
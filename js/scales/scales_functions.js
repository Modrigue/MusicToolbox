"use strict";
// update scale selector
function updateScaleSelector(id, defaultScaleId, includesQTones = true, includesExtraScales = false) {
    const scaleSelect = document.getElementById(id);
    const initialized = (scaleSelect.options != null && scaleSelect.options.length > 0);
    const regexNbNotes = /(\d+)notes/;
    const scaleParamValue = parseParameterById("scale");
    if (scaleParamValue != "")
        defaultScaleId = scaleParamValue;
    if (!initialized) {
        // init
        for (const [key, value] of scalesDict_int) {
            if (!includesQTones && key.includes("quarter_tones"))
                break;
            if (!includesExtraScales && key.startsWith("12tet"))
                continue;
            if (!includesExtraScales && key.startsWith("xenharmonics"))
                break;
            const scaleName = getScaleString(key);
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = scaleName;
            // scale to highlight
            if (hightlightScale(key))
                option.classList.add('bolden');
            // notes seperator
            if (key.match(regexNbNotes) || key.startsWith("qtones") || key.startsWith("xenharmonics")) {
                option.classList.add('bolden');
                option.disabled = true;
            }
            // simple separator
            if (scaleName == "")
                option.disabled = true;
            // default scale
            if (key == defaultScaleId)
                option.selected = true;
            scaleSelect.appendChild(option);
        }
    }
    else {
        // update
        let scaleValue = 0;
        for (const [key, value] of scalesDict_int) {
            if (!includesQTones && key.includes("quarter_tones"))
                break;
            if (!includesExtraScales && key.startsWith("12tet"))
                continue;
            if (!includesExtraScales && key.includes("xenharmonics"))
                break;
            scaleSelect.options[scaleValue].innerHTML = getScaleString(key);
            scaleValue++;
        }
    }
}
// get scale notes values given tonic and scale
function getScaleNotesValues(noteValue, scaleValues) {
    let scaleNotesValues = new Array();
    scaleValues.forEach(function (interval, index) {
        const newNoteValue = addToNoteValue(noteValue, interval);
        scaleNotesValues.push(newNoteValue);
    });
    return scaleNotesValues;
}
// consider 24-TET as chromatic
function isChromaticScale(scaleValues) {
    const is12TET = arraysEqual(scaleValues, scaleFamiliesDict.get("12tet"));
    const is24TET = arraysEqual(scaleValues, scaleFamiliesDict.get("24tet"));
    return (is12TET || is24TET);
}
// build scale notes array from octaves range
function GetScaleNotesOctaveRangeValues(tonicValue, scaleValues, octave) {
    const scaleNotesValues = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
        for (const scaleValue of scaleValues)
            scaleNotesValues.push(tonicValue + scaleValue + 12 * (octaveCur + 2));
    return scaleNotesValues;
}
////////////////////////////////// XENHARMONICS ///////////////////////////////
function isQuarterToneScale(notesValues) {
    for (const noteValue of notesValues)
        if (isQuarterToneInterval(noteValue))
            return true;
    return false;
}
function isXenharmonicScale(notesValues) {
    for (const noteValue of notesValues)
        if (isXenharmonicInterval(noteValue))
            return true;
    return false;
}
function isOctaveScale(scaleValues) {
    if (scaleValues != null && scaleValues.length > 0 && scaleValues[0] != 0)
        return false;
    return true;
}
// Scales computations functions
function getEDOScaleValues(temperament, intervalToDivide = 2) {
    let scaleValues = [];
    const isOctave = (intervalToDivide == 2);
    for (let i = (isOctave ? 0 : 1); i <= (isOctave ? temperament - 1 : temperament); i++)
        scaleValues.push(12 * Math.log2(intervalToDivide) * i / temperament);
    return scaleValues;
}
function getEDOSubsetScaleValues(temperament, indexes, intervalToDivide = 2) {
    if (indexes == null || indexes.length == 0)
        return [];
    let scaleValues = [];
    const isOctave = (intervalToDivide == 2);
    for (const i of indexes)
        scaleValues.push(12 * Math.log2(intervalToDivide) * i / temperament);
    // handle non-octave scale
    if (!isOctave) {
        scaleValues.shift();
        scaleValues.push(12 * Math.log2(intervalToDivide));
    }
    return scaleValues;
}
function getRatiosScaleValues(ratios) {
    if (ratios == null || ratios.length == 0)
        return [];
    let scaleValues = [];
    for (const ratio of ratios)
        scaleValues.push((ratio == 0) ? 0 : 12 * Math.log2(ratio));
    return scaleValues;
}
function getHarmonicSeriesScaleValues(valueMin, valueMax) {
    let ratios = [];
    const hasOctave = ((valueMax / valueMin) % 2 == 0);
    if (hasOctave)
        ratios.push(0);
    for (let value = valueMin + 1; value <= (hasOctave ? valueMax - 1 : valueMax); value++)
        ratios.push(value / valueMin);
    return getRatiosScaleValues(ratios);
}
function getSubharmonicSeriesScaleValues(valueMin, valueMax) {
    let ratios = [];
    const hasOctave = ((valueMax / valueMin) % 2 == 0);
    if (hasOctave)
        ratios.push(0);
    for (let value = valueMax - 1; value >= (hasOctave ? valueMin + 1 : valueMin); value--)
        ratios.push(valueMax / value);
    return getRatiosScaleValues(ratios);
}
//# sourceMappingURL=scales_functions.js.map
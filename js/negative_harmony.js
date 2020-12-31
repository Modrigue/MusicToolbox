"use strict";
// compute negative note value given tonic
function getNegativeNoteValue(tonicValue, noteValue) {
    return (7 - noteValue + 12 + 2 * tonicValue) % 12;
}
// compute negative scale values given tonic
function getNegativeScaleValues(scaleValues, tonicValue = -1) {
    let negScaleValues = new Array();
    if (scaleValues == null || scaleValues.length == 0)
        return new Array();
    const refTonicValue = (tonicValue >= 0) ? tonicValue : scaleValues[0];
    for (let noteValue of scaleValues) {
        const negNoteValue = getNegativeNoteValue(refTonicValue, noteValue);
        negScaleValues.push(negNoteValue);
    }
    return negScaleValues;
}
//# sourceMappingURL=negative_harmony.js.map
"use strict";
function GetRandomNumber(minNumber, maxNumber /* included */) {
    return Math.floor(minNumber + (maxNumber + 1 - minNumber) * Math.random());
}
function GetRandomGaussianNumber(minNumber, maxNumber /* included */) {
    return Math.floor(minNumber + (maxNumber + 1 - minNumber) * randomGauss());
}
function GetRandomNoteValueInScale(indexMin, indexMax, scaleNotesValues, gaussian = true) {
    if (scaleNotesValues == null || scaleNotesValues.length == 0)
        return -1;
    let noteIndex = gaussian ? GetRandomGaussianNumber(indexMin, indexMax) : GetRandomNumber(indexMin, indexMax);
    noteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteIndex));
    return scaleNotesValues[noteIndex];
}
function getRandomArrayElement(array) {
    if (array == null || array.length == 0)
        return null;
    const nbElements = array.length;
    const index = GetRandomNumber(0, nbElements - 1);
    return array[index];
}
function randomGauss() {
    const nbRandomCalls = 3;
    let res = 0;
    for (let i = 0; i < nbRandomCalls; i++)
        res += Math.random();
    return res / nbRandomCalls;
}
//# sourceMappingURL=random_tools.js.map
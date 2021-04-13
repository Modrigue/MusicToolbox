"use strict";
// format: "?note=X&scale=Y"
function parseParameters() {
    const paramsString = window.location.search;
    if (paramsString == null || paramsString == "")
        return new Map();
    const params = paramsString.slice(1).split('&');
    let paramsDict = new Map();
    for (let param of params) {
        const keyValue = param.split('=');
        const key = keyValue[0];
        const value = keyValue[1];
        paramsDict.set(key, value);
    }
    return paramsDict;
}
// get note parameter
function parseNoteParameter() {
    const paramsDict = parseParameters();
    if (paramsDict == null || !paramsDict.has("note"))
        return -1;
    const note = paramsDict.get("note");
    const noteValue = parseFloat(note) % 12;
    return noteValue;
}
// get parameter by id
function parseParameterById(id) {
    const paramsDict = parseParameters();
    if (paramsDict == null || !paramsDict.has(id))
        return "";
    const value = paramsDict.get(id);
    return value;
}
// get culture parameter
function parseCultureParameter() {
    const paramsDict = parseParameters();
    if (paramsDict == null || !paramsDict.has("lang"))
        return "";
    const value = paramsDict.get("lang");
    return value;
}
// open URL in new tab
function openNewTab(url) {
    window.open(url, "_blank");
}
//# sourceMappingURL=url_parameters.js.map
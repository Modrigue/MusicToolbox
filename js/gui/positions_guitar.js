"use strict";
//////////////////////////////// GUITAR POSITIONS /////////////////////////////
function initGuitarPositionSelector(id, useURLParams = true, nbPos = 7, position = -1) {
    // get selector
    const posSelect = document.getElementById(id);
    const initialized = (posSelect.options != null && posSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;
    // add tunings
    for (let i = -1; i < nbPos; i++) {
        const positionAll = (i == -1);
        let option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = positionAll ? "" : (i + 1).toString();
        if (i == position)
            option.selected = true;
        posSelect.appendChild(option);
    }
    // disable if only 1 option
    posSelect.disabled = (posSelect.options.length <= 1);
}
function updateGuitarPositionGivenNbNotes(id, nbNotes) {
    const posSelect = document.getElementById(id);
    const posFormer = getSelectedGuitarPosition(id);
    // replace selector options and try to select former corresponding guitar tuning
    removeAllChildNodes(posSelect);
    const position = (posFormer <= nbNotes) ? posFormer : -1;
    initGuitarPositionSelector(id, false, nbNotes, position);
}
function getSelectedGuitarPosition(id) {
    const posSelect = document.getElementById(id);
    let posId = posSelect.value;
    return parseInt(posId);
}
//# sourceMappingURL=positions_guitar.js.map
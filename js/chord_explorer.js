"use strict";
function getChordExplorerFondamental() {
    // get fundamental given mode
    let noteFondamental = -1;
    if (getSelectedChordGeneratorMode() == "name") {
        const noteExplorerChordInput = document.getElementById('chord_explorer_fundamental');
        const noteSelected = noteExplorerChordInput.value;
        noteFondamental = parseInt(noteSelected);
    }
    else {
        const selectedNotesValues = getSelectedChordExplorerNotes();
        noteFondamental = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
    }
    return noteFondamental;
}
function getChordExplorerChordValues() {
    let chordValues = [];
    if (getSelectedChordGeneratorMode() == "name") {
        const chordSelector = document.getElementById('chord_explorer_chord');
        const chordSelected = chordSelector.value;
        chordValues = getChordValues(chordSelected);
    }
    else {
        // take 1st selected note as fundamental
        const selectedNotesValues = getSelectedChordExplorerNotes();
        const fondamentalValue = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
        // compute chord relative values given fundamental
        for (let noteValue of selectedNotesValues)
            chordValues.push((noteValue - fondamentalValue) % 12);
    }
    return chordValues;
}
function getChordExplorerBassValue() {
    if (getSelectedChordGeneratorMode() != "name")
        return -1;
    const bassSelector = document.getElementById('chord_explorer_bass');
    const bassSelected = bassSelector.value;
    const bassValue = parseInt(bassSelected);
    return bassValue;
}
function getChordExplorerBassInterval(fondamentalValue) {
    if (getSelectedChordGeneratorMode() != "name")
        return -1;
    const bassValue = getChordExplorerBassValue();
    const bassInterval = (bassValue >= 0) ? (bassValue - fondamentalValue + 12) % 12 : -1;
    return bassInterval;
}
//# sourceMappingURL=chord_explorer.js.map
"use strict";
function updateChordTesterTables() {
    let chordsTablesHTML = "";
    // get selected mode (chord / arpeggios)    
    const delay = 0;
    for (const [nbNotesInChords, chordsDict] of chordsDicts) {
        let chordsTableHTML = /*html*/ `<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())}</div><div id=\"resp-table-body\">`;
        // list all chords with current nb. notes
        for (const [chordId, chordValues] of chordsDict) {
            let chordsRowHTML = "<div class=\"resp-table-row\">";
            for (let noteValue = 0; noteValue < 12; noteValue++) {
                const noteName = getNoteName(noteValue);
                const callbackString = `playChord(${noteValue}, [${chordValues.toString()}], 0, 0)`;
                let classString = "table-body-cell-interactive";
                const divChord = document.createElement('div');
                divChord.classList.add(classString);
                divChord.setAttribute("onClick", `playChord(${noteValue}, [${chordValues.toString()}], 0, ${delay})`);
                //divChord.innerText = (noteValue == 0) ?
                //    getCompactChordNotation(noteName, chordId) : noteName;
                divChord.innerText = getCompactChordNotation(noteName, chordId);
                chordsRowHTML += divChord.outerHTML;
            }
            chordsRowHTML += "</div>";
            chordsTableHTML += chordsRowHTML;
        }
        chordsTableHTML += "</div>";
        chordsTablesHTML += chordsTableHTML;
        chordsTablesHTML += "</div>";
        chordsTablesHTML += "<br/>";
    }
    document.getElementById('chord_tester').innerHTML = chordsTablesHTML;
}
//# sourceMappingURL=chord_tester.js.map
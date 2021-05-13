function updateChordTesterTables()
{
    let chordsTablesHTML = "";

    for (const [nbNotesInChords, chordsDict] of chordsDicts)
    {
        let chordsTableHTML = /*html*/`<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())}</div><div id=\"resp-table-body\">`;  

        // list all chords with current nb. notes
        for (const [chordId, chordValues] of chordsDict)
        {
            let chordsRowHTML = /*html*/`<div class=\"resp-table-row\">`;
            for (let noteValue = 0; noteValue < 12; noteValue++)
            {
                const noteName = getNoteName(noteValue);
                const callbackString = `playChordTest(${noteValue}, [${chordValues.toString()}])`;
                
                let classString = "table-body-cell-interactive";  
                const divChord: HTMLDivElement = document.createElement('div');
                divChord.classList.add(classString);
                divChord.setAttribute("onClick", callbackString);
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

    (<HTMLParagraphElement>document.getElementById('chord_tester')).innerHTML = chordsTablesHTML;
}

function playChordTest(noteValue: number, chordValues: Array<number>): void
{
    // get delay given selected mode (arpeggios chord)
    const delay =
        (<HTMLInputElement>document.getElementById("radioChordTesterArpeggios")).checked ?
        0.25 : 0;
    
    playChord(noteValue, chordValues, 0, delay);
}
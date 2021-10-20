const commonChords: Array<string> = [
    /* 3 notes */ "M", "m", "sus2", "sus4", "dim", "aug",
    /* 4 notes */ "7M", "7", "m7", "add9", "madd9", "add11", "madd11", "m7flat5", "m6M",
    /* 5 notes */ "9M", "9", "m9", "6slash9"
];

function updateChordTesterTables()
{
    let chordsTablesHTML = "";
    const commonChordsOnly = (<HTMLInputElement>document.getElementById("checkboxCommonChords")).checked;

    for (const [nbNotesInChords, chordsDict] of chordsDicts)
    {
        let chordsTableHTML = /*html*/`<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString("chords_N_notes", nbNotesInChords.toString())}</div><div id=\"resp-table-body\">`;  
        let hasChordsWithNbNotes = false;

        // list all chords with current nb. notes
        for (const [chordId, chordValues] of chordsDict)
        {
            let chordsRowHTML = /*html*/`<div class=\"resp-table-row\">`;

            // if show common chords only, skip non-common chords
            if (commonChordsOnly && commonChords.indexOf(chordId) < 0)
                continue;

            hasChordsWithNbNotes = true;
            for (let noteValue = 0; noteValue < 12; noteValue++)
            {
                const noteName = getNoteName(noteValue);
                const callbackString = `playChordTest(${noteValue}, [${chordValues.toString()}])`;
                
                let classString = "table-body-cell-interactive";  
                const divChord: HTMLDivElement = document.createElement('div');
                divChord.classList.add(classString);

                // set notes as tooltip
                divChord.title =
                    getArpeggioNotes(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");

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

        if (hasChordsWithNbNotes)
        {
            chordsTablesHTML += chordsTableHTML;
            chordsTablesHTML += "</div>";
            chordsTablesHTML += "<br/>";
        }
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
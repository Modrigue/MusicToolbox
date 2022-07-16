const commonChords: Array<string> = [
    /* 3 notes */ "M", "m", "sus2", "sus4", "dim", "aug",
    /* 4 notes */ "7M", "7", "m7", "add9", "madd9", "add11", "madd11", "m7flat5", "m6M",
    /* 5 notes */ "9M", "9", "m9", "6slash9"
];

function updateChordTesterTables(tonicValue = -1, scaleId: string = "") : void
{
    // get selected start note
    const noteStartSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_start_note`)).value;
    const noteStartValue: number = parseInt(noteStartSelected);

    // get selected start octave
    const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_start_octave`)).value;
    const octaveStartValue: number = parseInt(octaveStartSelected);
    
    // get scale notes value if specified
    let scaleNotesValues: Array<number> = [];
    if (tonicValue >= 0 && scaleId != null && scaleId != "")
    {
        const scaleValues: Array<number> = getScaleValues(scaleId);
        scaleNotesValues = getScaleNotesValues(tonicValue, scaleValues);
    }

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
            for (let noteValue = noteStartValue; noteValue < 12 + noteStartValue; noteValue++)
            {
                const noteValueInOctave = (noteValue % 12);
                const noteName = getNoteName(noteValueInOctave);
                const callbackString = `playChordTest(${noteValue + 12*(octaveStartValue - 2)}, [${chordValues.toString()}])`;
                
                let classString = "table-body-cell-interactive";  
                const divChord: HTMLDivElement = document.createElement('div');

                // highlight chord if in specified scale
                if (tonicValue >= 0 && scaleNotesValues != null && scaleNotesValues.length > 0)
                {
                    const inScale = areChordNotesInScale(noteValueInOctave, chordValues, scaleNotesValues);
                    if (!inScale)
                        classString = "table-body-cell-grey-interactive";
                    else
                    {
                        // highlight characteristic chords
                        const charIntervals = getScaleCharIntervals(scaleId);
                        const charNotesValues = new Array<number>();
                        for (const index of charIntervals)
                        {
                            const charNoteValue = scaleNotesValues[index];
                            charNotesValues.push(charNoteValue);
                        }                   

                        const isCharacteristic = isChordCharacteristic(noteValueInOctave, chordValues, charNotesValues);
                        if (noteValueInOctave != tonicValue && isCharacteristic)
                            classString = "table-body-cell-char-interactive";

                        if (noteValueInOctave == tonicValue)
                            classString = "table-body-cell-tonic-interactive";
                    }
                    
                    // highlight neapolitan chord
                    if (isChordNeapolitan(tonicValue, noteValueInOctave, chordId))
                        classString = "table-body-cell-neap-interactive";

                    // highlight augmented 6th chords
                    if (isChordAugmented6th(tonicValue, noteValueInOctave, chordId))
                        classString = "table-body-cell-aug6-interactive";
                }

                divChord.classList.add(classString);

                // set notes as tooltip
                divChord.title =
                    getArpeggioNotesText(noteValue, chordValues).replace(/<span>/g, "").replace(/<\/span>/g, "");

                divChord.setAttribute("onClick", callbackString);
                //divChord.innerText = (noteValue == 0) ?
                //    getCompactChordNotation(noteName, chordId) : noteName;
                divChord.innerText = getCompactChordNotation(noteName, chordId);

                // Neapolitan / German augmented 6th chord specific
                if (isChordNeapolitan(tonicValue, noteValue, chordId))
                    divChord.innerText +=  ` / ${noteName}N6`;
                if (isChordGermanAug6th(tonicValue, noteValue, chordId))
                    divChord.innerText +=  ` / ${noteName}Ger+6`;

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
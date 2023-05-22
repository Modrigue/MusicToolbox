function getChordExplorerFondamentalValue(): number
{
    let fondamentalValue = -1;
    if (chordExplorerUpdateMode == "name")
    {
        const noteExplorerChordInput: HTMLInputElement = <HTMLInputElement>document.getElementById('chord_explorer_fundamental');
        const noteSelected: string = noteExplorerChordInput.value;
        fondamentalValue = parseFloat(noteSelected);     
    }
    else
    {
        const selectedNotesValues = getSelectedChordExplorerNotes();
        fondamentalValue = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
    }

    return fondamentalValue;
}

function getChordExplorerChordId(): string
{
    const chordSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById('chord_explorer_chord');
    return chordSelector.value;
}

function getChordExplorerChordValues(): Array<number>
{
    let chordValues: Array<number> = [];
    if (chordExplorerUpdateMode == "name")
    {
        const chordSelectedId = getChordExplorerChordId();
        chordValues = getChordValues(chordSelectedId);        
    }
    else
    {
        // take 1st selected note as fundamental
        const selectedNotesValues = getSelectedChordExplorerNotes();
        const fondamentalValue = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
    
        // compute chord relative values given fundamental
        for (let noteValue of selectedNotesValues)
            chordValues.push((noteValue - fondamentalValue) % 12);
    }

    return chordValues;
}

function getChordExplorerBassValue(): number
{
    const bassSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById('chord_explorer_bass');
    const bassSelected = bassSelector.value;
    const bassValue = parseFloat(bassSelected);

    if (bassValue < 0)
    {
        const selectedNotesValues = getSelectedChordExplorerNotes();
        const bassValue = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
    }

    return bassValue;
}

function getChordExplorerBassInterval(fondamentalValue: number): number
{
    const bassValue = getChordExplorerBassValue();
    const bassInterval = (bassValue >= 0) ? (bassValue - fondamentalValue + 12) % 12 : -1;

    return bassInterval;
}

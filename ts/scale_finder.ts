function findScales(notesValues: Array<number>, sameNbNotes: boolean = false,
    refTonicValue: number = -1): Array<string>
{
    // at least 2 notes needed
    if (notesValues == null || notesValues.length < 2)
        return new Array<string>();

    const nbNotes: number = notesValues.length;
    const noteValue1: number = notesValues[0];

    let scalesIds = [];

    for (const [key, value] of scalesDict_int)
    {
        // parse scale id

        const scaleAttributes = key.split(",");
        if (scaleAttributes.length < 2)
            continue;

        const scaleName = scaleAttributes[0];
        const mode = scaleAttributes[1];
        if (isNaN(mode as any))
            continue;

        const modeValue: number = parseInt(mode);
        const scaleFamily: Array<number> = <Array<number>>scaleFamiliesDict.get(scaleName);
        const scaleValues: Array<number> = getModeNotesValues(scaleFamily, modeValue);
        
        if (sameNbNotes && scaleValues.length != nbNotes)
            continue;

        for (let tonicValue = noteValue1; tonicValue < 12 + noteValue1; tonicValue++)
        {
            // only take ref tonic if specified
            if (refTonicValue >= 0 && (tonicValue % 12) != refTonicValue)
                continue;

            let includesAllNotes = true;

            // compute scale values given tonic
            const scaleNotesValues = getScaleNotesValues(tonicValue, scaleValues);

            // check is scale includes all notes
            for (let i = 0; i < nbNotes; i++)
            {
                const noteValue = notesValues[i];
                if (scaleNotesValues.indexOf(noteValue) < 0)
                {
                    includesAllNotes = false;
                    break;
                }
            }

            // add scale id if all notes found
            if (includesAllNotes)
            {
                const id = (tonicValue % 12).toString() + "|" + key;
                scalesIds.push(id);
            }
        }
    }

    return scalesIds;
}

// build found scales HTML
function getFoundScalesHTML(notesValues: Array<number>, sameNbNotes: boolean = false,
    excludedNote: number = -1, excludedScale: string = "", tonicValue: number = -1): string
{
    let foundScalesHTML = "";
    const foundScales: Array<string> = findScales(notesValues, sameNbNotes, tonicValue);
    if (foundScales == null)
        return "";
   
   let nbScales = 0;
   for (let scaleId of foundScales)
   {
       // get tonic and scale key

        const scaleAttributes: Array<string> = scaleId.split("|");

        const tonicValue: number = parseInt(scaleAttributes[0]);
        const tonic: string = getNoteName(tonicValue);

        const scaleKey = scaleAttributes[1];

        // exclude defined note, scale if defined
        if (excludedNote >= 0 && excludedScale != "")
            if (tonicValue == excludedNote && scaleKey == excludedScale)
                continue;   
        
        const scaleName: string = getScaleString(scaleKey);
        
        const text: string = tonic + " " + scaleName;

        // hightlight scale
        let styleString: string = "";
        if (hightlightScale(scaleKey))
            styleString = "style=\"font-weight:bold;\" ";

        const culture = getSelectedCulture();

        // build URL
        let url: string = window.location.pathname;
        url += "?note=" + tonicValue.toString();
        url += "&scale=" + scaleKey;
        url += "&lang=" + culture;

        // disabled: update same page
        //foundScalesHTML += "<button " + styleString + "onclick=\'selectNoteAndScale(\"" + scaleId + "\")\'>" + text + "</button>"; 
        
        let button: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
        button.innerText = text;
        button.setAttribute("onClick", `openNewTab(\"${url}\")`);

        foundScalesHTML += `${button.outerHTML}\r\n`; 
        nbScales++;
    }

    if (nbScales == 0)
        foundScalesHTML += getString("no_result");

   return foundScalesHTML;
}

// scale explorer mode: find relative scales
function getRelativeScalesHTML(noteValue: number, scaleValues: Array<number>): string
{
    let relScalesHTML = `${getString("relative_scales")} `;
   
    // get selected scale
    const selectedScale: string = (<HTMLSelectElement>document.getElementById("scale")).value;

    // find scales from notes
    const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValues);
    const foundScalesHTML: string =  getFoundScalesHTML(scaleNotesValues, true, noteValue, selectedScale);

    relScalesHTML += foundScalesHTML;
    return relScalesHTML;
}

// scale finder mode: find scales containing notes
function findScalesFromNotesHTML()
{
    let finderScalesHTML = getString("scales") + " ";

    let notesValues = getSelectedNotesChordsFinderValues();
    const tonicValue = getSelectedTonicValue();

    // update found notes label
    const foundNotesLabel: HTMLSpanElement = <HTMLSpanElement>document.getElementById("scale_finder_found_notes_text");
    if (notesValues == null || notesValues.length == 0)
        foundNotesLabel.innerHTML = "&nbsp;";
    else
    {
        let notesValuesSorted: Array<number> = new Array<number>();
        for (let note of notesValues)
        {
            //const noteValue = parseInt(note);
            notesValuesSorted.push(note);
        }
        notesValuesSorted.sort((a, b) => a - b);

        let foundNotesStr = "";
        let index = 0;
        for (let noteValue of notesValuesSorted)
        {
            if (index > 0)
                foundNotesStr += ", ";

            foundNotesStr += getNoteName(noteValue);
            index++;
        }

        foundNotesLabel.innerHTML = foundNotesStr;
    }

    // update found scales
    const foundScalesHTML = getFoundScalesHTML(notesValues, false, -1, "", tonicValue);
    if (foundScalesHTML == "")
        return getString("min_2_notes");

    finderScalesHTML += foundScalesHTML;

    return finderScalesHTML;
}

// get selected notes and chords from finder selectors
function getSelectedNotesChordsFinderValues(): Array<number>
{
    let notesValues: Array<number> = new Array<number>();

    for (let i = 1; i <= 8; i++)
    {
        const tonicSelected: string = (<HTMLSelectElement>document.getElementById(`note_finder${i.toString()}`)).value;
        const tonicValue: number = parseInt(tonicSelected);

        if (tonicValue < 0)
            continue;

        const chordSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`chord_finder${i.toString()}`);
        let notesToAdd: Array<number> = new Array<number>();
        if (!chordSelector.disabled && chordSelector.value != "-1")
        {
            // add chord notes
            const chordValues = getChordValues(chordSelector.value);
            for (const interval of chordValues)
            {
                const noteValue = addToNoteValue(tonicValue, interval);
                notesToAdd.push(noteValue);
            } 
        }
        else
        {
            // add only tonic note
            notesToAdd.push(tonicValue);
        }

        for (const noteValue of notesToAdd)
            if (notesValues.indexOf(noteValue) < 0)
                notesValues.push(noteValue);
    }

    return notesValues;
}

// get selected tonic note
function getSelectedTonicValue(): number
{
    const note = (<HTMLSelectElement>document.getElementById('note_finder_tonic')).value;
    return parseInt(note);
}
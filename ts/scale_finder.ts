function findScales(notesValues: Array<number>, sameNbNotes: boolean = false,
    refTonicValue: number = -1, findQuarterTones: boolean = false): Array<string>
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

        const halfToneInc = findQuarterTones ? 0.5 : 1;
        for (let tonicValue = noteValue1; tonicValue < 12 + noteValue1; tonicValue += halfToneInc)
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
    excludedNote: number = -1, excludedScale: string = "", tonicValue: number = -1,
    findQuarterTones: boolean = false): string
{    
    let foundScalesHTML = "";
    const foundScales: Array<string> = findScales(notesValues, sameNbNotes, tonicValue, findQuarterTones);
    if (foundScales == null)
        return "";
   
   let nbScales = 0;
   for (let tonicScaleId of foundScales)
   {
        // get tonic and scale key
        const scaleAttributes: Array<string> = tonicScaleId.split("|");
        const tonicValue: number = /*parseInt*/parseFloat(scaleAttributes[0]);
        const scaleId = scaleAttributes[1];

        // exclude defined note, scale if defined
        if (excludedNote >= 0 && excludedScale != "")
            if (tonicValue == excludedNote && scaleId == excludedScale)
                continue;
        
        foundScalesHTML += getScaleButtonHTML(tonicValue, scaleId);

        nbScales++;
    }

    if (nbScales == 0)
        foundScalesHTML += getString("no_result");

   return foundScalesHTML;
}

// build negative scale HTML
function getNegativeFoundScaleHTML(notesValues: Array<number>,
    tonicValue: number = -1, findQuarterTones: boolean = false): string
{
    let negScalesHTML = "";
    const negScaleValues = getNegativeScaleValues(notesValues);
    if (negScaleValues == null || negScaleValues.length == 0)
        return "";

    const refTonicValue = (tonicValue >= 0) ? tonicValue : negScaleValues[0];
    const foundScales: Array<string> = findScales(negScaleValues, true, refTonicValue, findQuarterTones);
    if (foundScales == null)
        return "";
   
   let nbScales = 0;
   for (let tonicScaleId of foundScales)
   {
       // get tonic and scale key
        const scaleAttributes: Array<string> = tonicScaleId.split("|");
        const tonicValue: number = /*parseInt*/parseFloat(scaleAttributes[0]);
        const scaleId = scaleAttributes[1];

        negScalesHTML += getScaleButtonHTML(tonicValue, scaleId);
        nbScales++;
    }

    if (nbScales == 0)
        negScalesHTML += getString("no_result");

   return negScalesHTML;
}

// scale explorer mode: find relative scales
function getRelativeScalesHTML(noteValue: number, scaleValues: Array<number>,
    findQuarterTones: boolean = false): string
{
    let relScalesHTML = `${getString("relative_scales")} `;
   
    // get selected scale
    const selectedScale: string = (<HTMLSelectElement>document.getElementById("scale")).value;

    // find scales from notes
    const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValues);
    const foundScalesHTML: string =  getFoundScalesHTML(scaleNotesValues, true, noteValue, selectedScale, -1, findQuarterTones);

    relScalesHTML += foundScalesHTML;
    return relScalesHTML;
}

// scale explorer mode: find negative scale
function getNegativeScaleHTML(noteValue: number, scaleValues: Array<number>,
    findQuarterTones: boolean = false): string
{
    let negScaleHTML = `${getString("negative_scale")} `;
   
    // get selected scale
    const selectedScale: string = (<HTMLSelectElement>document.getElementById("scale")).value;

    // find scale from notes
    const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValues);
    const negFoundScaleHTML: string =  getNegativeFoundScaleHTML(scaleNotesValues, -1, findQuarterTones);

    negScaleHTML += negFoundScaleHTML;
    return negScaleHTML;
}

// scale finder mode: find scales containing notes
function findScalesFromNotesHTML()
{
    let finderScalesHTML = getString("scales") + " ";

    let notesValues = getSelectedNotesChordsFinderValues();
    const tonicValue = getSelectedTonicValue();

    const findQuarterTones =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleFinder")).checked;

    // update found notes label
    const foundNotesLabel: HTMLSpanElement = <HTMLSpanElement>document.getElementById("scale_finder_found_notes_text");
    if (notesValues == null || notesValues.length == 0)
        foundNotesLabel.innerHTML = "&nbsp;";
    else
    {
        let notesValuesSorted: Array<number> = new Array<number>();
        for (let note of notesValues)
        {
            //const noteValue = /*parseInt*/parseFloat(note);
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
    const foundScalesHTML = getFoundScalesHTML(notesValues, false, -1, "", tonicValue, findQuarterTones);
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
        const tonicValue: number = /*parseInt*/parseFloat(tonicSelected);

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

function getScaleButtonHTML(tonicValue: number, scaleId: string): string
{
    let buttonHTML = "";

    const tonic: string = getNoteName(tonicValue);
    
    const scaleName: string = getScaleString(scaleId);
    const scaleValues: Array<number> = getScaleValues(scaleId);
    
    const text: string = tonic + " " + scaleName;

    // hightlight scale
    let styleString: string = "";
    if (hightlightScale(scaleId))
        styleString = "style=\"font-weight:bold;\" ";

    const culture = getSelectedCulture();

    // build URL
    let url: string = window.location.pathname;
    url += "?note=" + tonicValue.toString();
    url += "&scale=" + scaleId;
    url += "&lang=" + culture;
    if (pageSelected == "page_scale_explorer")
    {
        url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
        url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
    }

    // build button
    let button: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
    button.innerText = text;
    button.setAttribute("onClick", `openNewTab(\"${url}\")`);
    button.classList.add("border-left-radius");
    buttonHTML += `${button.outerHTML}`;

    // build aux. play button
    let buttonPlay = document.createElement('button');
    buttonPlay.innerText = "♪";
    buttonPlay.classList.add("border-right-radius");
    buttonPlay.setAttribute("onClick", `playScale(${tonicValue}, [${scaleValues.toString()}], 0, 0)`);
    buttonHTML += `${buttonPlay.outerHTML}\r\n`;

    return buttonHTML;
}

// get selected tonic note
function getSelectedTonicValue(): number
{
    const note = (<HTMLSelectElement>document.getElementById('note_finder_tonic')).value;
    return /*parseInt*/parseFloat(note);
}
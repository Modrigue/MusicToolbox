function findScales(notesValues, sameNbNotes = false)
{
    // at least 2 notes needed
    if (notesValues == null || notesValues.length < 2)
        return null;

    const nbNotes = notesValues.length;
    const noteValue1 = notesValues[0];

    let scalesIds = [];

    for (const key in scalesDict_int)
    {
        // parse scale id

        const scaleAttributes = key.split(",");
        if (scaleAttributes.length < 2)
            continue;

        const scaleName = scaleAttributes[0];
        const mode = scaleAttributes[1];
        if (isNaN(mode))
            continue;

        const modeValue = parseInt(mode);
        const scaleFamily = scaleFamiliesDict[scaleName];
        const scaleValues = getModeNotesValues(scaleFamily, modeValue);
        
        if (sameNbNotes && scaleValues.length != nbNotes)
            continue;

        for (let tonicValue = noteValue1; tonicValue < 12 + noteValue1; tonicValue++)
        {
            let includesAllNotes = true;

            // compute scale values given tonic
            const scaleNotesValues = getScaleNotesValues(tonicValue, scaleValues);

            // check is scale includes all notes
            for (let i = 0; i < nbNotes; i++)
            {
                const noteValue = notesValues[i];
                if (!scaleNotesValues.includes(noteValue))
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
function getFoundScalesHTML(notesValues, sameNbNotes = false, excludedNote = -1, excludedScale = "")
{
    let foundScalesHTML = "";
    const foundScales = findScales(notesValues, sameNbNotes);
    if (foundScales == null)
        return getString("min_2_notes");
   
   let nbScales = 0;
   for (let scaleId of foundScales)
   {
       // get tonic and scale key

        const scaleAttributes = scaleId.split("|");

        const tonicValue = parseInt(scaleAttributes[0]);
        const tonic = getNoteName(tonicValue);

        const scaleKey = scaleAttributes[1];

        // exclude defined note, scale if defined
        if (excludedNote >= 0 && excludedScale != "")
            if (tonicValue == excludedNote && scaleKey == excludedScale)
                continue;   
        
        const scaleName = getScaleString(scaleKey);
        
        const text = tonic + " " + scaleName;

        // hightlight scale
        let styleString = "";
        if (hightlightScale(scaleKey))
            styleString = "style=\"font-weight:bold;\" ";

        const culture = getSelectedCulture();

        // build URL
        let url = window.location.pathname;
        url = url.concat("?note=" + tonicValue.toString());
        url = url.concat("&scale=" + scaleKey);
        url = url.concat("&lang=" + culture);

        // disabled: update same page
        //foundScalesHTML = foundScalesHTML.concat("<button " + styleString + "onclick=\'selectNoteAndScale(\"" + scaleId + "\")\'>" + text + "</button>"); 
        
        foundScalesHTML = foundScalesHTML.concat("<button " + styleString + "onclick=\'openNewTab(\"" + url + "\")\' >" + text + "</button>"); 
        foundScalesHTML = foundScalesHTML.concat("&nbsp;");

        nbScales++;
    }

    if (nbScales == 0)
        foundScalesHTML = foundScalesHTML.concat(getString("no_result"));

   return foundScalesHTML;
}

// scale explorer mode: find relative scales
function getRelativeScalesHTML(noteValue, scaleValues)
{
    let relScalesHTML = getString("relative_scales") + " ";
   
    // get selected scale
    const selectedScale = document.getElementById("scale").value;

    // find scales from notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    const foundScalesHTML =  getFoundScalesHTML(scaleNotesValues, true, noteValue, selectedScale);

    relScalesHTML = relScalesHTML.concat(foundScalesHTML);
    return relScalesHTML;
}

// scale finder mode: find scales containing notes
function findScalesFromNotesHTML()
{
    let finderScalesHTML = getString("scales") + " ";

    let notesValues = getSelectedNotesFinderValues();

    const foundScalesHTML =  getFoundScalesHTML(notesValues);
    finderScalesHTML = finderScalesHTML.concat(foundScalesHTML);

    return finderScalesHTML;
}

// get selected notes from finder selectors
function getSelectedNotesFinderValues()
{
    let notesValues = [];

    for (let i = 1; i <= 8; i++)
    {
        const noteSelected = document.getElementById('note_finder' + i.toString()).value;
        const noteValue = parseInt(noteSelected);

        if (noteValue < 0)
            continue;

        if (!notesValues.includes(noteValue))
            notesValues.push(noteValue);
    }

    return notesValues;
}
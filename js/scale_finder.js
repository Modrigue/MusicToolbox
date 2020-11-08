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
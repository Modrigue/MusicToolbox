// find chords from notes
function findChords(notesValues, onlyFirstNoteAsFundamental = false)
{
    if (notesValues == null || notesValues.length < 2  || notesValues.length > 5)
        return [];

    let chordsArray = [];
    const nbNotesInChord = notesValues.length;
    let chordsDict = chords2Dict;
    if (nbNotesInChord == 3)
        chordsDict = chords3Dict;
    if (nbNotesInChord == 4)
        chordsDict = chords4Dict;
    else if (nbNotesInChord == 5)
        chordsDict = chords5Dict;

    // switch fundamental and compute intervals
    for (let i = 0; i < nbNotesInChord; i++)
    {
        if (onlyFirstNoteAsFundamental && i > 0)
            break;

        let fundamental = notesValues[i];
        let intervalsValues = [];
        for (let value of notesValues)
        {
            const interval = (value - fundamental + 10*12) % 12;
            intervalsValues.push(interval);
        }
        
        // sort intervals
        intervalsValues.sort();

        // search corresponding chord in dictionary
        const chordId = getKeyFromValue(chordsDict, intervalsValues);
        if (chordId !=  null && chordId !=  "" && chordId !=  "?")
            chordsArray.push([fundamental, chordId]);
    }

    return chordsArray;
}
function generateCounterpointTrack11(tonicValue: number, scaleValues: Array<number>, nbBars: number, octave: number): Track
{
    let track = new Track();
    const nbNotesInScale = scaleValues.length;

    // build allowed scale notes array
    let scaleNotesValues: Array<number> = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
    {
        for (const scaleValue of scaleValues)
        {
            scaleNotesValues.push(tonicValue + scaleValue + 12*(octaveCur + 2));  
        }
    }  

    // 1st note = tonic
    track.AddNote(new Note(tonicValue, octave, 4, 0));

    // generate random notes in scale
    let curNoteIndex = scaleNotesValues.indexOf(tonicValue + 12*(octave + 2));
    for (let i = 1; i < nbBars - 1; i++)
    {
        // get random step
        let indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);
        //while (indexIntervalNext == 0)
        //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);

        let nextNoteIndex = curNoteIndex + indexIntervalNext;
        nextNoteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, nextNoteIndex));
        
        const noteValueNext = scaleNotesValues[nextNoteIndex];
        //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);

        // add note
        const valueNext = noteValueNext % 12;
        const octaveNext = Math.floor(noteValueNext / 12) - 2;
        track.AddNote(new Note(valueNext, octaveNext, 4, 4*i));

        curNoteIndex = nextNoteIndex;
    }

    // TODO: counterpoint rules

    // TODO: smoothen resolution to tonic at end
    // last note = tonic
    track.AddNote(new Note(tonicValue, octave, 4, 4*(nbBars - 1)));
    //console.log(track.LogText());
    return track;
}

function getRandomNumber(minNumber: number, maxNumber: number /* included */): number
{
    return Math.floor(minNumber + (maxNumber + 1 - minNumber)*Math.random());
}
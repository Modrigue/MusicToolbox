
function GenerateSequence(tonic: number, scaleValues: Array<number>, nbBars: number, nbNotesPerBar: number,
    octave: number, qNote: number, channelId: number): (MidiTrack | null)
{ 
    //const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    //
    // generate candidate track and check its coherency
    const nbTries = 1000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {
        track = generateSequenceCandidate(tonic, scaleValues, nbBars, nbNotesPerBar, octave, qNote, channelId);
    //
    //    if (hasTrackCF)
    //        success = (hasMelodicFluency(track, tonic, octave, scaleValues) && checkCounterpoint11(<MidiTrack>trackCF, track));
    //    else
    //        success = hasMelodicFluency(track, tonic, octave, scaleValues);

        success = true;
        if (success)
            return track;
    }

    return null;
}

function generateSequenceCandidate(tonic: number, scaleValues: Array<number>, nbBars: number,
    nbNotesPerBar: number, octave: number, qNote: number, channelId: number): MidiTrack
{    
    let track = new MidiTrack(channelId);
    const nbNotesInScale = scaleValues.length;

    const intervalRange = Math.round(0.8*nbNotesInScale);

    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);

    // allow tonic as 1st note
    let startIntervals: Array<number> = [0]; //scaleValues;

    const startInterval = <number>getRandomArrayElement(startIntervals);
    AddNoteEvent(track, tonic + startInterval, octave, 0, 4*qNote/nbNotesPerBar);

    // generate random notes in scale
    const nbTries = 10000;
    let noteCurValue = GetNoteValueFromNoteOctave(tonic, octave);
    let noteCurIndex = scaleNotesValues.indexOf(noteCurValue);
    for (let barIndex = 1; barIndex < nbNotesPerBar*nbBars; barIndex++)
    {
        let noteNextValue = -1;
        let noteNextIndex = -1;
        for (let i = 0; i < nbTries; i++)
        //while (!acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
        {
            // get random step
            let indexIntervalNext = GetRandomGaussianNumber(-intervalRange + 1, intervalRange - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);

            noteNextIndex = noteCurIndex + indexIntervalNext;
            noteNextIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteNextIndex));
            
            noteNextValue = scaleNotesValues[noteNextIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);

            //if (acceptNoteInCounterpoint11(noteNextValue, tonic, barIndex, nbBars, track, trackCF))
            //    break;
        }

        // ok, add note
        AddNoteValueEvent(track, noteNextValue, 0, 4*qNote/nbNotesPerBar);
        noteCurIndex = noteNextIndex;
    }

    return track;
}
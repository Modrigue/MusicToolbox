function GenerateSequenceTrack(tonic: number, scaleValues: Array<number>, nbBars: number, nbNotesPerBar: number,
    octave: number, freq: number, qNote: number, channelId: number,
    timeSignNum: number = 4, timeSignDen: number = 4): (MidiTrack | null)
{ 
    //const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    //
    // generate candidate track and check its coherency
    const nbTries = 1000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {        
        track = generateSequenceTrackCandidate(tonic, scaleValues, nbBars, nbNotesPerBar,
            octave, freq, qNote, channelId, timeSignNum, timeSignDen);
    
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

function generateSequenceTrackCandidate(tonic: number, scaleValues: Array<number>, nbBars: number,
    nbNotesPerBar: number, octave: number, freq: number, qNote: number, channelId: number,
    timeSignNum: number = 4, timeSignDen: number = 4): MidiTrack
{    
    let track = new MidiTrack(channelId);
    
    const nbNotesInScale = scaleValues.length;
    const intervalRange = Math.round(0.8*nbNotesInScale);

    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);

    // allow tonic as 1st note
    let startIntervals: Array<number> = [0]; //scaleValues;

    const startInterval = <number>getRandomArrayElement(startIntervals);
    let startPosition = 0;
    const duration = timeSignNum*qNote*4/timeSignDen/nbNotesPerBar;

    // 1st note appears?
    if (noteAppears(freq))
        AddNoteMonoEvent(track, tonic + startInterval, octave, 0, duration);
    else
        startPosition += duration;

    // generate random notes in scale
    const nbTries = 10000;
    let noteCurValue = GetNoteValueFromNoteOctave(tonic, octave);
    let noteCurIndex = scaleNotesValues.indexOf(noteCurValue);
    for (let barIndex = 1; barIndex < nbNotesPerBar*nbBars; barIndex++)
    {
        // following note appears?
        if (!noteAppears(freq))
        {
            startPosition += duration;
            continue;
        }
        
        // note appears at next position
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
        AddNoteMonoValueEvent(track, noteNextValue, startPosition, duration);
        startPosition = 0;
        noteCurIndex = noteNextIndex;
    }

    return track;
}

function noteAppears(freq: number) : boolean
{
    let score = 100*Math.random();
    return (score <= freq);
}
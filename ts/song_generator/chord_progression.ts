function GenerateChordsProgTrack(tonic: number, scaleValues: Array<number>, nbBars: number, nbNotesPerBar: number,
    octave: number, freq: number, qNote: number, channelId: number): (MidiTrack | null)
{
    // generate candidate track and check its coherency
    const nbTries = 1000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {        
        track = generateChordsProgTrackCandidate(tonic, scaleValues, nbBars, nbNotesPerBar, octave, freq, qNote, channelId);
        success = hasChordsProgTrackCharNotes(track, tonic, scaleValues);        
        if (success)
            return track;
    }

    return null;
}

function generateChordsProgTrackCandidate(tonic: number, scaleValues: Array<number>, nbBars: number,
    nbNotesPerBar: number, octave: number, freq: number, qNote: number, channelId: number): MidiTrack
{    
    let track = new MidiTrack(channelId);
    
    const nbNotesInScale = scaleValues.length;
    const intervalRange = Math.round(0.8*nbNotesInScale);

    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);

    //let startIntervals: Array<number> = [0]; //scaleValues;
    //const startInterval = 0; //<number>getRandomArrayElement(startIntervals);
    let startPosition = 0;
    const barDuration = 4*qNote;

    // 1st chord: tonic scale chord / arpeggio
    //const tonicValue1st = scaleNotesValues[0] + startInterval;
    const chordValues1st = [ scaleNotesValues[0], scaleNotesValues[2], scaleNotesValues[4] ];
    if (nbNotesPerBar == 1)
        AddChordValuesEvent(track, chordValues1st, 0, 0, barDuration);
    else       
        addChordAsArpeggios(track, chordValues1st, startPosition, barDuration/nbNotesPerBar, nbNotesPerBar);

    // generate random chords in scale
    const nbTries = 10000;
    for (let barIndex = 1; barIndex < nbBars; barIndex++)
    {
        //// following note appears?
        //if (!noteAppears(freq))
        //{
        //    startPosition += duration;
        //    continue;
        //}
        
        let chordValuesNext: Array<number> = [];
        for (let i = 0; i < nbTries; i++)
        {
            chordValuesNext = [];
            const nbNotesInChord = 3; //GetRandomNumber(3, 4);
            for (let index = 0; index < nbNotesInChord; index++)
            {
                // get random step
                const indexIntervalNext = GetRandomNumber(-intervalRange + 1, intervalRange - 1);   
                let noteValue = scaleNotesValues[(indexIntervalNext + nbNotesInScale) % nbNotesInScale];
                if (indexIntervalNext < 0)
                    noteValue -= 12;

                chordValuesNext.push(noteValue);
            }

            if (acceptChordInChordsProg(chordValuesNext, tonic, barIndex, nbBars, track, intervalRange))
                break;
        }

        // ok, add chord / arpeggios
        if (nbNotesPerBar == 1)
            AddChordValuesEvent(track, chordValuesNext, 0, startPosition, barDuration);
        else
            addChordAsArpeggios(track, chordValuesNext, startPosition, barDuration/nbNotesPerBar, nbNotesPerBar);

        startPosition = 0;
    }

    
    return track;
}

function acceptChordInChordsProg(chordsValues: Array<number>, tonicValue: number, barIndex: number, nbBars: number,
    track: MidiTrack, intervalRange: number): boolean
{
    if (containsDuplicates(chordsValues))
        return false;
    
    return true;
}

function addChordAsArpeggios(track: MidiTrack, chordValues: Array<number>, startPosition: number,
    duration : number, nbNotesPerBar: number)
{
    chordValues = chordValues.sort((a, b) => a - b);            
    const nbNotesInChord = chordValues.length;
    //console.log(chordValues);
    
    for (let indexNote = 0; indexNote < nbNotesPerBar; indexNote++)
    {
        const noteValue = chordValues[indexNote % nbNotesInChord];
        AddNoteMonoValueEvent(track, noteValue, startPosition, duration);            
    }
}


// bass

function GenerateChordsProgBassTrack(tonic: number, scaleValues: Array<number>, nbBars: number, nbNotesPerBar: number,
    octave: number, freq: number, qNote: number, channelId: number): (MidiTrack | null)
{
    // generate candidate track and check its coherency
    const nbTries = 1000;
    let track = new MidiTrack(channelId);
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {        
        track = generateChordsProgBassTrackCandidate(tonic, scaleValues, nbBars, nbNotesPerBar, octave, freq, qNote, channelId);
        success = true;
        if (success)
            return track;
    }

    return null;
}

function generateChordsProgBassTrackCandidate(tonic: number, scaleValues: Array<number>, nbBars: number,
    nbNotesPerBar: number, octave: number, freq: number, qNote: number, channelId: number): MidiTrack
{    
    let track = new MidiTrack(channelId);
    
    const nbNotesInScale = scaleValues.length;
    const intervalRange = Math.round(0.8*nbNotesInScale);

    // build allowed scale notes array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave);

    // allow tonic as 1st note
    let startIntervals: Array<number> = [0]; //scaleValues;

    const startInterval = 0; //<number>getRandomArrayElement(startIntervals);
    let startPosition = 0;
    const duration = 4*qNote/nbNotesPerBar;

    // 1st note appears?
    //if (noteAppears(freq))
        AddNoteMonoEvent(track, tonic + startInterval, octave, 0, 4*qNote/nbNotesPerBar);
    //else
    //    startPosition += duration;

    // generate random notes in scale
    const nbTries = 10000;
    let noteCurValue = GetNoteValueFromNoteOctave(tonic, octave);
    let noteCurIndex = scaleNotesValues.indexOf(noteCurValue);
    for (let barIndex = 1; barIndex < nbNotesPerBar*nbBars; barIndex++)
    {
        //// following note appears?
        //if (!noteAppears(freq))
        //{
        //    startPosition += duration;
        //    continue;
        //}
        
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

            if (acceptNoteInChordsProgBass(noteNextValue, tonic, barIndex, nbBars, track, intervalRange))
                break;
        }

        // ok, add note doubled at inferior octave
        AddNoteMonoValueEvent(track, noteNextValue, startPosition, duration);
        startPosition = 0;
        noteCurIndex = noteNextIndex;
    }

    // add note doubled at inferior octave
    let trackDoubled = new MidiTrack(channelId);
    let cents = 0; /*, pitchBend = 0;*/
    for (const event of track.Events)
    {
        switch (event.Type)
        {
            case MidiTrackEventType.NOTE_ON:
            case MidiTrackEventType.NOTE_OFF:
            {
                const data = event.Data;
                const noteValueInt = data[1];
                const velocity = data[2];
                //console.log(noteValueInt, cents, velocity);
                
                const notesValues = [noteValueInt, noteValueInt - 12];
                if (event.Type == MidiTrackEventType.NOTE_ON)
                    AddChordValuesOnEvent(trackDoubled, notesValues, cents, 0);
                else if (event.Type == MidiTrackEventType.NOTE_OFF)
                    AddChordValuesOffEvent(trackDoubled, notesValues, cents, duration);
                
                break;
            }

            case MidiTrackEventType.PICTH_BEND:
            {
                cents = event.AuxValue;
                break;
            }
        
            default:
                break;
        }
    }
    return trackDoubled;
}

function acceptNoteInChordsProgBass(noteValue: number, tonicValue: number, barIndex: number, nbBars: number,
    track: MidiTrack, intervalRange: number): boolean
{
    if (noteValue < 0)
        return false;

    // check if final note is not too far away from first note
    if (barIndex == nbBars - 1)
    {
        const noteFirst = track.GetNoteValue(0);
        if (Math.abs(noteValue - noteFirst) > intervalRange)
            return false;
    }

    return true;
}

function hasChordsProgTrackCharNotes(track : MidiTrack, tonic: number, scaleValues: Array<number>) : boolean
{
    // get scale characteristic intervals
    const scaleId = (<HTMLSelectElement>document.getElementById("song_generator_scale")).value;
    if (scaleId == null)
        return true;

    // if no scale characteristic intervals, return true
    const charIntervals = getScaleCharIntervals(scaleId);
    if (charIntervals == null || charIntervals.length == 0)
        return true;

    let charNotesValues = new Array<number>();
    for (const index of charIntervals)
    {
        const charNoteValue = (tonic + scaleValues[index]) % 12;
        charNotesValues.push(charNoteValue);
    }

    // check if all scale characteristic intervals are present
    let pitchBend = 0;
    for (const event of track.Events)
    {
        switch(event.Type)
        {
            case MidiTrackEventType.NOTE_ON:
            {
                // check if played interval is characteristic
                const data = event.Data;
                const noteValueInt = data[1];
                const noteValue = noteValueInt + pitchBend;                
                const index = charNotesValues.indexOf(noteValue % 12);
                if (index >= 0)
                    charNotesValues.splice(index, 1);

                break;
            }

            case MidiTrackEventType.PICTH_BEND:
            {
                const cents = event.AuxValue;
                pitchBend = cents / 100; // 1/8/2 = 1/2 tone = 100 cents
                break;
            }
        }
    }
    
    return (charNotesValues == null || charNotesValues.length == 0);
}
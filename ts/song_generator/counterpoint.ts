const perfectConsonances   = [0, 7];                 // octave and 5th
const imperfectConsonances = [3, 4, 8, 9];           // 3rds and 6ths
const dissonances          = [1, 2, 5, 6, 10, 11];   // 2nds, 4ths and 7ths


function generateCounterpointTrack12(tonicValue: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, rhythmFactorArray: Array<number> = [1/2], trackExisting: (MidiTrack | null) = null): MidiTrack
{
    let track = new MidiTrack(channelId);
    const hasExistingTrack = (trackExisting != null && trackExisting.Events != null && trackExisting.Events.length > 0);
    
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;

    // build 1:1 counterpoint
    const track11 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, octave, qNote, channelId, trackExisting);
    const track11NbNotes = track11.GetNbNotes();

    // build allowed scale notes array
    let scaleNotesValues: Array<number> = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
        for (const scaleValue of scaleValues)
            scaleNotesValues.push(tonicValue + scaleValue + 12*(octaveCur + 2));  

    let index = 0;
    for (const event of track11.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
            
        const noteValue = track11.GetNoteValue(index);
        const note = noteValue % 12;
        const octave = Math.floor(noteValue / 12) - 2;
        const duration = event.DeltaTime;

        const rhythmsFactor = rhythmFactorArray[index % nbRhythms];

        // 1st note: start with delay to enhance separation effect
        if (index == 0  && hasExistingTrack)
        {
            addNoteEvent(track, note, octave, rhythmsFactor*duration, (1 - rhythmsFactor)*duration);

            // TODO: at last bar, replace 1st note by consonnant interval and set tonic as 2nd note
        }
        else
        {
            addNoteEvent(track, note, octave, 0, rhythmsFactor*duration);
            
            if (index < track11NbNotes - 1)
            {
                // create new note

                const noteCurIndex = scaleNotesValues.indexOf(note + 12*(octave + 2));

                const noteValueNext = track11.GetNoteValue(index + 1);
                const noteNext = noteValueNext % 12;
                const octaveNext = Math.floor(noteValueNext / 12) - 2;
                let noteNextIndex = scaleNotesValues.indexOf(noteNext + 12*(octaveNext + 2));

                let noteNewIndex = getRandomGaussianNumber(noteCurIndex - 2, noteNextIndex + 2);
                noteNewIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteNewIndex));
                let noteValueNew = scaleNotesValues[noteNewIndex];

                // at penultimate bar, prevent tonic as 2nd note            
                if (index == track11NbNotes - 2)
                {
                    const nbTries = 10000;
                    for (let i = 0; i < nbTries; i++)
                        if (noteValueNew % 12 != tonicValue)
                            break;
                        else
                        {
                            noteNewIndex = getRandomNumber(noteCurIndex - 2, noteNextIndex + 2);
                            noteNewIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, noteNewIndex));
                            noteValueNew = scaleNotesValues[noteNewIndex];
                        }
                }
                //console.log(noteCurIndex, noteNewIndex, noteNextIndex);

                const noteNew = noteValueNew % 12;
                const octaveNew = Math.floor(noteValueNew / 12) - 2;
                
                // TODO: apply counterpoint rules to accept new note
                
                addNoteEvent(track, noteNew, octaveNew, 0, (1 - rhythmsFactor)*duration);
            }
        }

        index++;
    }


    return track;
} 


function generateCounterpointTrack11(tonicValue: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, trackExisting: (MidiTrack | null) = null): MidiTrack
{
    let track = new MidiTrack(channelId);
    const nbNotesInScale = scaleValues.length;
    //const hasExistingTrack = (trackExisting != null && trackExisting.Events != null && trackExisting.Events.length > 0);

    // build allowed scale notes array
    let scaleNotesValues: Array<number> = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
        for (const scaleValue of scaleValues)
            scaleNotesValues.push(tonicValue + scaleValue + 12*(octaveCur + 2));  
 

    // 1st note = tonic
    addNoteEvent(track, tonicValue, octave, 0, 4*qNote);

    // generate random notes in scale
    const nbTries = 10000;
    let curNoteIndex = scaleNotesValues.indexOf(tonicValue + 12*(octave + 2));
    for (let barIndex = 1; barIndex < nbBars - 1; barIndex++)
    {
        let noteValueNext = -1;
        let nextNoteIndex = -1;
        for (let i = 0; i < nbTries; i++)
        //while (!acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
        {
            // get random step
            let indexIntervalNext = getRandomGaussianNumber(-nbNotesInScale + 1, nbNotesInScale - 1);
            //while (indexIntervalNext == 0)
            //    indexIntervalNext = getRandomNumber(-nbNotesInScale, nbNotesInScale);

            nextNoteIndex = curNoteIndex + indexIntervalNext;
            nextNoteIndex = Math.min(scaleNotesValues.length - 1, Math.max(0, nextNoteIndex));
            
            noteValueNext = scaleNotesValues[nextNoteIndex];
            //console.log(curNoteIndex, indexIntervalNext, nextNoteIndex, noteValueNext);

            if (acceptNote(noteValueNext, tonicValue, barIndex, nbBars, track, trackExisting))
                break;
        }

        // ok, add note
        const valueNext = noteValueNext % 12;
        const octaveNext = Math.floor(noteValueNext / 12) - 2;
        addNoteEvent(track, valueNext, octaveNext, 0, 4*qNote);

        curNoteIndex = nextNoteIndex;
    }

    // last note: fetch nearest tonic
    let distMin = -1;
    let octaveEnd = -1;
    const lastNoteValue = track.GetNoteValue(track.GetNbNotes() - 1);
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
    {
        const dist = Math.abs(lastNoteValue - (tonicValue + 12*(octaveCur + 2)));
        if (distMin < 0 || dist < distMin)
        {
            distMin = dist;
            octaveEnd = octaveCur;
        }
    }

    addNoteEvent(track, tonicValue, octaveEnd, 0, 4*qNote);
    //console.log(track.LogText());
    return track;
}

function acceptNote(noteValue: number, tonicValue: number, barIndex: number, nbBars: number,
    trackCurrent: MidiTrack, trackExisting: (MidiTrack | null) = null): boolean
{
    if (noteValue < 0)
        return false;
    
    const hasExistingTrack = (trackExisting != null && trackExisting.Events != null && trackExisting.Events.length > 0);

    // do not set tonic at starting or ending bars (except final bar)
    const range = 2;
    if (noteValue % 12 == tonicValue % 12)
    if (barIndex <= range /* start */ || nbBars - barIndex - 1 <= range /* end */)
        return false;

    //// do not allow 2 consecutive unissons
    //if (trackCurrent.GetNbNotes() > 2)
    //{
    //    const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
    //    const lastNoteValue2 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 2);
    //
    //    if (lastNoteValue1 == lastNoteValue2 && noteValue == lastNoteValue1)
    //        return false;
    //}

    // do not allow unisson
    if (trackCurrent.Events.length > 1)
    {
        const lastNoteValue1 = trackCurrent.GetNoteValue(trackCurrent.GetNbNotes() - 1);
        if (noteValue == lastNoteValue1)
            return false;
    }

    // apply counterpoint rules
    if (hasExistingTrack)
    {
        // compute current candidate interval with existing track note
        const existingNoteValue1 = (<MidiTrack>trackExisting).GetNoteValue(barIndex);
        const curInterval1 = getIntervalBetweenNotes(noteValue, existingNoteValue1);

        // avoid dissonant intervals
        if (dissonances.indexOf(curInterval1) >= 0)
            return false;
        if (isMicrotonalInterval(curInterval1))
            return false;

        const existingNoteValue2 = (<MidiTrack>trackExisting).GetNoteValue(barIndex - 1);
        const curNoteValue2 = trackCurrent.GetNoteValue(barIndex - 1);
        const curInterval2 = getIntervalBetweenNotes(curNoteValue2, existingNoteValue2);

        // avoid parallel octaves and 5ths

        if (curInterval1 == 7 && curInterval2 == 7)
            return false;

        if (curInterval1 == 0 && curInterval2 == 0)
            return false;

        if (curInterval1 == 0 && barIndex == nbBars - 2)
            return false;

        // avoid direct octaves and 5ths
        const curMotion = getMotionBetweenNotes(curNoteValue2, noteValue);
        const existingMotion = getMotionBetweenNotes(existingNoteValue2, existingNoteValue1);
        const hasSameMotion = (curMotion == existingMotion);
        if (hasSameMotion && (curInterval1 == 0 || curInterval1 == 7))
            return false;

        // no 3 consecutive 3rds and 6ths
        if (barIndex >= 2)
        {
            const existingNoteValue3 = (<MidiTrack>trackExisting).GetNoteValue(barIndex - 2);
            const curNoteValue3 = trackCurrent.GetNoteValue(barIndex - 2);
            const curInterval3 = getIntervalBetweenNotes(curNoteValue3, existingNoteValue3);

            if (imperfectConsonances.indexOf(curInterval3) >= 0)
            if (curInterval3 == curInterval2 && curInterval2 == curInterval1)
                return false;
        }
    }

    return true;
}

function addNoteEvent(track : MidiTrack, note: number, octave: number, start: number, duration: number)
{
    const vel = 102;
    let noteValue = note + 12*(octave + 2);
    let noteValueInt = ToNoteValueInt(noteValue);

    // handle pitch bend if specified
    let cents = ToNoteValueCents(noteValue);
    const hasPitchBend = (cents != 0);
    if (hasPitchBend)
        track.PitchBend(cents, 0);

    track.NoteOn(noteValueInt, start, vel);
    track.NoteOff(noteValueInt, duration);

    if (hasPitchBend)
        track.PitchBend(0, 0);
}

function getIntervalBetweenNotes(noteValue1: number, noteValue2: number): number
{
    const note1 = (noteValue1 % 12);
    const note2 = (noteValue2 % 12);
    return (note1 - note2 + 12) % 12;
}

function getMotionBetweenNotes(noteValuePrev: number, noteValueNext: number): number
{
    if (noteValueNext > noteValuePrev)
        return 1;
    else if (noteValueNext < noteValuePrev)
        return -1;
    
    return 0;
}
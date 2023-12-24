function GenerateCounterpointTrack31(tonic: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, rhythmFactorArray: Array<Array<number>> = [[1/3, 1/3, 1/3]], trackCF: (MidiTrack | null) = null): (MidiTrack | null)
{ 
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    
    // generate candidate track and check its melodic fluency and coherency
    const nbTries = 1000;
    let track = null;
    let success = false;
    for (let i = 0; i < nbTries; i++)
    {
        track = generateCounterpointTrack31Candidate(tonic, scaleValues, nbBars, octave, qNote, channelId, rhythmFactorArray, trackCF);
        if (track == null)
            return null;

        if (hasTrackCF)
            success = (/*hasMelodicFluency(track, tonic, octave, scaleValues) &&*/ checkCounterpoint21(<MidiTrack>trackCF, track));
        else
            success = true; /*hasMelodicFluency(track, tonic, octave, scaleValues);*/

        if (success)
            return track;
    }

    return null;
}

function generateCounterpointTrack31Candidate(tonic: number, scaleValues: Array<number>, nbBars: number, octave: number, qNote: number, 
    channelId: number, rhythmFactorArray: Array<Array<number>> = [[1/2, 1/2]], trackCF: (MidiTrack | null) = null): (MidiTrack | null)
{
    let track31 = new MidiTrack(channelId);
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    
    // rhythm array to circle
    const nbRhythms = rhythmFactorArray.length;

    // build 1:1 counterpoint
    const track11 = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octave, qNote, channelId, trackCF);
    if (track11 == null)
        return null;

    const track11NbNotes = track11.GetNbNotes();

    // build scale notes values array
    const scaleNotesValues = GetScaleNotesOctaveRangeValues(tonic, scaleValues, octave); 

    let index1 = 0;
    for (const event of track11.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
            
        const note1Value = track11.GetNoteValue(index1);
        const note1 = GetNoteFromValue(note1Value);
        const octave1 = GetOctaveFromValue(note1Value);
        const note1Index = scaleNotesValues.indexOf(note1Value);
        const duration = event.DeltaTime;

        const note1ValueNext = track11.GetNoteValue(index1 + 1);
        let note1NextIndex = scaleNotesValues.indexOf(note1ValueNext);

        const rhythmsArray = rhythmFactorArray[index1 % nbRhythms];

        // 1st bar: start with delay to enhance separation effect
        if (index1 == 0  && hasTrackCF)
        {
            // no 1st note
            AddNoteEvent(track31, note1, octave1, (1 - rhythmsArray[2])*duration, rhythmsArray[2]*duration);
        }
        // last bar: replace 1st note by consonnant interval and set tonic as 2nd note
        else if (index1 == track11NbNotes - 1)
        {
            // replace 1st note with new value

            const track31NbNotes = track31.GetNbNotes();
            const note3ValuePrev = track31.GetNoteValue(track31NbNotes - 1);
            let note3PrevIndex = scaleNotesValues.indexOf(note3ValuePrev);

            let note1ValueNew = GetRandomNoteValueInScale(note3PrevIndex - 1, note1Index + 1, scaleNotesValues);

            // prevent tonic
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++)
            {
                let acceptNote = (GetNoteFromValue(note1ValueNew) != tonic);
                if (acceptNote)
                    break;
                else // generate new note
                    note1ValueNew = GetRandomNoteValueInScale(note3PrevIndex - 1, note1Index + 1, scaleNotesValues);
            }

            AddNoteValueEvent(track31, note1ValueNew, 0, rhythmsArray[0]*duration);

            // set tonic as 2nd note
            AddNoteEvent(track31, note1, octave1, 0, rhythmsArray[1]*duration);
        }
        else
        {
            // keep existing note as 1st bar note
            AddNoteEvent(track31, note1, octave1, 0, rhythmsArray[0]*duration);
            
            // create new 2nd note in bar
            let note32ValueNew = -1;
            const nbTries = 10000;
            for (let i = 0; i < nbTries; i++)
            {
                note32ValueNew = GetRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
                if (acceptNoteInCounterpoint31(note32ValueNew, tonic, index1, nbBars, track31, track11, trackCF))
                    break;
            }
            AddNoteValueEvent(track31, note32ValueNew, 0, rhythmsArray[1]*duration);

            // create new 3rd note in bat
            let note33ValueNew = -1;
            for (let i = 0; i < nbTries; i++)
            {
                note33ValueNew = GetRandomNoteValueInScale(note1Index - 2, note1NextIndex + 2, scaleNotesValues);
                if (acceptNoteInCounterpoint31(note33ValueNew, tonic, index1, nbBars, track31, track11, trackCF))
                    break;
            }
            
            AddNoteValueEvent(track31, note33ValueNew, 0, rhythmsArray[2]*duration);
        }

        index1++;
    }

    return track31;
}

function acceptNoteInCounterpoint31(note3Value: number, tonicValue: number, barIndex: number, nbBars: number,
    track31: MidiTrack, track11: MidiTrack, trackCF: (MidiTrack | null) = null): boolean
{
    const track11NbNotes = track11.GetNbNotes();
    const track31NbNotes = track31.GetNbNotes();
    const hasTrackCF = (trackCF != null && trackCF.Events != null && trackCF.Events.length > 1);
    
    const note1Value = track11.GetNoteValue(barIndex);
    const note1ValueNext = track11.GetNoteValue(barIndex + 1);
    const note3ValuePrev = track31.GetNoteValue(track31NbNotes - 1);

    let note3PosInBar = ((track31NbNotes + 0) % 3);
    if (note3PosInBar == 0)
        note3PosInBar = 3;

    // prevent tone repetition for 1st and 2nd notes
    if (GetNoteFromValue(note3Value) == GetNoteFromValue(note1Value))
        return false;
                
    // prevent consecutive tone repetition for 2nd notes of 2 consecutive bars
    if (GetNoteFromValue(note3Value) == GetNoteFromValue(note3ValuePrev))
        return false;
    
    if (hasTrackCF)
    {
        if (0 < barIndex && barIndex < track11NbNotes - 1)
        {
            // compute current candidate interval with existing track note
            const noteCFValue = (<MidiTrack>trackCF).GetNoteValue(barIndex);
            const noteCFValueNext = (<MidiTrack>trackCF).GetNoteValue(barIndex + 1);
            const interval1Next = GetIntervalBetweenNotes(note1ValueNext, noteCFValueNext);
            const interval3Cur = GetIntervalBetweenNotes(note3Value, noteCFValue);
    
            // prevent parallel octaves and 5ths
            if (interval3Cur == 7 && interval1Next == 7)
                return false;
            if (interval3Cur == 5 && interval1Next == 5)
                return false;
            if (interval3Cur == 0 && interval1Next == 0)
                return false;
    
            // prevent direct 5ths/8ves for 2nd notes
            const motion13 = GetMotionBetweenNotes(note1Value, note3Value);
            const motionCF = GetMotionBetweenNotes(noteCFValue, noteCFValueNext);
            const hasSameMotion = (motion13 == motionCF);
            if (hasSameMotion && (interval3Cur == 0 || interval3Cur == 7 || interval3Cur == 5))
                return false;

            if (note3PosInBar == 3)
            {
                // prevent dissonant intervals on both 2nd and 3rd notes of the same bar
                const interval3_2nd = GetIntervalBetweenNotes(note3ValuePrev, noteCFValue);
                if (dissonances.indexOf(interval3_2nd) >= 0 && dissonances.indexOf(interval3Cur))
                    return false;

                // prevent dissonant neighbors with consonant suspension:
                //  - 3rd note forming dissonant interval
                //    with 2nd note of current bar == 1st note of the next bar
                if (dissonances.indexOf(interval3Cur) >= 0 && interval1Next == 0)
                    return false;

                // prevent consonant neighbor tones in bars:
                const note3Value_1st = track31.GetNoteValue(track31NbNotes - 2);
                const interval3_1st = GetIntervalBetweenNotes(note3Value_1st, noteCFValue);
                //  - counterpoint notes forming 5th,6th,5th intervals in bar
                if (interval3_1st == 7 && (interval3_2nd == 8 || interval3_2nd == 9) && interval3Cur == 7)
                    return false;
                //  - counterpoint notes forming 6th,5th,6th intervals in bar
                if ((interval3_1st == 8 || interval3_1st == 9) && interval3_2nd == 7 && (interval3Cur == 8 || interval3Cur == 9))
                    return false;

                // allow embellishing tones on 2nd notes iff:
                if (dissonances.indexOf(interval3_2nd) >= 0)
                {
                    let accept = false;

                    //  - counterpoint notes form 5th,3rd,5th intervals in bar
                    if (interval3_1st == 7 && (interval3_2nd == 3 || interval3_2nd == 4) && interval3Cur == 7)
                        accept = true;
                        
                    //  - counterpoint notes form 6th,3rd,6th intervals in bar
                    if ((interval3_1st == 8 || interval3_1st == 9) && (interval3_2nd == 3 || interval3_2nd == 4) && (interval3Cur == 8 || interval3Cur == 9))
                        accept = true;

                    if (!accept)
                        return false;
                }

                // 2 possible cadences for penultimate bar:
                if (barIndex == track11NbNotes - 2)
                {
                    const motion3_12 = GetMotionBetweenNotes(note3Value_1st, note3ValuePrev);
                    const motion3_23 = GetMotionBetweenNotes(note3ValuePrev, note3Value);
                    const motion3NextBar = GetMotionBetweenNotes(note3Value, note1ValueNext);
                    let isCadenceAllowed = false;

                    //  - All 3 notes asc/descend to tonic
                    if (motion3_12 == motion3_23 && motion3_23 == motion3NextBar)
                        isCadenceAllowed = true;

                    //  - 1st note desc/ascends and 2nd, 3rd notes asc/descends to tonic
                    if (motion3_12 != motion3_23 && motion3_23 == motion3NextBar)
                        isCadenceAllowed = true;

                    if (!isCadenceAllowed)
                        return false;
                }
            }
        }
    }

    // at penultimate bar, prevent tonic as 2nd note
    if (barIndex == track11NbNotes - 2)
    {
        if (GetNoteFromValue(note3Value) == GetNoteFromValue(tonicValue))
            return false;
    }
    // prevent 3 consecutive same notes
    else if (barIndex < track11NbNotes - 2)
    {
        // new 2nd note between 2 existing consecutive same notes
        let has3ConsecutiveSameNotes: Boolean = (note1Value == note1ValueNext && note3Value == note1ValueNext);
    
        // new 2nd note after 1 new and 1 existing consecutive same notes
        const track21NbNotes = track31.GetNbNotes();
        if (track21NbNotes >= 2)
        {
            const note2ValuePrev = track31.GetNoteValue(track21NbNotes - 2);
            has3ConsecutiveSameNotes = has3ConsecutiveSameNotes
                || (note2ValuePrev == note1Value && note3Value == note2ValuePrev);
        }
    
        if (has3ConsecutiveSameNotes)
            return false;
    }

    return true;
}

function checkCounterpoint31(track1: MidiTrack, track2: MidiTrack): boolean
{
    // force contrary motion in penultimate bar (to avoid direct octave)?

    // prevent melodies' lowest/highest points happening at close bars

    let nbNotes: Array<number> = [-1, -1];
    let indexTrack = 0;
    let noteValuesMax: Array<number> = [-1, -1];
    let noteValuesMin: Array<number> = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let indexValuesMax: Array<number> = [-1, -1];
    let indexValuesMin: Array<number> = [-1, -1];
    for (const track of [track1, track2])
    {
        nbNotes[indexTrack] = track.GetNbNotes();
        let indexNote = 0;
        for (const event of track.Events)
        {
            if (event.Type != MidiTrackEventType.NOTE_OFF)
                continue;
                
            const noteValue = track.GetNoteValue(indexNote);
    
            if (noteValue > noteValuesMax[indexTrack])
            {
                noteValuesMax[indexTrack] = noteValue;
                indexValuesMax[indexTrack] = indexNote;
            }
            if (noteValue < noteValuesMin[indexTrack])
            {
                noteValuesMin[indexTrack] = noteValue;
                indexValuesMin[indexTrack] = indexNote;
            }
    
            indexNote++;
        }

        indexTrack++;
    }

    // set track with highest nb. of notes as counterpoint above
    const indexTrackBelow = (nbNotes[1] < nbNotes[0]) ? 1 : 0;
    const indexTrackAbove = 1 - indexTrackBelow;

    // prevent close highest and lowest notes
    if (Math.abs(indexValuesMax[indexTrackBelow] - 0.5*indexValuesMax[indexTrackAbove]) <= 1)
        return false;
    if (Math.abs(indexValuesMin[indexTrackBelow] - 0.5*indexValuesMin[indexTrackAbove]) <= 1)
        return false;

    return true;
}

// reduce 3:1 counterpoint track to 1 note per bar track
function ReduceTrack31(track31: MidiTrack, channelId: number): MidiTrack
{
    let track11 = new MidiTrack(channelId);
    const track21NbNotes = track31.GetNbNotes();

    // build reduced 1 note par bar track
    let noteIndex = 1;
    for (const event of track31.Events)
    {
        if (event.Type != MidiTrackEventType.NOTE_OFF)
            continue;
        
        // take only 1st bar note,
        // except for 1st bar when 1st note starts on half bar
        // and for last bar when 2nd note is tonic
        let skipNote = ((noteIndex % 3) != 0);
        if (noteIndex == 1)                         // 2nd note of first bar
            skipNote == false;
        else if (noteIndex == track21NbNotes - 2)   // 1st note of last bar
            skipNote == true;
        else if (noteIndex == track21NbNotes - 1)   // 2nd note of last bar
            skipNote == false;

        if (skipNote)
        {
            noteIndex++;
            continue;
        }

        const noteValue = track31.GetNoteValue(noteIndex);
        AddNoteValueEvent(track11, noteValue, 0, 4*qNote)

        noteIndex++;
    }

    return track11;
}

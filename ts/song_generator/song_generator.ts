const generatedSongTypes: Map<string, string> = new Map<string, string>();
generatedSongTypes.set("chords+melody"            , "chords+melody");
generatedSongTypes.set("chords_progression"       , "chords_progression");
generatedSongTypes.set("arpeggios_progression"    , "arpeggios_progression");
generatedSongTypes.set("sequence"                 , "sequence");
generatedSongTypes.set("counterpoint 1:1"         , "counterpoint_1-1");
generatedSongTypes.set("counterpoint 2:1"         , "counterpoint_2-1");
generatedSongTypes.set("counterpoint 3:1"         , "counterpoint_3-1");
generatedSongTypes.set("counterpoint 4:1"         , "counterpoint_4-1");
generatedSongTypes.set("counterpoint 4th species" , "counterpoint_4th-s");

const regexCounterpoint1_3S = new RegExp('^counterpoint(.*?)\\d(.*)\\d$');
const regexCounterpoint4_5S = new RegExp('^counterpoint(.*?)\\dth(.*?)$');

const qNote = 480; // quarter-note division

let generatedMidi = new MidiFile(1, 2, qNote);
let hasGeneratedMidi = false;
resetGeneratedSong(false);

function generateNewTrack(trackIndex: number = 0 /* offset 1, 0 = all tracks */): void
{
    const selectedTypeId = getSelectedSongType('song_generator_type');
    const isCounterpoint = selectedTypeId.startsWith("counterpoint");
    
    // get selected tonic
    const tonicSelected: string = (<HTMLSelectElement>document.getElementById(`song_generator_tonic`)).value;
    const tonic: number = parseInt(tonicSelected);

    // get selected scale
    const scaleId = (<HTMLSelectElement>document.getElementById(`song_generator_scale`)).value;
    const scaleValues = getScaleValues(scaleId);

    // get number of bars
    const nbBarsSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_nb_bars`)).value;
    const nbBars: number = parseInt(nbBarsSelected);

    // get octaves and notes apparition frequencies
    const octaves: Array<number> = [];
    const frequencies: Array<number> = [];
    for (let i = 1; i <= 2; i++)
    {
        const octaveSelected = (<HTMLInputElement>document.getElementById(`song_generator_octave_track${i}`)).value;
        const octave: number = parseInt(octaveSelected);
        octaves.push(octave);

        const freqSelected = (<HTMLInputElement>document.getElementById(`song_generator_freq_track${i}`)).value;
        const freq: number = parseInt(freqSelected);
        frequencies.push(freq);
    }

    // used for counterpoints
    const rhythmFactor21Array: Array<Array<number>> = [[1/2, 1/2], /*[1/2, 1/2]*/[3/4, 1/4]];
    const rhythmFactor31Array: Array<Array<number>> = [[1/3, 1/3, 1/3], [1/2, 1/4, 1/4]];
    const rhythmFactor41Array: Array<Array<number>> = [[1/4, 1/4, 1/4, 1/4], [1/8, 3/8, 2/8, 2/8]];
    const rhythmFactor4SArray: Array<Array<number>> = [[1/2, 1/2], [1/4, 3/4]];

    // get selected tempo
    const tempoSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_tempo`)).value;
    const tempo: number = parseInt(tempoSelected);

    // track 0: set selected tempo
    generatedMidi.UpdateTempo(0, tempo, 0);  

    if (trackIndex <= 0)
    {
        let tracksSelected = getSelectedTracks();

        // if counterpoint, generate both tracks at once
        if (isCounterpoint)
        {
            let trackH  = generatedMidi.Tracks[1];
            let trackCF = generatedMidi.Tracks[2]; // bass

            // regenerate CF track if no counterpoint melody generated
            const nbTries = 100;
            let trackCandidateCF = null, trackCandidateH = null;
            
            switch(selectedTypeId)
            {
                case "counterpoint_1-1":
                case "counterpoint_2-1":
                case "counterpoint_3-1":
                case "counterpoint_4-1":
                case "counterpoint_4th-s":
                    for (let i = 0; i < nbTries; i++)
                    {
                        // generate CF then counterpoint
                        trackCandidateCF = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[1], qNote, 2);
                        if (trackCandidateCF != null)
                        {
                            if (selectedTypeId == "counterpoint_4th-s")
                                trackCandidateH = GenerateCounterpointTrack4S(tonic, scaleValues, nbBars, octaves[0], qNote, 1, rhythmFactor4SArray, trackCandidateCF);
                            else if (selectedTypeId == "counterpoint_4-1")
                                trackCandidateH = GenerateCounterpointTrack41(tonic, scaleValues, nbBars, octaves[0], qNote, 1, rhythmFactor41Array, trackCandidateCF);
                            else if (selectedTypeId == "counterpoint_3-1")
                                trackCandidateH = GenerateCounterpointTrack31(tonic, scaleValues, nbBars, octaves[0], qNote, 1, rhythmFactor31Array, trackCandidateCF);
                            else if (selectedTypeId == "counterpoint_2-1")
                                trackCandidateH = GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octaves[0], qNote, 1, rhythmFactor21Array, trackCandidateCF);
                            else
                                trackCandidateH = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[0], qNote, 1, trackCandidateCF);
                        }

                        if (trackCandidateCF != null && trackCandidateH != null)
                            break;
                    }
                    break;
            }
        
            if (trackCandidateCF != null)
                trackCF = <MidiTrack>trackCandidateCF;
            if (trackCandidateH != null)
                trackH = <MidiTrack>trackCandidateH;

            // update generated tracks
            generatedMidi.Tracks[1] = trackH;
            generatedMidi.Tracks[2] = trackCF;

            finalizeTrackGeneration();
            return;
        }
        else    // generate track separately
        {
            for (let i = 1; i <= 2; i++)
                if (tracksSelected[i - 1])
                    generateNewTrack(i);
        }
            
        return;
    }

    // get number of loops
    const nbNotesPerBarSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_nb_notes_per_bar`)).value;
    const nbNotesPerBar: number = parseInt(nbNotesPerBarSelected);
    if (isCounterpoint && nbBars <= 5)
        return;

    // generate tracks    
    let track = generatedMidi.Tracks[trackIndex];
    let trackOther = generatedMidi.Tracks[3 - trackIndex];
    let trackCandidate = null;
    switch(selectedTypeId)
    {
        case "chords+melody":
            if (trackIndex == 1)
                trackCandidate = GenerateMelodyTrack(tonic, scaleValues, nbBars, nbNotesPerBar, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            else
                trackCandidate = GenerateChordsProgTrack(tonic, scaleValues, nbBars, 1, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            break;

        case "chords_progression":
            if (trackIndex == 1)
                trackCandidate = GenerateChordsProgTrack(tonic, scaleValues, nbBars, 1, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            else
                trackCandidate = GenerateChordsProgBassTrack(tonic, scaleValues, nbBars, 1, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            break;

        case "arpeggios_progression":
            if (trackIndex == 1)
                trackCandidate = GenerateChordsProgTrack(tonic, scaleValues, nbBars, nbNotesPerBar, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            else
                trackCandidate = GenerateChordsProgBassTrack(tonic, scaleValues, nbBars, 1, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            break;
        
        case "sequence":
            trackCandidate = GenerateSequenceTrack(tonic, scaleValues, nbBars, nbNotesPerBar, octaves[trackIndex - 1], frequencies[trackIndex - 1], qNote, trackIndex);
            break;

        case "counterpoint_4th-s":
            if (trackIndex == 1)
            {
                trackCandidate = GenerateCounterpointTrack4S(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, rhythmFactor4SArray, trackOther);
            }
            else    // bass
            {
                // reduce 4th species counterpoint high track to 1 note per bar track
                //let trackHReduced = ReduceTrack4S(trackOther, 1);
                //trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, trackHReduced);
            }

        case "counterpoint_4-1":
            if (trackIndex == 1)
            {
                trackCandidate = GenerateCounterpointTrack41(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, rhythmFactor41Array, trackOther);
            }
            else    // bass
            {
                // reduce 4:1 counterpoint high track to 1 note per bar track
                let trackHReduced = ReduceTrack41(trackOther, 1);
                trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, trackHReduced);
            }
            break;
        case "counterpoint_3-1":

            if (trackIndex == 1)
            {
                trackCandidate = GenerateCounterpointTrack31(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, rhythmFactor31Array, trackOther);
            }
            else    // bass
            {
                // reduce 3:1 counterpoint high track to 1 note per bar track
                let trackHReduced = ReduceTrack31(trackOther, 1);
                trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, trackHReduced);
            }
            break;
        case "counterpoint_2-1":

            if (trackIndex == 1)
            {
                trackCandidate = GenerateCounterpointTrack21(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, rhythmFactor21Array, trackOther);
            }
            else    // bass
            {
                // reduce 2:1 counterpoint high track to 1 note per bar track
                let trackHReduced = ReduceTrack21(trackOther, 1);
                trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, trackHReduced);
            }
            break;
        default:
            trackCandidate = GenerateCounterpointTrack11(tonic, scaleValues, nbBars, octaves[trackIndex - 1], qNote, trackIndex, trackOther);
            break;
    }
        
    if (trackCandidate != null)
        track = <MidiTrack>trackCandidate;
    
    // update generated track
    generatedMidi.Tracks[trackIndex] = track;
    finalizeTrackGeneration();
}

function finalizeTrackGeneration()
{
    hasGeneratedMidi = true;
    updateSongGeneratorPage();
    setEnabled("song_generator_play", true);
    setEnabled("song_generator_save", true);

    // set track instruments
    for (let i = 1; i <= 2; i++)
    {
        const instrSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`song_generator_instrument_track${i}`);
        const instrId: number = parseInt(instrSelect.value);

        generatedMidi.UpdateInstrument(i, instrId);
    }
}

function playGeneratedSong(): void
{
    if (generatedMidi == null)
        return;

    // get selected tempo
    const tempoSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_tempo`)).value;
    const tempo: number = parseInt(tempoSelected);
    generatedMidi.UpdateTempo(0, tempo, 0 /*general tempo*/);

    // get selected tracks
    let tracksSelected = getSelectedTracks();
    generatedMidi.EnableTracks(tracksSelected);

    // get number of loops
    const nbLoopsSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_nb_loops`)).value;
    const nbLoops: number = parseInt(nbLoopsSelected);

    generatedMidi.Play(nbLoops);
}

function saveGeneratedSong(): void
{
    // TODO: add option to merge into 1 track?
    
    const tonicName: string = getSelectorText("song_generator_tonic");
    const scaleName: string = getSelectorText("song_generator_scale");
    
    const fileName = `${getSelectedSongTypeText('song_generator_type')} - ${tonicName} ${scaleName}`;
    generatedMidi.Save(`${fileName}.mid`);
}

function resetGeneratedSong(updatePage: Boolean = true): void
{
    generatedMidi = new MidiFile(1, 2, qNote);
    generatedMidi.Tempo(0, 120, 0);
    generatedMidi.TimeSignature(0, 4, 4, 0);
    hasGeneratedMidi = false;

    if (updatePage)
        updateSongGeneratorPage();
}

function getSelectedTracks(): Array<boolean>
{
    // get selected tracks
    let tracksSelected = [false, false];
    for (let i = 1; i <= 2; i++)
        tracksSelected[i - 1] = (<HTMLInputElement>document.getElementById(`song_generator_checkbox_track${i}`)).checked;

    return tracksSelected;
}

function updateSongGeneratorPage(): void
{
    // get selected tracks

    let tracksSelected = getSelectedTracks();
    generatedMidi.EnableTracks(tracksSelected);

    for (let i = 1; i <= 2; i++)
        (<HTMLButtonElement>document.getElementById(`song_generator_checkbox_track${i}_text`)).innerText
            = `${getString("track")} ${i}`; // default

    let nbTracksSelected = 0;
    for (let i = 0; i < 2; i++)
        if (tracksSelected[i])
            nbTracksSelected++;

    (<HTMLButtonElement>document.getElementById('song_generator_generate')).innerText = (nbTracksSelected > 1) ?
    `${getString("generate_new_song")}` : `${getString("generate_new_track")}`;
    
    const hasSelectedTracks = (nbTracksSelected > 0);
    setEnabled('song_generator_generate', hasSelectedTracks);
    setEnabled('song_generator_play', hasGeneratedMidi && hasSelectedTracks);
    setEnabled("song_generator_reset", hasGeneratedMidi);
    setEnabled("song_generator_save", hasGeneratedMidi);

    const selectedTypeId = getSelectedSongType('song_generator_type');
    if (selectedTypeId != null)
    {
        const isCounterpoint = selectedTypeId.startsWith("counterpoint");
        const isChordsMelody = (selectedTypeId == "chords+melody");
        const isArpeggiosProg = (selectedTypeId == "arpeggios_progression");
        const isSequence = (selectedTypeId == "sequence");
        setEnabled("song_generator_nb_notes_per_bar", (isSequence || isChordsMelody || isArpeggiosProg));
        setEnabled("song_generator_generate_track2", !regexCounterpoint4_5S.test(selectedTypeId));
        
        setEnabled(`song_generator_freq_track1`, (isSequence || isChordsMelody));
        setEnabled(`song_generator_freq_track2`, isSequence);
    }

    // for debug purposes
    /*if (false)
    if (hasSong)
    {
        let intervalsStr = "";
        for (let i = 0; i < generatedSong.tracks[0].notes.length; i++)
        {
            const noteValue0 = generatedSong.tracks[0].GetNoteValue(i);
            const noteValue1 = generatedSong.tracks[1].GetNoteValue(i);
            intervalsStr += getIntervalBetweenNotes(noteValue1, noteValue0) + " ";
        }
        intervalsStr = intervalsStr.trim();
        (<HTMLSpanElement>document.getElementById(`song_generator_tracks_intervals`)).innerText = intervalsStr;
    }*/
}

function updateSongTypeSelector(id: string)
{
    // get selector
    const typeSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (typeSelect.options != null && typeSelect.options.length > 0);

    if (!initialized)
    {
        // add song types
        for (const [key, value] of generatedSongTypes)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getSongTypeText(key);
            typeSelect.appendChild(option);
        }
}
    else
    {
        // update
        for (const option of typeSelect.options)
            option.innerHTML = getSongTypeText(option.value);
    }

    // disable if only 1 option
    typeSelect.disabled = (typeSelect.options.length <= 1);
}

function getSongTypeText(key: string) : string
{
    if (regexCounterpoint1_3S.test(key))
        return key.replace("counterpoint", getString("counterpoint"));
    else if (regexCounterpoint4_5S.test(key))
    {
        let text = key.replace("counterpoint", getString("counterpoint"))
        text = text.replace("th", getString("th"));
        text = text.replace("species", getString("species"));
        return text;
    }
    else
        return getString(key);
}

function getSelectedSongType(id: string): string
{
    const typeSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const typeString = typeSelect.value;

    const typeId = <string>generatedSongTypes.get(typeString);
    return typeId;
}

function getSelectedSongTypeText(id: string): string
{
    const typeSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const typeIndex = typeSelect.selectedIndex;
    const typeText = typeSelect.options[typeIndex].text;

    return typeText;
}
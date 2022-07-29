let generatedSong: Song = new Song();

function generateNewSong(): void
{
    // get selected tonic
    const tonicSelected: string = (<HTMLSelectElement>document.getElementById(`song_generator_tonic`)).value;
    const tonicValue: number = parseInt(tonicSelected);

    // get selected scale
    const scaleId = (<HTMLSelectElement>document.getElementById(`song_generator_scale`)).value;
    const scaleValues = getScaleValues(scaleId);

    // get selected tempo
    const tempoSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_tempo`)).value;
    const tempo: number = parseInt(tempoSelected);

    const nbBars = 9;
    let track1 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 2);
    let track2 = generateCounterpointTrack11(tonicValue, scaleValues, nbBars, 4, track1);
    generatedSong = new Song([track1, track2]);
    generatedSong.Tempo = tempo;

    displayGeneratedSong();

    setEnabled("song_generator_play", true);
    //generatedSong.Log();
}

function playGeneratedSong(): void
{
    if (generatedSong == null)
        return;
    
    // get selected tempo
    const tempoSelected: string = (<HTMLInputElement>document.getElementById(`song_generator_tempo`)).value;
    const tempo: number = parseInt(tempoSelected);
    generatedSong.Tempo = tempo;

    generatedSong.Play();

    //playTestTrack(tempoValue, tonicValue, 2);
    //playTestSong(tempoValue, tonicValue, 2);
}

function resetGeneratedSong(): void
{
    generatedSong = new Song();
    setEnabled("song_generator_play", false);
}

function displayGeneratedSong(): void
{
    const hasSong = (generatedSong != null && generatedSong.tracks != null && generatedSong.tracks.length > 0);
    
    for (let i = 1; i <= 2; i++)
        (<HTMLSpanElement>document.getElementById(`song_generator_track_text${i}`)).innerText = hasSong ?
            generatedSong.tracks[i-1].Text() : "";
    
    // for debug purposes
    if (false && hasSong)
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
    }
}


///////////////////////////////// TEST FUNCTIONS //////////////////////////////


function playTestTrack(tempo: number, note:number, octave: number): void
{
    let notes: Array<Note> = [];

    notes.push(new Note(0, 0, 1, 0));
    notes.push(new Note(0, 0, 1, 1));
    notes.push(new Note(0, 0, 1, 2));
    notes.push(new Note(2, 0, 1, 3));
    notes.push(new Note(4, 0, 1, 4));

    notes.push(new Note(2, 0, 1, 6));

    notes.push(new Note(0, 0, 1, 8));
    notes.push(new Note(4, 0, 1, 9));
    notes.push(new Note(2, 0, 1, 10));
    notes.push(new Note(2, 0, 1, 11));
    notes.push(new Note(0, 0, 1, 12));

    const track = new Track(notes);
    track.Transpose(note + 12*octave);
    track.Play(tempo);
}

function playTestSong(tempo: number, note:number, octave: number): void
{
    let notes1: Array<Note> = [];
    notes1.push(new Note(0, 0, 1, 0));
    notes1.push(new Note(0, 0, 1, 1));
    notes1.push(new Note(0, 0, 1, 2));
    notes1.push(new Note(2, 0, 1, 3));
    notes1.push(new Note(4, 0, 1, 4));
    notes1.push(new Note(2, 0, 1, 6));
    notes1.push(new Note(0, 0, 1, 8));
    notes1.push(new Note(4, 0, 1, 9));
    notes1.push(new Note(2, 0, 1, 10));
    notes1.push(new Note(2, 0, 1, 11));
    notes1.push(new Note(0, 0, 1, 12));
    const track1 = new Track(notes1);

    let notes2: Array<Note> = [];
    notes2.push(new Note(4, 0, 1, 0));
    notes2.push(new Note(4, 0, 1, 1));
    notes2.push(new Note(4, 0, 1, 2));
    notes2.push(new Note(5, 0, 1, 3));
    notes2.push(new Note(7, 0, 1, 4));
    notes2.push(new Note(5, 0, 1, 6));
    notes2.push(new Note(4, 0, 1, 8));
    notes2.push(new Note(7, 0, 1, 9));
    notes2.push(new Note(5, 0, 1, 10));
    notes2.push(new Note(5, 0, 1, 11));
    notes2.push(new Note(4, 0, 1, 12));
    const track2 = new Track(notes2);

    const song = new Song([track1, track2]);
    song.Transpose(note + 12*octave);
    song.Tempo = tempo;
    //song.Log();
    song.Play();
}
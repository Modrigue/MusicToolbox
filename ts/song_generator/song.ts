class Song
{
    tracks: Array<Track>;

    // single for now
    Tempo: number;

    constructor(tracks: Array<Track> = [], tempo: number = 60)
    {
        this.tracks = tracks;
        this.Tempo = tempo;
    }

    public Play()
    {
        for (const track of this.tracks)
        {
            track.Play(this.Tempo);
        }
    }

    public Transpose(interval: number)
    {
        for (let track of this.tracks)
        {
            track.Transpose(interval);
        }
    }
}
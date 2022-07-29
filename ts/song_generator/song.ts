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
        //stopPlaying();

        for (const track of this.tracks)
        {
            if (track != null)
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

    // mute / unmute tracks
    public EnableTracks(statusTracks: Array<boolean>): void
    {
        if (statusTracks == null || this.tracks == null)
            return;
        
        if (statusTracks == null)
            return;

        for (let i = 0; i < statusTracks.length; i++)
        {
            const status = statusTracks[i];
            const track = this.tracks[i];

            if (track != null)
                track.muted = !status;
        }
    }

    // for debug purposes only
    public Log(): void
    {
        let logText: string = "[";
        for (const track of this.tracks)
        {
            logText += track.LogText() + ", ";
        }
        logText = logText.slice(0, logText.lastIndexOf(", "));
        logText += "]";

        console.log(logText);
    }
}
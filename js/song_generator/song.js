"use strict";
class Song {
    constructor(tracks = [], tempo = 60) {
        this.tracks = tracks;
        this.Tempo = tempo;
    }
    Play() {
        //stopPlaying();
        for (const track of this.tracks) {
            if (track != null)
                track.Play(this.Tempo);
        }
    }
    Transpose(interval) {
        for (let track of this.tracks) {
            track.Transpose(interval);
        }
    }
    // mute / unmute tracks
    EnableTracks(statusTracks) {
        if (statusTracks == null || this.tracks == null)
            return;
        if (statusTracks == null)
            return;
        for (let i = 0; i < statusTracks.length; i++) {
            const status = statusTracks[i];
            const track = this.tracks[i];
            if (track != null)
                track.muted = !status;
        }
    }
    // for debug purposes only
    Log() {
        let logText = "[";
        for (const track of this.tracks) {
            logText += track.LogText() + ", ";
        }
        logText = logText.slice(0, logText.lastIndexOf(", "));
        logText += "]";
        console.log(logText);
    }
}
//# sourceMappingURL=song.js.map
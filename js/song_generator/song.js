"use strict";
class Song {
    constructor(tracks = [], tempo = 60) {
        this.tracks = tracks;
        this.Tempo = tempo;
    }
    Play() {
        for (const track of this.tracks) {
            track.Play(this.Tempo);
        }
    }
    Transpose(interval) {
        for (let track of this.tracks) {
            track.Transpose(interval);
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
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
}
//# sourceMappingURL=song.js.map
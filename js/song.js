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
}
//# sourceMappingURL=song.js.map
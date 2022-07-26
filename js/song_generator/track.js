"use strict";
class Track {
    constructor(notes = []) {
        this.notes = notes;
    }
    Play(tempo) {
        if (this.notes == null || this.notes.length == 0)
            return;
        for (const note of this.notes) {
            note.Play(tempo);
        }
    }
    AddNote(note) {
        this.notes.push(note);
    }
    Transpose(interval) {
        for (let note of this.notes) {
            note.value += interval;
        }
    }
}
//# sourceMappingURL=track.js.map
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
            note.Transpose(interval);
        }
    }
    // for debug purposes only
    LogText() {
        let logText = "[";
        for (const note of this.notes) {
            logText += note.LogText() + ", ";
        }
        logText = logText.slice(0, logText.lastIndexOf(", "));
        logText += "]";
        return logText;
    }
}
//# sourceMappingURL=track.js.map
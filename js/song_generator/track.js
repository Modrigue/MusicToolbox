"use strict";
class Track {
    constructor(notes = []) {
        this.muted = false;
        this.notes = notes;
    }
    Play(tempo) {
        if (this.notes == null || this.notes.length == 0)
            return;
        if (this.muted)
            return;
        for (const note of this.notes) {
            note.Play(tempo);
        }
    }
    AddNote(note) {
        this.notes.push(note);
    }
    GetNoteValue(index) {
        if (index < 0 || index >= this.notes.length)
            return -1;
        return this.notes[index].noteValue;
    }
    Transpose(interval) {
        for (let note of this.notes) {
            note.Transpose(interval);
        }
    }
    Text() {
        let text = "";
        for (const note of this.notes) {
            text += note.Text() + " ";
        }
        text = text.trim();
        return text;
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
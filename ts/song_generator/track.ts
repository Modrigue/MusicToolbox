class Track
{
    notes: Array<Note>;
    
    constructor(notes: Array<Note> = [])
    {
        this.notes = notes;
    }

    public Play(tempo: number): void
    {
        if (this.notes == null || this.notes.length == 0)
            return;

        for (const note of this.notes)
        {
            note.Play(tempo);    
        }
    }

    public AddNote(note: Note): void
    {
        this.notes.push(note);
    }

    public Transpose(interval: number)
    {
        for (let note of this.notes)
        {
            note.Transpose(interval);
        }
    }

    public Text(): string
    {
        let text: string = "";
        for (const note of this.notes)
        {
            text += note.Text() + " ";
        }
        text = text.trim();

        return text;
    }

    // for debug purposes only
    public LogText(): string
    {
        let logText: string = "[";
        for (const note of this.notes)
        {
            logText += note.LogText() + ", ";
        }
        logText = logText.slice(0, logText.lastIndexOf(", "));
        logText += "]";

        return logText;
    }
}
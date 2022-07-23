class Track
{
    notes: Array<Note>;
    
    constructor(notes: Array<Note> = [])
    {
        this.notes = notes;
    }

    public Play(): void
    {
        if (this.notes == null || this.notes.length == 0)
            return;

        for (const note of this.notes)
        {
            note.Play();    
        }
    }

    public AddNote(note: Note): void
    {
        this.notes.push(note);
    }
}
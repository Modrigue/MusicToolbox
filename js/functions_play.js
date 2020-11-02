function playNote(noteValue, delay)
{
    // delay: play one note every quarter second
    var note = 48 + noteValue; // the MIDI note
    var velocity = 96; // how hard the note hits
    var volume = 60; // volume
    var length = 0.75;

    // play the note
    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + length);
}

function playScale(noteValue, scaleValues)
{
    var duration = 1;
    scaleValues.forEach(function (intervalValue, index)
    {
        playNote(noteValue + intervalValue, duration*index);
    });
    playNote(noteValue + 12, duration*(scaleValues.length));
}

function playChord(noteValue, chordValues, duration)
{
    chordValues.forEach(function (intervalValue, index)
    {
        playNote(noteValue + intervalValue, duration);
    });
}

function playChords(noteValue, scaleValues, chordValuesArray, duration)
{
    chordValuesArray.forEach(function(chordValues, index)
    {
        var noteCurrent = noteValue + scaleValues[index];
        playChord(noteCurrent, chordValues, index*duration);    
    });
    var nbNotesInScale = scaleValues.length;
    playChord(noteValue + 12, chordValuesArray[0], nbNotesInScale*duration);
}

/////////////////////////////////// CALLBACKS /////////////////////////////////


function onPlayScale()
{
    // get selected note and scale values
    var noteValue = getSelectedNoteValue();
    var scaleValues = getSelectedScaleValues();

    playScale(noteValue, scaleValues);
}

function onPlayNoteInScale(index)
{
    var duration = 0;

    // get selected note and scale values
    var noteValue = getSelectedNoteValue();
    var scaleValues = getSelectedScaleValues();
    var intervalValue = scaleValues[index];

    playNote(noteValue + intervalValue, duration);
}

function onPlayChords(nbNotesInChords)
{
    // get selected note and scale values
    var noteValue = getSelectedNoteValue();
    var scaleValues = getSelectedScaleValues();

    var chordValuesArray = [];  
    scaleValues.forEach(function (noteValue, index)
    {
      var chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
      chordValuesArray.push(chordValues);
    });

    var duration = 1;
    playChords(noteValue, scaleValues, chordValuesArray, duration);
}

function onPlayChordInScale(nbNotesInChords, index)
{
    // get selected note and scale values
    var noteValue = getSelectedNoteValue();
    var scaleValues = getSelectedScaleValues();
    var chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);

    var duration = 0;
    var noteCurrent = noteValue + scaleValues[index];
    playChord(noteCurrent, chordValues, duration);   
}
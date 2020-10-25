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
        playNote(noteValue + intervalValue, duration*(index+1));
    });
    playNote(noteValue + 12, duration*(scaleValues.length+1));
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
        playChord(noteCurrent, chordValues, (index + 1)*duration);    
    });
    var nbNotesInScale = scaleValues.length;
    playChord(noteValue + 12, chordValuesArray[0], (nbNotesInScale + 1)*duration);
}

/////////////////////////////////// CALLBACKS /////////////////////////////////


function onPlayScale()
{
    // get selected note and scale values
    var noteValue = getSelectedNoteValue();
    var scaleValues = getSelectedScaleValues();

    playScale(noteValue, scaleValues);
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
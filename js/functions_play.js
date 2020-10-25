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

/////////////////////////////////// CALLBACKS /////////////////////////////////


function onPlayScale()
{
    // get selected note
    noteSelected = document.getElementById("note").value;
    var noteValue = parseInt(noteSelected);
    
    // get selected scale and mode
    scaleSelected = document.getElementById("scale").value;
    var scaleMode = scaleSelected.split(",");
    var scaleName = scaleMode[0];
    var modeValue = parseInt(scaleMode[1]);
    var scaleFamily = scaleFamiliesDict[scaleName];
    var scaleValues = getModeNotesValues(scaleFamily, modeValue);

    //var nbNotesInScale = scaleFamily.length;

    playScale(noteValue, scaleValues);
}

function onPlayChords(nbNotesInChords)
{
    // get selected note
    noteSelected = document.getElementById("note").value;
    var noteValue = parseInt(noteSelected);
    
    // get selected scale and mode
    scaleSelected = document.getElementById("scale").value;
    var scaleMode = scaleSelected.split(",");
    var scaleName = scaleMode[0];
    var modeValue = parseInt(scaleMode[1]);
    var scaleFamily = scaleFamiliesDict[scaleName];
    var scaleValues = getModeNotesValues(scaleFamily, modeValue);

    var chordValuesArray = [];
    var chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
  
    scaleValues.forEach(function (noteValue, index)
    {
      var chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
      chordValuesArray.push(chordValues);
    });

    var duration = 1;
    chordValuesArray.forEach(function(chordValues, index)
    {
        var noteCurrent = noteValue + scaleValues[index];
        playChord(noteCurrent, chordValues, (index + 1)*duration);    
    });
    var nbNotesInScale = scaleFamily.length;
    playChord(noteValue + 12, chordValuesArray[0], (nbNotesInScale + 1)*duration);
}
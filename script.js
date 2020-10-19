// notes dictionnary
var notesDict = {};
notesDict[0] = "A";
notesDict[1] = "A#";
notesDict[2] = "B";
notesDict[3] = "C";
notesDict[4] = "C#";
notesDict[5] = "D";
notesDict[6] = "D#";
notesDict[7] = "E";
notesDict[8] = "F";
notesDict[9] = "F#";
notesDict[10] = "G";
notesDict[11] = "G#";

// scales
const scale_major_nat = [0, 2, 4, 5, 7, 9, 11];

function addToNoteValue(noteValue, interval)
{
  return ((noteValue + interval) % 12);
}

function onNoteChanged()
{
  update()
}

function onScaleChanged()
{
  update()
}

function update()
{
  noteSelected = document.getElementById("note").value;
  scaleSelected = document.getElementById("scale").value;

  var noteValue = parseInt(noteSelected);

  // build scale
  var notesScaleResult = "";
  scale_major_nat.forEach(function (interval, index)
  {
    newNoteValue = addToNoteValue(noteValue, interval);
    newNote = notesDict[addToNoteValue(noteValue, interval)];
    notesScaleResult = notesScaleResult.concat(newNote.toString() + "&nbsp;&nbsp;&nbsp;");
  });

  document.getElementById('scale_result').innerHTML = notesScaleResult;
}
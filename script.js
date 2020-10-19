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

// interval dictionnary
var intervalsDict = {};
intervalsDict[0] = "T";
intervalsDict[1] = "b2";
intervalsDict[2] = "2";
intervalsDict[3] = "b3";
intervalsDict[4] = "3";
intervalsDict[5] = "4";
intervalsDict[6] = "b5";
intervalsDict[7] = "5";
intervalsDict[8] = "b6";
intervalsDict[9] = "6";
intervalsDict[10] = "b7";
intervalsDict[11] = "7";

// scales
const scale_major_nat = [0, 2, 4, 5, 7, 9, 11];


//////////////////////////////// MUSIC FUNCTIONS //////////////////////////////


function addToNoteValue(noteValue, interval)
{
  return ((noteValue + interval) % 12);
}

function getScaleNotesValues(noteValue, scaleValues)
{
  var scaleNotesValues = [];

  scaleValues.forEach(function (interval, index)
  {
    newNoteValue = addToNoteValue(noteValue, interval);
    scaleNotesValues.push(newNoteValue);
  });

  //alert(scaleNotesValues);
  return scaleNotesValues;
}

function getModeNotesValues(scaleValues, modeNumber)
{
  var modeNotesValues = [];

  var nbNotes = scaleValues.length;
  for (i = 0; i < nbNotes; i++)
  {
    var index = (i + (modeNumber - 1)) % nbNotes;
    var noteValue = scaleValues[index];
    //alert(index + " " + noteValue);
    modeNotesValues.push(noteValue);
  }

  var firstInterval = scaleValues[modeNumber - 1];
  for (i = 0; i < nbNotes; i++)
  {
    modeNotesValues[i] = (modeNotesValues[i] - firstInterval + 12) % 12;
  } 

  //alert(modeNotesValues);
  return modeNotesValues;
}

//////////////////////////////////// EVENTS ///////////////////////////////////


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
  // get selected note
  noteSelected = document.getElementById("note").value;
  var noteValue = parseInt(noteSelected);
  
  // get selected scale and mode
  scaleSelected = document.getElementById("scale").value;
  var scaleMode = scaleSelected.split(",");
  var scaleName = scaleMode[0];
  var modeValue = parseInt(scaleMode[1]);
  var scaleValues = getModeNotesValues(scale_major_nat, modeValue);
  
  // build scale notes list
  var notesScaleResult = "";
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    newNote = notesDict[noteValue];
    notesScaleResult = notesScaleResult.concat(newNote.toString() + "&nbsp;&nbsp;&nbsp;&nbsp;");
  });
  document.getElementById('scale_result').innerHTML = notesScaleResult;

  // build intervals list
  var intervalsResult = "";
  scaleValues.forEach(function (intervalValue, index)
  {
    newInterval = intervalsDict[intervalValue];
    intervalsResult = intervalsResult.concat(newInterval.toString() + "&nbsp;&nbsp;&nbsp;&nbsp");
  });
  document.getElementById('interval_result').innerHTML = intervalsResult;
}
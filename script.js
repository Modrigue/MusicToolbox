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
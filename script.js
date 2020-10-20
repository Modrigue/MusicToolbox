//////////////////////////////// MUSIC FUNCTIONS //////////////////////////////

// add interval to note value
function addToNoteValue(noteValue, interval)
{
  return ((noteValue + interval) % 12);
}

// get scale notes values given tonic and scale
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

// get mode notes values given scale and mode number
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

// compute and update results
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
  var scaleFamily = scalesDict[scaleName];
  var scaleValues = getModeNotesValues(scaleFamily, modeValue);
  
  // build scale notes list
  var notesScaleResult = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes</div><div id=\"resp-table-body\">";
  notesScaleResult = notesScaleResult.concat("<div class=\"resp-table-row\">");
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    newNote = notesDict[noteValue];
    notesScaleResult = notesScaleResult.concat("<div class=\"table-body-cell\">");
    notesScaleResult = notesScaleResult.concat(newNote.toString());
    notesScaleResult = notesScaleResult.concat("</div>");
  });
  notesScaleResult = notesScaleResult.concat("</div>");

  // build intervals list
  notesScaleResult = notesScaleResult.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  scaleValues.forEach(function (intervalValue, index)
  {
    newInterval = intervalsDict[intervalValue];
    notesScaleResult = notesScaleResult.concat("<div class=\"table-body-cell\">");
    notesScaleResult = notesScaleResult.concat(newInterval.toString());
    notesScaleResult = notesScaleResult.concat("</div>");
  });
  notesScaleResult = notesScaleResult.concat("</div>");

  notesScaleResult = notesScaleResult.concat("</div>");
  document.getElementById('scale_result').innerHTML = notesScaleResult;
}
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
  var scaleFamily = scaleFamilies7Dict[scaleName];
  var scaleValues = getModeNotesValues(scaleFamily, modeValue);
  
  // SCALE NOTES

  // build scale notes list
  var notesScaleResult = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes</div><div id=\"resp-table-body\">";
  notesScaleResult = notesScaleResult.concat("<div class=\"resp-table-row\">");
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    noteName = notesDict[noteValue];
    notesScaleResult = notesScaleResult.concat("<div class=\"table-body-cell\">");
    notesScaleResult = notesScaleResult.concat(noteName.toString());
    notesScaleResult = notesScaleResult.concat("</div>");
  });
  notesScaleResult = notesScaleResult.concat("</div>");

  // build intervals list
  notesScaleResult = notesScaleResult.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  scaleValues.forEach(function (intervalValue, index)
  {
    intervalName = intervalsDict[intervalValue];
    notesScaleResult = notesScaleResult.concat("<div class=\"table-body-cell\">");
    notesScaleResult = notesScaleResult.concat(intervalName.toString());
    notesScaleResult = notesScaleResult.concat("</div>");
  });
  notesScaleResult = notesScaleResult.concat("</div>");

  notesScaleResult = notesScaleResult.concat("</div>");
  document.getElementById('scale_result').innerHTML = notesScaleResult;


  // CHORDS WITH 3,4 NOTES HARMONIZATION

  document.getElementById('chords3_result').innerHTML = getChordsTable(scaleValues, scaleNotesValues, 3);
  document.getElementById('chords4_result').innerHTML = getChordsTable(scaleValues, scaleNotesValues, 4);
}
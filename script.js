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
  var scaleFamily = scaleFamiliesDict[scaleName];
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


  // CHORDS HARMONIZATION

  var chordValuesArray = [];

  var chordsResult = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Chords with 3 notes</div><div id=\"resp-table-body\">";
  scaleValues.forEach(function (noteValue, index)
  {
    var chordValues = getChordNumberInScale(scaleValues, index, 3);
    chordValuesArray.push(chordValues);
  });
  
  // chords
  chordsResult = chordsResult.concat("<div class=\"resp-table-row\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    var noteValue = scaleNotesValues[index];
    var noteName = notesDict[noteValue];

    var chordName = getKeyFromValue(chords3Dict, chordValues);
    var chordNoteName = getNoteNameChord(noteName, chordName);

    chordsResult = chordsResult.concat("<div class=\"table-body-cell\">");
    chordsResult = chordsResult.concat(chordNoteName);
    chordsResult = chordsResult.concat("</div>");
  });
  chordsResult = chordsResult.concat("</div>");

  // roman chord representation
  chordsResult = chordsResult.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    var chordName = getKeyFromValue(chords3Dict, chordValues);
    var romanChord = getRomanChord(index, chordName);

    chordsResult = chordsResult.concat("<div class=\"table-body-cell\">");
    chordsResult = chordsResult.concat(romanChord);
    chordsResult = chordsResult.concat("</div>");
  });
  chordsResult = chordsResult.concat("</div>");
  
  // chords notes
  chordsResult = chordsResult.concat("<div class=\"resp-table-row\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    var noteFondamental = scaleNotesValues[index];

    var chordNotesStr = "";
    chordValues.forEach(function (intervalValue)
    {
      newNoteValue = addToNoteValue(noteFondamental, intervalValue);
      noteName = notesDict[newNoteValue];
      chordNotesStr = chordNotesStr.concat(noteName + ",&nbsp;")
    });
    chordNotesStr = chordNotesStr.slice(0, -7);

    chordsResult = chordsResult.concat("<div class=\"table-body-cell\">");
    chordsResult = chordsResult.concat(chordNotesStr);
    chordsResult = chordsResult.concat("</div>");
  });
  chordsResult = chordsResult.concat("</div>");

  // chords intervals
  chordsResult = chordsResult.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    //var noteFondamental = scaleNotesValues[index];

    var chordIntervalsStr = "";
    chordValues.forEach(function (intervalValue)
    {
      intervalName = intervalsDict[intervalValue];
      if (intervalName == "T")
        intervalName = "F";

      chordIntervalsStr = chordIntervalsStr.concat(intervalName + ",&nbsp;")
    });
    chordIntervalsStr = chordIntervalsStr.slice(0, -7);

    chordsResult = chordsResult.concat("<div class=\"table-body-cell\">");
    chordsResult = chordsResult.concat(chordIntervalsStr);
    chordsResult = chordsResult.concat("</div>");
  });
  chordsResult = chordsResult.concat("</div>");

  chordsResult = chordsResult.concat("</div>");
  document.getElementById('chords_result').innerHTML = chordsResult;
}
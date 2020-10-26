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
  // get selected note value
  var noteValue = getSelectedNoteValue();
  
  // get selected scale and mode
  /*scaleSelected = document.getElementById("scale").value;
  var scaleMode = scaleSelected.split(",");
  var scaleName = scaleMode[0];
  var modeValue = parseInt(scaleMode[1]);
  var scaleFamily = scaleFamiliesDict[scaleName];*/
  var scaleValues = getSelectedScaleValues();

  var nbNotesInScale = scaleValues.length;
  
  // build scale notes list
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  document.getElementById('scale_result').innerHTML = getScaleNotesTable(noteValue, scaleValues);

  // build chords 3,4 notes harmonization tables
  document.getElementById('chords3_result').innerHTML = (nbNotesInScale >= 6) ? getChordsTable(scaleValues, scaleNotesValues, 3) : "";
  document.getElementById('chords4_result').innerHTML = (nbNotesInScale >= 7) ? getChordsTable(scaleValues, scaleNotesValues, 4) : "";
}
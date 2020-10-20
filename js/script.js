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

  var nbNotesInScale = scaleFamily.length;
  
  // build scale notes list
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  document.getElementById('scale_result').innerHTML = getScaleNotes(noteValue, scaleValues);

  // build chords 3,4 notes harmonization tables
  document.getElementById('chords3_result').innerHTML = getChordsTable(scaleValues, scaleNotesValues, 3);
  document.getElementById('chords4_result').innerHTML = getChordsTable(scaleValues, scaleNotesValues, 4);
}
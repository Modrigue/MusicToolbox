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
  // get selected note and scale/mode values
  var noteValue = getSelectedNoteValue();
  var scaleValues = getSelectedScaleValues();
  var charIntervals = getSelectedScaleCharIntervals();

  var nbNotesInScale = scaleValues.length;
  
  // build scale notes list
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  document.getElementById('scale_result').innerHTML = getScaleNotesTable(noteValue, scaleValues, charIntervals);

  // build chords 3,4 notes harmonization tables
  document.getElementById('chords3_result').innerHTML = (nbNotesInScale >= 6) ? getChordsTable(scaleValues, scaleNotesValues, 3) : "";
  document.getElementById('chords4_result').innerHTML = (nbNotesInScale >= 7) ? getChordsTable(scaleValues, scaleNotesValues, 4) : "";

  // update fretboard
  updateFretboard(noteValue, scaleValues, charIntervals);
  updateFretboard(noteValue, scaleValues, charIntervals); // HACK to ensure correct drawing
}

function onResize()
{
    canvas = document.getElementById("canvas_guitar");
    canvas.width = window.innerWidth - 30;
    //updateFretboardFromTonality();
    onNoteChanged();
}

function toggleDisplay(id)
{
  var x = document.getElementById(id);
  
  if (x.style.display === "none")
    x.style.display = "block";
  else
    x.style.display = "none";
}
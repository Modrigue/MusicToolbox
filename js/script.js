////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors()
{
  var noteSelect = document.getElementById('note');
  var initialized = (noteSelect.options != null && noteSelect.options.length > 0);

  // get selected culture
  var lang = getSelectedCulture(); 
  var notesDict = notesDicts[lang];

  // fill note selector
  if (!initialized)
  {
    // init
    for (var key in notesDict)
    {
      var option = document.createElement('option');
      option.value = key;
      option.innerHTML = notesDict[key];
      if (key == 3) // C
        option.selected = true;
      noteSelect.appendChild(option);
    }
  }
  else
  {
    // update
    var noteValue = 0;
    for (var key in notesDict)
    {
      noteSelect.options[noteValue].innerHTML = notesDict[key];
      noteValue++;
    }
  }

  // fill scale selector

  var scaleSelect = document.getElementById('scale');
  var initialized = (scaleSelect.options != null && scaleSelect.options.length > 0);

  var regexNbNotes = /(\d+)notes/;

  if (!initialized)
  {
    // init
    for (var key in scalesDict_int)
    {
      var option = document.createElement('option');
      option.value = key;
      var scaleName = getScaleString(key);
      option.innerHTML = scaleName;
      
      // scale to highlight
      if (hightlightScale(key))
        option.classList.add('bolden');

      // notes seperator
      if (key.match(regexNbNotes))
      {
        option.classList.add('bolden');
        option.disabled = true;
      }

      // simple separator
      if (scaleName == "")
        option.disabled = true;

      scaleSelect.appendChild(option);
    }
  }
  else
  {
    // update
    var scaleValue = 0;
    for (var key in scalesDict_int)
    {
      scaleSelect.options[scaleValue].innerHTML = getScaleString(key);
      scaleValue++;
    }
  }
}

// get selected text from selector
function getSelectorText(id)
{
  var selector = document.getElementById(id);
  var selectedIndex = selector.selectedIndex;
  return selector.options[selectedIndex].text;
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
  // get selected note and scale/mode values
  var noteValue = getSelectedNoteValue();
  var scaleValues = getSelectedScaleValues();
  var charIntervals = getSelectedScaleCharIntervals();

  var nbNotesInScale = scaleValues.length;
  
  // build scale notes list
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  document.getElementById('scale_result').innerHTML = getScaleNotesTable(noteValue, scaleValues, charIntervals);

  // build chords 3,4 notes harmonization tables
  var showChords3 = (nbNotesInScale >= 6);
  var showChords4 = (nbNotesInScale >= 7);
  document.getElementById('chords3_result').innerHTML = showChords3 ? getChordsTable(scaleValues, scaleNotesValues, 3) : "";
  document.getElementById('chords4_result').innerHTML = showChords4 ? getChordsTable(scaleValues, scaleNotesValues, 4) : "";

  // checkboxes
  //setEnabledStatus("checkboxChords3", showChords3);
  //setEnabledStatus("checkboxChords4", showChords4);
  setEnabledStatus("checkboxChords", showChords3);

  // update fretboard
  updateFretboard(noteValue, scaleValues, charIntervals);
  updateFretboard(noteValue, scaleValues, charIntervals); // HACK to ensure correct drawing

  // update keyboard
  updateKeyboard(noteValue, scaleValues, charIntervals);
  updateKeyboard(noteValue, scaleValues, charIntervals); // HACK to ensure correct drawing
}

function onResize()
{
    var canvasGuitar = document.getElementById("canvas_guitar");
    canvasGuitar.width = window.innerWidth - 30;
    //updateFretboardFromTonality();

    var canvasKeyboard = document.getElementById("canvas_keyboard");
    canvasKeyboard.width = window.innerWidth - 30;
    //updateKeyboardFromTonality();

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

function setEnabledStatus(id, status)
{
  var x = document.getElementById(id);
  x.disabled = !status;
}

function getSelectedCulture()
{
  var checkboxLanguage = document.getElementById("checkboxLanguage");
  var culture = checkboxLanguage.checked ? "fr" : "int";
  return culture;
}

function updateLanguage()
{
  var culture = getSelectedCulture();

  var textSelectKey = document.getElementById("select_key_text");
  textSelectKey.innerText = getString("select_key");

  // update checkboxes
  var checkboxChordsLabel = document.getElementById("checkboxChordsLabel");
  checkboxChordsLabel.innerText = getString("chords");
  var checkboxGuitarLabel = document.getElementById("checkboxGuitarLabel");
  checkboxGuitarLabel.innerText = getString("guitar");
  var checkboxKeyboardLabel = document.getElementById("checkboxKeyboardLabel");
  checkboxKeyboardLabel.innerText = getString("keyboard");

  // update computed data
  updateSelectors();
  onNoteChanged();
}
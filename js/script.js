////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors()
{
  const noteSelect = document.getElementById('note');
  let initialized = (noteSelect.options != null && noteSelect.options.length > 0);

  // get selected culture
  const lang = getSelectedCulture(); 
  const notesDict = notesDicts[lang];

  // fill note selector
  if (!initialized)
  {
    // init
    for (const key in notesDict)
    {
      let option = document.createElement('option');
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
    let noteValue = 0;
    for (const key in notesDict)
    {
      noteSelect.options[noteValue].innerHTML = notesDict[key];
      noteValue++;
    }
  }

  // fill scale selector

  const scaleSelect = document.getElementById('scale');
  initialized = (scaleSelect.options != null && scaleSelect.options.length > 0);

  const regexNbNotes = /(\d+)notes/;

  if (!initialized)
  {
    // init
    for (const key in scalesDict_int)
    {
      let option = document.createElement('option');
      option.value = key;
      const scaleName = getScaleString(key);
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
    let scaleValue = 0;
    for (const key in scalesDict_int)
    {
      scaleSelect.options[scaleValue].innerHTML = getScaleString(key);
      scaleValue++;
    }
  }
}

// get selected text from selector
function getSelectorText(id)
{
  const selector = document.getElementById(id);
  const selectedIndex = selector.selectedIndex;
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
  const noteValue = getSelectedNoteValue();
  const scaleValues = getSelectedScaleValues();
  const charIntervals = getSelectedScaleCharIntervals();

  const nbNotesInScale = scaleValues.length;
  
  // build scale notes list
  const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  document.getElementById('scale_result').innerHTML = getScaleNotesTable(noteValue, scaleValues, charIntervals);

  // build chords 3,4 notes harmonization tables
  const showChords3 = (nbNotesInScale >= 6);
  const showChords4 = (nbNotesInScale >= 7);
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
    let canvasGuitar = document.getElementById("canvas_guitar");
    canvasGuitar.width = window.innerWidth - 30;
    //updateFretboardFromTonality();

    let canvasKeyboard = document.getElementById("canvas_keyboard");
    canvasKeyboard.width = window.innerWidth - 30;
    //updateKeyboardFromTonality();

    onNoteChanged();
}

function toggleDisplay(id)
{
  let x = document.getElementById(id);
  
  if (x.style.display === "none")
    x.style.display = "block";
  else
    x.style.display = "none";
}

function setEnabledStatus(id, status)
{
  let x = document.getElementById(id);
  x.disabled = !status;
}

function getSelectedCulture()
{
  const checkboxLanguage = document.getElementById("checkboxLanguage");
  const culture = checkboxLanguage.checked ? "fr" : "int";
  return culture;
}

function updateLanguage()
{
  const culture = getSelectedCulture();

  let textSelectKey = document.getElementById("select_key_text");
  textSelectKey.innerText = getString("select_key");

  let headerTitle = document.getElementById("header_title");
  headerTitle.innerText = getString("header_title");

  // update checkboxes
  let checkboxChordsLabel = document.getElementById("checkboxChordsLabel");
  checkboxChordsLabel.innerText = getString("chords");
  let checkboxGuitarLabel = document.getElementById("checkboxGuitarLabel");
  checkboxGuitarLabel.innerText = getString("guitar");
  let checkboxKeyboardLabel = document.getElementById("checkboxKeyboardLabel");
  checkboxKeyboardLabel.innerText = getString("keyboard");

  // update computed data
  updateSelectors();
  onNoteChanged();
}
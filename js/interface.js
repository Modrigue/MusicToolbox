function initLanguage()
{
  const defaultLang = parseCultureParameter();
  const checkboxLanguage = document.getElementById('checkboxLanguage');

  checkboxLanguage.checked = (defaultLang == "fr");

  document.title = getString("title"); // force update
}


////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors()
{
  // get selected culture
  const lang = getSelectedCulture();

  // update page selector

  const pageSelect = document.getElementById('page');
  let initialized = (pageSelect.options != null && pageSelect.options.length > 0);
  const pagesArray = ["page_scale_explorer"/*, "page_scale_finder"*/];

  // fill page selector
  if (!initialized)
  {
    // init
    for (const key of pagesArray)
    {
      let option = document.createElement('option');
      option.value = key;
      option.innerHTML = getString(key);
      if (key == "page_scale_explorer") // default
        option.selected = true;
      pageSelect.appendChild(option);
    }
  }
  else
  {
    // update
    let indexPage = 0;
    for (const key of pagesArray)
    {
      pageSelect.options[indexPage].innerHTML = getString(key);
      indexPage++;
    }
  }
  
  // update note selector
  updateNoteSelector('note', 3, false);

  // fill scale selector

  const scaleSelect = document.getElementById('scale');
  initialized = (scaleSelect.options != null && scaleSelect.options.length > 0);
  const regexNbNotes = /(\d+)notes/;

  let defaultScaleId = "7major_nat,1";
  
  const scaleParamValue = parseScaleParameter();
  if (scaleParamValue != "")
    defaultScaleId = scaleParamValue;

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

      // default scale
      if (key == defaultScaleId)
        option.selected = true;

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

function selectNoteAndScale(scaleId)
{
  const scaleAttributes = scaleId.split("|");
  const tonicValue = parseInt(scaleAttributes[0]);
  const scaleKey = scaleAttributes[1];

  const noteSelect = document.getElementById('note');
  const scaleSelect = document.getElementById('scale');

  // select note and scale
  noteSelect.selectedIndex = tonicValue;
  scaleSelect.selectedIndex = getSelectorIndexFromValue(scaleSelect, scaleKey);
  update();
}

function onPageChanged()
{
  update();
}

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
  // get selected page
  const pageSelected = document.getElementById("page").value;
  const pagesArray = ["page_scale_explorer", "page_scale_finder"];
  for (let pageId of pagesArray)
    setVisible(pageId, (pageId == pageSelected));

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

  // update relative scales
  document.getElementById('relative_scales').innerHTML = getRelativeScalesHTML(noteValue, scaleValues);
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

function setVisible(id, status)
{
  let x = document.getElementById(id);
  x.style.display = status ? "block" : "none";
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
  document.title = getString("title");

  let textSelectKey = document.getElementById("select_key_text");
  textSelectKey.innerText = getString("select_key");

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

function getSelectorIndexFromValue(selector, value)
{
  const options = selector.options;
  const nbOptions = options.length;

  let index = -1;
  for(index = 0; index < nbOptions; index++)
  {
    if(options[index].value === value)
      return index;
  }

  return index;
}
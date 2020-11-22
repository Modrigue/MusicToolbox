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
    const pagesArray = ["page_scale_explorer", "page_scale_finder", "page_chord_explorer"];

    // fill page selector
    if (!initialized)
    {
        const chord = parseParameterById("chord");
        const chordSpecified = (chord != null && chord != "");
        const defaultPage = chordSpecified ? "page_chord_explorer" : "page_scale_explorer";

        // init
        for (const key of pagesArray)
        {
          let option = document.createElement('option');
          option.value = key;
          option.innerHTML = getString(key);
          if (key == defaultPage) // default
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
  
    // update scale explorer selectors
    updateNoteSelector('note', 3, false);
    updateScaleSelector('scale', "7major_nat,1");

    // update scale finder selectors
    for (let i = 1; i <= 8; i++)
    {
        const id = i.toString();
        updateNoteSelector('note_finder' + id, -1, true);   
        initChordSelector('chord_finder' + id, -1, true);   
    }
    updateNoteSelector('note_finder_tonic', -1, true); 
    
    // update chord explorer selectors
    updateNoteSelector('note_explorer_chord', 3, false);
    initChordSelector('chord_explorer_chord', "M", false); 
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
    update();
}

function onScaleChanged()
{
    update();
}

// compute and update results
function update()
{
    // get selected page
    const pageSelected = document.getElementById("page").value;
    const pagesArray = ["page_scale_explorer", "page_scale_finder", "page_chord_explorer"];
    for (let pageId of pagesArray)
        setVisible(pageId, (pageId == pageSelected));

    // get selected note and scale/mode values
    const noteValue = getSelectedNoteValue();
    const scaleValues = getSelectedScaleValues();
    const charIntervals = getSelectedScaleCharIntervals();

    const nbNotesInScale = scaleValues.length;
    
    // build scale notes list
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    document.getElementById('scale_result').innerHTML = getScaleNotesTableHTML(noteValue, scaleValues, charIntervals);

    // build chords 3,4 notes harmonization tables
    const showChords3 = (nbNotesInScale >= 6);
    const showChords4 = (nbNotesInScale >= 7);
    document.getElementById('chords3_result').innerHTML = showChords3 ? getChordsTableHTML(scaleValues, scaleNotesValues, 3) : "";
    document.getElementById('chords4_result').innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, 4) : "";

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

    // update scale finder chords selectors
    let has1NoteSelected = false;
    for (let i = 1; i <= 8; i++)
    {
        const id = i.toString();

        const noteSelected = document.getElementById('note_finder' + id).value;
        const noteValue = parseInt(noteSelected);
        const hasNoteSelected = (noteValue >= 0);

        if (!hasNoteSelected)
            document.getElementById('chord_finder' + id).selectedIndex = 0;
        else
            has1NoteSelected = true;

        setEnabledStatus('chord_finder' + id, hasNoteSelected);
    }
    setEnabledStatus('reset_scale_finder', has1NoteSelected);

    // update found scales given selected page
    const foundScales = document.getElementById('found_scales');
    switch (pageSelected) 
    {
        case "page_scale_explorer":
            foundScales.innerHTML = getRelativeScalesHTML(noteValue, scaleValues);
            setVisible('found_scales', true);
            break;

        case "page_scale_finder":
            foundScales.innerHTML = findScalesFromNotesHTML();
            setVisible('found_scales', true);
            break;

        case "page_chord_explorer":
            updateChordDecomposedNotes();
            updateGeneratedChordsOnFretboard();
            setVisible('found_scales', false);
            break;
    }
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

    let headerScaleFinder = document.getElementById("header_scale_finder");
    headerScaleFinder.innerText = getString("header_scale_finder");

    let headerChordExplorer = document.getElementById("header_chord_explorer");
    headerChordExplorer.innerText = getString("header_chord_explorer");

    let resetElements = document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");

    let tonicElements = document.getElementsByClassName("tonic");
    for (let tonicEelem of tonicElements)
        tonicEelem.innerText = getString("tonic");

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
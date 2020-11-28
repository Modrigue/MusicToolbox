const pagesArray = ["page_scale_explorer", "page_scale_finder", "page_chord_explorer"];
let pageSelected = "";

function initLanguage()
{
  const defaultLang = parseCultureParameter();
  const checkboxLanguage = document.getElementById('checkboxLanguage');

  checkboxLanguage.checked = (defaultLang == "fr");

  document.title = getString("title"); // force update

  updateLocales();
}

////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors()
{
    // get selected culture
    const lang = getSelectedCulture();
  
    // update scale explorer selectors
    updateNoteSelector('note', 3, false);
    updateScaleSelector('scale', "7major_nat,1");

    // update scale finder selectors
    for (let i = 1; i <= 8; i++)
    {
        const id = i.toString();
        updateNoteSelector(`note_finder${id}`, -1, true);   
        initChordSelector(`chord_finder${id}`, -1, true);   
    }
    updateNoteSelector('note_finder_tonic', -1, true); 
    
    // update chord explorer selectors
    updateNoteSelector('note_explorer_chord', 3, false);
    initChordSelector('chord_explorer_chord', "M", false);
    updateNbStringsSelector();
    for (let i = 1; i <= 5; i++)
        updateNoteSelector(`chord_explorer_note${i}`, -1, true);
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

function initPagefromURLParams()
{
    // parse URL parameters
    const chordParam = parseParameterById("chord");
    const scaleParam = parseParameterById("scale");
    const chordSpecified = (chordParam != null && chordParam != "");
    const scaleSpecified = (scaleParam != null && scaleParam != "");

    let specifiedPage = "";
    if (scaleSpecified)
        specifiedPage = "page_scale_explorer";
    else if (chordSpecified)
        specifiedPage = "page_chord_explorer";

    selectPage(specifiedPage);
}

function selectPage(pageId = "")
{
   for (let id of pagesArray)
    {
        let button = document.getElementById(`button_${id}`);
        const buttonSelected = (id == pageId);
        button.className = buttonSelected ? "button-page-selected" :  "button-page";
    }
    pageSelected = pageId;

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
    // display selected page
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
    //setEnabled("checkboxChords3", showChords3);
    //setEnabled("checkboxChords4", showChords4);
    setEnabled("checkboxChords", showChords3);

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

        const noteSelected = document.getElementById(`note_finder${id}`).value;
        const noteValue = parseInt(noteSelected);
        const hasNoteSelected = (noteValue >= 0);

        if (!hasNoteSelected)
            document.getElementById(`chord_finder${id}`).selectedIndex = 0;
        else
            has1NoteSelected = true;

        setEnabled(`chord_finder${id}`, hasNoteSelected);
    }
    setEnabled('reset_scale_finder', has1NoteSelected);
    setEnabled('note_finder_tonic', has1NoteSelected);
    if (!has1NoteSelected)
        document.getElementById("note_finder_tonic").selectedIndex = 0;

    // hide welcome page
    if (pageSelected != null && pageSelected != "")
        setVisible('page_welcome', false);

    // update found scales given selected page
    const foundScales = document.getElementById('found_scales');
    const foundChordsFromScale = document.getElementById('section_found_chords_from_scale');
    switch (pageSelected) 
    {
        case "page_scale_explorer":
            foundScales.innerHTML = getRelativeScalesHTML(noteValue, scaleValues);
            foundChordsFromScale.innerHTML = findChordsFromScaleScalesHTML(noteValue, scaleValues);
            setVisible('found_scales', true);
            setVisible("section_found_chords_from_scale", true);
            break;

        case "page_scale_finder":
            foundScales.innerHTML = findScalesFromNotesHTML();
            setVisible('found_scales', true);
            setVisible("section_found_chords_from_scale", false);
            break;

        case "page_chord_explorer":
        {
            const checkboxBarres = document.getElementById("checkboxBarres");
            
            updateChordGeneratorMode();
            updateNbStringsSelector();
            updateFoundChordElements();
            updateGeneratedChordsOnFretboard(checkboxBarres.checked);

            setVisible('found_scales', false);
            setVisible("section_found_chords_from_scale", false);
            break;
        }
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

function setEnabled(id, status)
{
    let x = document.getElementById(id);
    x.disabled = !status;
}


//////////////////////////////////// LOCALES //////////////////////////////////


function getSelectedCulture()
{
    const checkboxLanguage = document.getElementById("checkboxLanguage");
    const culture = checkboxLanguage.checked ? "fr" : "int";
    return culture;
}

function updateLocales()
{
    document.title = getString("title");

    // pages buttons
    document.getElementById("button_page_chord_explorer").innerText = getString("page_chord_explorer");
    document.getElementById("button_page_scale_explorer").innerText = getString("page_scale_explorer");
    document.getElementById("button_page_scale_finder").innerText = getString("page_scale_finder");

    // welcome
    document.getElementById("welcome_title").innerText = getString("welcome_title");
    document.getElementById("welcome_subtitle").innerText = getString("welcome_subtitle");

    // scale explorer
    document.getElementById("select_key_text").innerText = getString("select_key");
    document.getElementById("header_scale_finder").innerText = getString("header_scale_finder");
    document.getElementById("checkboxChordsLabel").innerText = getString("chords");
    document.getElementById("checkboxGuitarLabel").innerText = getString("guitar");
    document.getElementById("checkboxKeyboardLabel").innerText = getString("keyboard");
    document.getElementById("checkboxBarresLabel").innerText = getString("show_barres");

    // scale finder

    let resetElements = document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");

    let tonicElements = document.getElementsByClassName("tonic");
    for (let tonicEelem of tonicElements)
        tonicEelem.innerText = getString("tonic");

    // chord explorer
    document.getElementById("radioChordExplorerNameLabel").innerText = getString("name");
    document.getElementById("radioChordExplorerNotesLabel").innerText = getString("notes");
    document.getElementById("play_found_chord").innerText = `${getString("play")} ♪`;
    document.getElementById("play_found_arpeggio").innerText = `${getString("play_arpeggio")} ♪`;
    document.getElementById("chord_explorer_nb_strings_text").innerText = getString("chord_explorer_nb_strings_text");
    
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
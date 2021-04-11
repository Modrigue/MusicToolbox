const pagesArray: Array<string> = ["page_scale_explorer", "page_scale_finder", "page_chord_explorer"];
let pageSelected: string = "";


///////////////////////////////// INITIALIZATION //////////////////////////////

window.onload = function()
{
    // test chord positions finder algorithms
    //testGenerateChordPositions();
    //testChordPositionsLog();

    // add events callbacks to HTML elements

    initializePlay();

    window.addEventListener("resize", onResize);
    //document.body.addEventListener("resize", onResize); // not working?

    // header
    (<HTMLButtonElement>document.getElementById("button_page_chord_explorer")).addEventListener("click", () => { selectPage("page_chord_explorer"); });
    (<HTMLButtonElement>document.getElementById("button_page_scale_explorer")).addEventListener("click", () => { selectPage("page_scale_explorer"); });
    (<HTMLButtonElement>document.getElementById("button_page_scale_finder")).addEventListener("click", () => selectPage("page_scale_finder"));
    (<HTMLButtonElement>document.getElementById("checkboxLanguage")).addEventListener("change", updateLocales);

    // scale explorer
    (<HTMLSelectElement>document.getElementById("note")).addEventListener("change", onNoteChanged);
    (<HTMLSelectElement>document.getElementById("scale")).addEventListener("change", onScaleChanged);
    (<HTMLInputElement>document.getElementById("checkboxChords")).addEventListener("change", () => { toggleDisplay('chords3_result');toggleDisplay('chords4_result'); });
    (<HTMLInputElement>document.getElementById("checkboxGuitar")).addEventListener("change", () => toggleDisplay('scale_explorer_guitar_display'));
    (<HTMLInputElement>document.getElementById("checkboxKeyboard")).addEventListener("change", () => toggleDisplay('canvas_keyboard'));
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('scale_explorer'));
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_tuning")).addEventListener("change", update);

    // scale finder
    for (let i = 1; i <= 8; i++)
    {
        const id: string = i.toString();
        (<HTMLSelectElement>document.getElementById(`note_finder${id}`)).addEventListener("change", update);
        (<HTMLSelectElement>document.getElementById(`chord_finder${id}`)).addEventListener("change", update);
    }
    (<HTMLSelectElement>document.getElementById('note_finder_tonic')).addEventListener("change", update);
    (<HTMLButtonElement>document.getElementById('reset_scale_finder')).addEventListener("click", resetScaleFinder);

    // chord explorer
    (<HTMLSelectElement>document.getElementById('note_explorer_chord')).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById('chord_explorer_chord')).addEventListener("change", update);
    for (let i = 1; i <= 6; i++)
    {
        const id: string = i.toString();
        (<HTMLSelectElement>document.getElementById(`chord_explorer_note${id}`)).addEventListener("change", update);
    }
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('chord_explorer'));
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_tuning")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxBarres")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("chord_explorer_nb_strings_max")).addEventListener("change", update);
}

function initLanguage(): void
{
  const defaultLang: string = <string>parseCultureParameter();
  const checkboxLanguage: HTMLInputElement = <HTMLInputElement>document.getElementById('checkboxLanguage');

  checkboxLanguage.checked = (defaultLang == "fr");

  document.title = getString("title"); // force update

  updateLocales();
}

////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors(): void
{
    // get selected culture
    const lang: string = getSelectedCulture();
  
    // update scale explorer selectors
    updateNoteSelector('note', 3, false);
    updateScaleSelector('scale', "7major_nat,1");
    initGuitarNbStringsSelector('scale_explorer_guitar_nb_strings');
    initGuitarTuningSelector('scale_explorer_guitar_tuning');

    // update scale finder selectors
    for (let i = 1; i <= 8; i++)
    {
        const id: string = i.toString();
        updateNoteSelector(`note_finder${id}`, -1, true);   
        initChordSelector(`chord_finder${id}`, "-1", true);   
    }
    updateNoteSelector('note_finder_tonic', -1, true); 
    
    // update chord explorer selectors
    updateNoteSelector('note_explorer_chord', 3, false);
    initChordSelector('chord_explorer_chord', "M", false);
    initGuitarNbStringsSelector('chord_explorer_guitar_nb_strings');
    initGuitarTuningSelector('chord_explorer_guitar_tuning');
    updateNbStringsForChordSelector();
    for (let i = 1; i <= 6; i++)
        updateNoteSelector(`chord_explorer_note${i}`, -1, true);
}

// get selected text from selector
function getSelectorText(id: string): string
{
    const selector: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const selectedIndex: number = selector.selectedIndex;
    return selector.options[selectedIndex].text;
}


//////////////////////////////////// EVENTS ///////////////////////////////////

function selectNoteAndScale(scaleId: string): void
{
    const scaleAttributes: Array<string> = scaleId.split("|");
    const tonicValue: number = parseInt(scaleAttributes[0]);
    const scaleKey: string = scaleAttributes[1];

    const noteSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('note');
    const scaleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('scale');

    // select note and scale
    noteSelect.selectedIndex = tonicValue;
    scaleSelect.selectedIndex = getSelectorIndexFromValue(scaleSelect, scaleKey);
    update();
}

function initPagefromURLParams(): void
{
    // parse URL parameters
    const chordParam: string = parseParameterById("chord");
    const scaleParam: string = parseParameterById("scale");
    const chordSpecified: boolean = (chordParam != null && chordParam != "");
    const scaleSpecified: boolean = (scaleParam != null && scaleParam != "");

    let specifiedPage: string = "";
    if (scaleSpecified)
        specifiedPage = "page_scale_explorer";
    else if (chordSpecified)
        specifiedPage = "page_chord_explorer";

    selectPage(specifiedPage);
}

function selectPage(pageId: string = ""): void
{
   for (let id of pagesArray)
    {
        let button: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`button_${id}`);
        const buttonSelected: boolean = (id == pageId);
        button.className = buttonSelected ? "button-page-selected" :  "button-page";
    }
    pageSelected = pageId;

    update();
}

function onNoteChanged(): void
{
    update();
}

function onScaleChanged(): void
{
    update();
}

function onNbStringsChanged(id: string): void
{
    let nbStrings: number = -1;

    // update corresponding guitar tuning selector
    nbStrings = getSelectedGuitarNbStrings(`${id}_guitar_nb_strings`);
    updateGuitarTuningGivenNbStrings(`${id}_guitar_tuning`, nbStrings);

    update();
}

// compute and update results
function update(): void
{
    // display selected page
    for (let pageId of pagesArray)
        setVisible(pageId, (pageId == pageSelected));

    // get selected note and scale/mode values
    const noteValue: number = getSelectedNoteValue();
    const scaleValues: Array<number> = getSelectedScaleValues();
    const charIntervals: Array<number> = getSelectedScaleCharIntervals();

    const nbNotesInScale: number = scaleValues.length;
    const isMicrotonal: boolean = isMicrotonalScale(scaleValues);
    
    // build scale notes list
    const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValues);
    (<HTMLParagraphElement>document.getElementById('scale_result')).innerHTML = getScaleNotesTableHTML(noteValue, scaleValues, charIntervals);

    // build chords 3,4 notes harmonization tables
    const showChords3 = (nbNotesInScale >= 6 && !isMicrotonal);
    const showChords4 = (nbNotesInScale >= 7 && !isMicrotonal);
    (<HTMLParagraphElement>document.getElementById('chords3_result')).innerHTML = showChords3 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3) : "";
    (<HTMLParagraphElement>document.getElementById('chords4_result')).innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 4) : "";

    const scaleName: string = getSelectorText("scale");

    // checkboxes
    //setEnabled("checkboxChords3", showChords3);
    //setEnabled("checkboxChords4", showChords4);
    setEnabled("checkboxChords", showChords3);

    // update fretboard
    updateFretboard(noteValue, scaleValues, charIntervals, scaleName);
    updateFretboard(noteValue, scaleValues, charIntervals, scaleName); // HACK to ensure correct drawing

    // update keyboard
    updateKeyboard(noteValue, scaleValues, charIntervals, scaleName);
    updateKeyboard(noteValue, scaleValues, charIntervals, scaleName); // HACK to ensure correct drawing

    // update scale finder chords selectors
    let has1NoteSelected: boolean = false;
    for (let i = 1; i <= 8; i++)
    {
        const id = i.toString();

        const noteSelected: string = (<HTMLSelectElement>document.getElementById(`note_finder${id}`)).value;
        const noteValue: number = parseInt(noteSelected);
        const hasNoteSelected: boolean = (noteValue >= 0);

        if (!hasNoteSelected)
            (<HTMLSelectElement>document.getElementById(`chord_finder${id}`)).selectedIndex = 0;
        else
            has1NoteSelected = true;

        setEnabled(`chord_finder${id}`, hasNoteSelected);
    }
    setEnabled('reset_scale_finder', has1NoteSelected);
    setEnabled('note_finder_tonic', has1NoteSelected);
    if (!has1NoteSelected)
        (<HTMLSelectElement>document.getElementById("note_finder_tonic")).selectedIndex = 0;

    // hide welcome page
    if (pageSelected != null && pageSelected != "")
        setVisible('page_welcome', false);

    // update found scales given selected page
    const foundScales: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('found_scales');
    const negativeScale: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('negative_scale');
    const foundChordsFromScale: HTMLDivElement = <HTMLDivElement>document.getElementById('section_found_chords_from_scale');
    switch (pageSelected) 
    {
        case "page_scale_explorer":
            foundScales.innerHTML = getRelativeScalesHTML(noteValue, scaleValues);
            negativeScale.innerHTML = getNegativeScaleHTML(noteValue, scaleValues);
            foundChordsFromScale.innerHTML = findChordsFromScaleScalesHTML(noteValue, scaleValues, charIntervals);
            setVisible('found_scales', true);
            setVisible('negative_scale', true);
            setVisible("section_found_chords_from_scale", !isMicrotonal);

            setEnabled("checkboxGuitar", !isMicrotonal);
            setEnabled("checkboxKeyboard", !isMicrotonal);

            const checkboxGuitar = (<HTMLInputElement>document.getElementById("checkboxGuitar"));
            const checkboxKeyboard = (<HTMLInputElement>document.getElementById("checkboxKeyboard"));
            setVisible("scale_explorer_guitar_display", checkboxGuitar.checked && !isMicrotonal);
            setVisible("canvas_keyboard", checkboxKeyboard.checked && !isMicrotonal);

            break;

        case "page_scale_finder":
            foundScales.innerHTML = findScalesFromNotesHTML();
            setVisible('found_scales', true);
            setVisible('negative_scale', false);
            setVisible("section_found_chords_from_scale", false);
            break;

        case "page_chord_explorer":
        {
            const checkboxBarres: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxBarres");
            
            updateChordGeneratorMode();
            updateChordSelectorGivenNbStrings('chord_explorer_chord');
            updateNbStringsForChordSelector();
            updateFoundChordElements();
            updateGeneratedChordsOnFretboard(checkboxBarres.checked);

            setVisible('found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords_from_scale", false);
            break;
        }
    }
}

function onResize(): void
{
    let canvasGuitar: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas_guitar");
    canvasGuitar.width = window.innerWidth - 30;

    let canvasKeyboard: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas_keyboard");
    canvasKeyboard.width = window.innerWidth - 30;

    onNoteChanged();
}

function toggleDisplay(id: string): void
{
    let elem: HTMLElement = <HTMLElement>document.getElementById(id);
    
    if (elem.style.display === "none")
        elem.style.display = "block";
    else
        elem.style.display = "none";
}

function setVisible(id: string, status: boolean): void
{
    let elem: HTMLElement = <HTMLElement>document.getElementById(id);
    elem.style.display = status ? "block" : "none";
}

function setEnabled(id: string, status: boolean): void
{
    let elem: any = document.getElementById(id);
    elem.disabled = !status;
}

function updateChordGeneratorMode(): void
{
    // get selected mode
    let selectedMode: string = getSelectedChordGeneratorMode();
    const nameMode: boolean = (selectedMode == "name");

    // get select nb. of strings
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');
    
    // name mode
    setEnabled("note_explorer_chord", nameMode);
    setEnabled("chord_explorer_chord", nameMode);
    setEnabled("chord_explorer_arpeggio_notes", nameMode);
    setEnabled("chord_explorer_arpeggio_intervals", nameMode);
    setVisible("chord_explorer_arpeggio_texts", nameMode);

    // notes mode
    setVisible("chord_explorer_found_chords_texts", !nameMode);
    for (let i = 1; i <= 6; i++)
    {
        const enableSelector: boolean = !nameMode && (i <= nbStrings);
        setEnabled(`chord_explorer_note${i}`, enableSelector);

        // if note index exceeds nb. of strings, reset note
        if (i > nbStrings)
        {
            let noteSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`chord_explorer_note${i}`);
            noteSelect.selectedIndex = 0;
        }
    }
}

function resetScaleFinder(): void
{
    // reset scale finder note selectors
    for (let i = 1; i <= 8; i++)
    {
        const id = i.toString();
        let noteSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`note_finder${id}`);
        noteSelect.selectedIndex = 0;
    }

    let noteSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('note_finder_tonic');
    noteSelect.selectedIndex = 0;

    update();
}

//////////////////////////////////// LOCALES //////////////////////////////////


function updateLocales(): void
{
    document.title = getString("title");

    // pages buttons
    (<HTMLButtonElement>document.getElementById("button_page_chord_explorer")).innerText = getString("page_chord_explorer");
    (<HTMLButtonElement>document.getElementById("button_page_scale_explorer")).innerText = getString("page_scale_explorer");
    (<HTMLButtonElement>document.getElementById("button_page_scale_finder")).innerText = getString("page_scale_finder");

    // welcome
    (<HTMLHeadElement>document.getElementById("welcome_title")).innerText = getString("welcome_title");
    (<HTMLHeadElement>document.getElementById("welcome_subtitle")).innerText = getString("welcome_subtitle");

    // scale explorer
    (<HTMLSpanElement>document.getElementById("select_key_text")).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById("header_scale_finder")).innerText = getString("header_scale_finder");
    (<HTMLLabelElement>document.getElementById("checkboxChordsLabel")).innerText = getString("chords");
    (<HTMLLabelElement>document.getElementById("checkboxGuitarLabel")).innerText = getString("guitar");
    (<HTMLLabelElement>document.getElementById("checkboxKeyboardLabel")).innerText = getString("keyboard");
    (<HTMLLabelElement>document.getElementById("checkboxBarresLabel")).innerText = getString("show_barres");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_tuning_text")).innerText = getString("tuning");

    // scale finder

    let resetElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");

    let tonicElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("tonic");
    for (let tonicEelem of tonicElements)
        tonicEelem.innerText = getString("tonic");

    // chord explorer
    (<HTMLLabelElement>document.getElementById("radioChordExplorerNameLabel")).innerText = getString("name");
    (<HTMLLabelElement>document.getElementById("radioChordExplorerNotesLabel")).innerText = getString("notes");
    (<HTMLButtonElement>document.getElementById("play_found_chord")).innerText = `${getString("play")} ♪`;
    (<HTMLButtonElement>document.getElementById("play_found_arpeggio")).innerText = `${getString("play_arpeggio")} ♪`;
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_tuning_text")).innerText = getString("tuning");
    (<HTMLSpanElement>document.getElementById("chord_explorer_nb_strings_max_text")).innerText = getString("chord_explorer_nb_strings_max_text");
    
    // update computed data
    updateSelectors();
    onNoteChanged();
}

function getSelectorIndexFromValue(selector: HTMLSelectElement, value: string): number
{
    const options: HTMLOptionsCollection = selector.options;
    const nbOptions: number = options.length;

    let index: number = -1;
    for(index = 0; index < nbOptions; index++)
    {
        if(options[index].value === value)
            return index;
    }

    return index;
}
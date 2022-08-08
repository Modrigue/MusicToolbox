const pagesArray: Array<string> =
    ["page_scale_explorer", "page_scale_finder", "page_chord_explorer", "page_chord_tester", "page_song_generator", "page_scale_keyboard"];
let pageSelected: string = "";


let allInstrumentsLoaded = false;
let nbInstrumentsLoaded = 0;
const nbInstrumentsTotal = 26; // TODO: count files in soudfonts directory


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

    window.addEventListener("newInstrumentLoaded", onNewInstrumentLoaded, false);

    (<HTMLButtonElement>document.getElementById("checkboxLanguage")).addEventListener("change", updateLocales);

    // pages
    for (const page of pagesArray)
        (<HTMLButtonElement>document.getElementById(`button_${page}`)).addEventListener("click", () => selectPage(page));
    
    // scale explorer
    (<HTMLSelectElement>document.getElementById("note")).addEventListener("change", onNoteChanged);
    (<HTMLSelectElement>document.getElementById("scale")).addEventListener("change", onScaleChanged);
    (<HTMLInputElement>document.getElementById("checkboxChords")).addEventListener("change", () => { toggleDisplay('chords3_result');toggleDisplay('chords4_result');toggleDisplay('chordsQ_result');toggleDisplay('section_found_chords') });
    (<HTMLInputElement>document.getElementById("checkboxGuitar")).addEventListener("change", () => toggleDisplay('scale_explorer_guitar_display'));
    (<HTMLInputElement>document.getElementById("checkboxKeyboard")).addEventListener("change", () => toggleDisplay('canvas_keyboard'));
    (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer")).addEventListener("change", updateShowQuarterTonesInScaleExplorer);
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('scale_explorer'));
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_tuning")).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_position")).addEventListener("change", update);

    // scale finder
    for (let i = 1; i <= 8; i++)
    {
        const id: string = i.toString();
        (<HTMLSelectElement>document.getElementById(`note_finder${id}`)).addEventListener("change", update);
        (<HTMLSelectElement>document.getElementById(`chord_finder${id}`)).addEventListener("change", update);
    }
    (<HTMLSelectElement>document.getElementById('note_finder_tonic')).addEventListener("change", update);
    (<HTMLButtonElement>document.getElementById('reset_scale_finder')).addEventListener("click", resetScaleFinder);
    (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleFinder")).addEventListener("change", updateShowQuarterTonesInScaleFinder);

    // chord explorer
    (<HTMLSelectElement>document.getElementById('chord_explorer_fundamental')).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById('chord_explorer_chord')).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById('chord_explorer_bass')).addEventListener("change", update);
    for (let i = 1; i <= 6; i++)
    {
        const id: string = i.toString();
        (<HTMLSelectElement>document.getElementById(`chord_explorer_note${id}`)).addEventListener("change", update);
    }
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('chord_explorer'));
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_tuning")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxBarres")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxEmptyStrings")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("chord_explorer_nb_strings_max")).addEventListener("change", update);

    // chord tester
    (<HTMLInputElement>document.getElementById("checkboxCommonChords")).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById("chord_tester_start_note")).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById("chord_tester_start_octave")).addEventListener("change", update);
    for (let i = 1; i <= 2; i++)
    {
        (<HTMLInputElement>document.getElementById(`checkboxChordTesterKey${i}`)).addEventListener("change", update);
        (<HTMLSelectElement>document.getElementById(`chord_tester_tonic${i}`)).addEventListener("change", update);
        (<HTMLSelectElement>document.getElementById(`chord_tester_scale${i}`)).addEventListener("change", update);      
    }

    // song generator
    setVisible("button_page_song_generator", false); // experimental: disabled for now
    (<HTMLSelectElement>document.getElementById(`song_generator_tonic`)).addEventListener("change", generateNewSong);
    (<HTMLSelectElement>document.getElementById(`song_generator_scale`)).addEventListener("change", generateNewSong);
    (<HTMLSelectElement>document.getElementById(`song_generator_nb_bars`)).addEventListener("change", generateNewSong);
    (<HTMLButtonElement>document.getElementById('song_generator_generate')).addEventListener("click", generateNewSong);
    (<HTMLButtonElement>document.getElementById('song_generator_play')).addEventListener("click", playGeneratedSong);
    (<HTMLButtonElement>document.getElementById('song_generator_reset')).addEventListener("click", resetGeneratedSong);
    for (let i = 1; i <= 2; i++)
        (<HTMLInputElement>document.getElementById(`song_generator_checkbox_track${i}`)).addEventListener("change", updateSongGeneratorPage);

    // scale keyboard
    const selectScaleKeyboardTonic = <HTMLSelectElement>document.getElementById(`scale_keyboard_tonic`);
    const selectScaleKeyboardScale = <HTMLSelectElement>document.getElementById(`scale_keyboard_scale`);
    const selectScaleKeyboardStartOctave = <HTMLSelectElement>document.getElementById(`scale_keyboard_start_octave`);
    const selectInstrumentKeyboardScale = <HTMLSelectElement>document.getElementById(`scale_keyboard_instrument`);
    selectScaleKeyboardTonic.addEventListener("change", () => { selectScaleKeyboardTonic.blur(); update()});
    selectScaleKeyboardScale.addEventListener("change", () => { selectScaleKeyboardScale.blur(); update()});
    selectScaleKeyboardStartOctave.addEventListener("change", () => { selectScaleKeyboardStartOctave.blur(); update()});
    selectInstrumentKeyboardScale.addEventListener("change", () => { selectInstrumentKeyboardScale.blur(); onInstrumentSelected(`scale_keyboard_instrument`)});
}

function initLanguage(): void
{
  const defaultLang: string = <string>parseCultureParameter();
  const checkboxLanguage: HTMLInputElement = <HTMLInputElement>document.getElementById('checkboxLanguage');

  checkboxLanguage.checked = (defaultLang == "fr");

  document.title = getString("title"); // force update

  updateLocales();
}

function initShowQuarterTones(): void
{
  const tonicValue: number = parseNoteParameter();

  const checkboxQuarterTones = <HTMLInputElement>document.getElementById('checkboxQuarterTonesScaleExplorer');
  checkboxQuarterTones.checked = isMicrotonalInterval(tonicValue);

  updateShowQuarterTonesInScaleExplorer();
}

////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors(resetScaleExplorerNotes: boolean = false, resetScaleFinderNotes: boolean = false): void
{
    // show quarter tones?
    const showQuarterTonesInScaleExplorer =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer")).checked;
    const showQuarterTonesInScaleFinder =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleFinder")).checked;
  
    // update scale explorer selectors
    updateNoteSelector('note', 0, false, showQuarterTonesInScaleExplorer, resetScaleExplorerNotes);
    updateScaleSelector('scale', "7major_nat,1", true, true);
    initGuitarNbStringsSelector('scale_explorer_guitar_nb_strings');
    initGuitarTuningSelector('scale_explorer_guitar_tuning');

    // update scale position on guitar selector

    const scaleValues: Array<number> = getScaleValues();
    let nbPositions: number = scaleValues.length;

    // blues scale specific: 5 positions
    const scaleValuesBlues = getScaleValues("6blues,1,diff:5major_penta;5");            
    const isBluesScale = arraysEqual(scaleValues, scaleValuesBlues);
    if (isBluesScale)
        nbPositions = 5;

    initGuitarPositionSelector('scale_explorer_guitar_position', true, nbPositions);

    // update scale finder selectors
    for (let i = 1; i <= 8; i++)
    {
        const id: string = i.toString();
        updateNoteSelector(`note_finder${id}`, -1, true, showQuarterTonesInScaleFinder, resetScaleFinderNotes);   
        initChordSelector(`chord_finder${id}`, "-1", true);   
    }
    updateNoteSelector('note_finder_tonic', -1, true, showQuarterTonesInScaleFinder, resetScaleFinderNotes); 
    
    // update chord explorer selectors
    updateNoteSelector('chord_explorer_fundamental', 0, false);
    initChordSelector('chord_explorer_chord', "M", false);
    updateNoteSelector("chord_explorer_bass", -1, true, false, true);
    initGuitarNbStringsSelector('chord_explorer_guitar_nb_strings');
    initGuitarTuningSelector('chord_explorer_guitar_tuning');
    updateNbStringsForChordSelector();
    for (let i = 1; i <= 6; i++)
        updateNoteSelector(`chord_explorer_note${i}`, -1, true);
    
    // update chord tester selectors
    updateNoteSelector(`chord_tester_start_note`, 0, false);
    updateOctaveSelector(`chord_tester_start_octave`, 0, 4, 2, false);
    for (let i = 1; i <= 2; i++)
    {
        updateNoteSelector(`chord_tester_tonic${i}`, ((i == 1) ? 0 : 7), false);
        updateScaleSelector(`chord_tester_scale${i}`, "7major_nat,1", false /* no quarter tones */);
    }

    // update song generator selectors
    updateNoteSelector(`song_generator_tonic`, 0, false);
    updateScaleSelector(`song_generator_scale`, "7major_nat,1");

    // update scale keyboard selectors
    updateNoteSelector(`scale_keyboard_tonic`, 0, false);
    updateScaleSelector(`scale_keyboard_scale`, "12tet,1", true, true);
    updateOctaveSelector(`scale_keyboard_start_octave`, 0, 4);
    updateInstrumentSelector(`scale_keyboard_instrument`);
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
    // update scale position on guitar selector
    const scaleValues: Array<number> = getScaleValues();
    let nbPositions: number = scaleValues.length;

    // blues scale specific: 5 positions
    const scaleValuesBlues = getScaleValues("6blues,1,diff:5major_penta;5");            
    const isBluesScale = arraysEqual(scaleValues, scaleValuesBlues);
    if (isBluesScale)
        nbPositions = 5;

    updateGuitarPositionGivenNbNotes('scale_explorer_guitar_position', nbPositions);

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
    const scaleValues: Array<number> = getScaleValues();
    const charIntervals: Array<number> = getScaleCharIntervals();

    const nbNotesInScale: number = scaleValues.length;
    const scaleValuesMicrotonal: boolean = isMicrotonalScale(scaleValues);
    const scaleValuesXenharmonic: boolean = isXenharmonicScale(scaleValues);

    const scaleValuesChromatic: boolean = isChromaticScale(scaleValues);
    
    // build scale notes list
    const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValues);
    (<HTMLParagraphElement>document.getElementById('scale_result')).innerHTML = getScaleNotesTableHTML(noteValue, scaleValues, charIntervals);
    const scaleNotesValuesMicrotonal: boolean = isMicrotonalScale(scaleNotesValues);

    // build chords 3,4 notes and quartal harmonization tables
    const showChords3 = (nbNotesInScale >= 6 && !scaleValuesChromatic && !scaleValuesMicrotonal && !scaleValuesXenharmonic);
    const showChords4 = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesMicrotonal && !scaleValuesXenharmonic);
    const showChordsQ = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesMicrotonal && !scaleValuesXenharmonic);
    (<HTMLParagraphElement>document.getElementById('chords3_result')).innerHTML = showChords3 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3, !scaleNotesValuesMicrotonal) : "";
    (<HTMLParagraphElement>document.getElementById('chords4_result')).innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 4, !scaleNotesValuesMicrotonal) : "";
    (<HTMLParagraphElement>document.getElementById('chordsQ_result')).innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3, !scaleNotesValuesMicrotonal, 3) : "";

    const scaleName: string = getSelectorText("scale");

    // checkboxes
    //setEnabled("checkboxChords3", showChords3);
    //setEnabled("checkboxChords4", showChords4);
    //setEnabled("checkboxChords", isXen);

    const checkboxQuarterTones = (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer"));
    const hasQuarterTones = (scaleValuesMicrotonal || scaleNotesValuesMicrotonal);

    // update fretboard
    const position: number = getSelectedGuitarPosition('scale_explorer_guitar_position');
    updateFretboard(noteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, position);
    updateFretboard(noteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, position); // HACK to ensure correct drawing

    // update keyboard
    updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked);
    updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked); // HACK to ensure correct drawing

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
    const foundChordsFromScale: HTMLDivElement = <HTMLDivElement>document.getElementById('found_chords_from_scale');
    const neapChordFromScale: HTMLDivElement = <HTMLDivElement>document.getElementById('neap_chord_from_scale');
    const aug6thChordsFromScale: HTMLDivElement = <HTMLDivElement>document.getElementById('aug_6th_chords_from_scale');
    switch (pageSelected) 
    {
        case "page_scale_explorer":
            if (!scaleValuesChromatic && !scaleValuesXenharmonic)
            {
                foundScales.innerHTML = getRelativeScalesHTML(noteValue, scaleValues, scaleNotesValuesMicrotonal);
                negativeScale.innerHTML = getNegativeScaleHTML(noteValue, scaleValues, scaleNotesValuesMicrotonal);
            }
            setVisible('section_found_scales',  !scaleValuesChromatic && !scaleValuesXenharmonic);
            setVisible('negative_scale',  !scaleValuesChromatic && !scaleValuesXenharmonic);

            const checkboxGuitar = (<HTMLInputElement>document.getElementById("checkboxGuitar"));
            const checkboxKeyboard = (<HTMLInputElement>document.getElementById("checkboxKeyboard"));
            const checkboxChords = (<HTMLInputElement>document.getElementById("checkboxChords"));
            setVisible("scale_explorer_guitar_display", checkboxGuitar.checked && !scaleValuesXenharmonic);
            setVisible("canvas_keyboard", checkboxKeyboard.checked && !scaleValuesXenharmonic);

            if (!scaleValuesChromatic && !scaleValuesXenharmonic)
            {
                foundChordsFromScale.innerHTML = findChordsFromScaleScalesHTML(noteValue, scaleValues, charIntervals);
                neapChordFromScale.innerHTML = findNeapChordFromTonicHTML(noteValue);
                aug6thChordsFromScale.innerHTML = findAug6thChordsFromTonicHTML(noteValue);
            }
            setVisible("section_found_chords", checkboxChords.checked && !scaleValuesChromatic && !scaleValuesXenharmonic);

            break;

        case "page_scale_finder":
            foundScales.innerHTML = findScalesFromNotesHTML();
            setVisible('section_found_scales', true);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;

        case "page_chord_explorer":
        {
            const checkboxBarres: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxBarres");
            const checkboxEmptyStrings: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxEmptyStrings");
            
            updateChordGeneratorMode();
            updateChordSelectorGivenNbStrings('chord_explorer_chord');
            updateNbStringsForChordSelector();
            updateFoundChordElements();
            updateGeneratedChordsOnFretboard(checkboxBarres.checked, checkboxEmptyStrings.checked);

            setVisible('section_found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;
        }

        case "page_chord_tester":
        {
            // get selected start note
            const noteStartSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_start_note`)).value;
            const noteStartValue: number = parseInt(noteStartSelected);

            // get selected start octave
            const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_start_octave`)).value;
            const octaveStartValue: number = parseInt(octaveStartSelected);
            
            // get selected key(s) if option checked
            let selectedKeys: Array<[number, string]> = [];
            let hasKeys: Array<boolean> = [];
            for (let i = 1; i <= 2; i++)
            {
                const checkboxKey: HTMLInputElement = <HTMLInputElement>document.getElementById(`checkboxChordTesterKey${i}`);
                const keyChecked = checkboxKey.checked;
                setEnabled(`chord_tester_tonic${i}`, keyChecked);
                setEnabled(`chord_tester_scale${i}`, keyChecked);

                hasKeys.push(keyChecked);

                if (keyChecked)
                {
                    const tonicValueSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_tonic${i}`)).value;
                    const tonicValue = parseInt(tonicValueSelected);
                    const scaleId = (<HTMLSelectElement>document.getElementById(`chord_tester_scale${i}`)).value;

                    selectedKeys.push([tonicValue, scaleId]);
                    //hasKey = true;
                }
            }

            // update keys colors if 2 keys selected
            const has2Keys = (hasKeys[0] && hasKeys[1]);
            const key1Color = has2Keys ? "Crimson" : "";
            const key2Color = has2Keys ? "RoyalBlue" : "";
            const keyColors = [key1Color, key2Color];
            for (let i = 1; i <= 2; i++)
            {
                (<HTMLSpanElement>document.getElementById(`select_key_text_chord_tester${i}`)).style.color = keyColors[i-1];
                (<HTMLSelectElement>document.getElementById(`chord_tester_tonic${i}`)).style.color = keyColors[i-1];
                (<HTMLSelectElement>document.getElementById(`chord_tester_scale${i}`)).style.color = keyColors[i-1];
            }

            //setVisible(`key_notes_chord_tester_text`, hasKey);
            //setVisible(`key_notes_chord_tester`, hasKey);

            updateChordTesterTables(noteStartValue, octaveStartValue, selectedKeys);

            setVisible('section_found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;
        }

        case "page_song_generator":
            setVisible('section_found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;
        
        case "page_scale_keyboard":
            setVisible('section_found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);

            // TODO: update scale keyboard

            // get selected start note
            const tonicSelected: string = (<HTMLSelectElement>document.getElementById(`scale_keyboard_tonic`)).value;
            const tonicValue: number = parseInt(tonicSelected);

            // get selected start octave
            const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`scale_keyboard_start_octave`)).value;
            const octaveStartValue: number = parseInt(octaveStartSelected);

            break;
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

function onNewInstrumentLoaded()
{
    nbInstrumentsLoaded++;
    allInstrumentsLoaded = (nbInstrumentsLoaded >= nbInstrumentsTotal);
    updateLocales();

    // if all instruments loaded, allow page access
    if (allInstrumentsLoaded)
    for (const page of pagesArray)
        setEnabled(`button_${page}`, true);
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

    // if checkbox, update also attached label
    if (elem.type && elem.type === 'checkbox')
    {
        const idLabel: string = id + "Label";
        const label = <HTMLLabelElement>document.getElementById(idLabel);
        if (label && label.classList.contains("input-label"))
            label.style.color = status ? "black" : "grey";
    }
}

function updateChordGeneratorMode(): void
{
    // get selected mode
    let selectedMode: string = getSelectedChordGeneratorMode();
    const nameMode: boolean = (selectedMode == "name");

    // get select nb. of strings
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');
    
    // name mode
    setEnabled("chord_explorer_fundamental", nameMode);
    setEnabled("chord_explorer_chord", nameMode);
    setEnabled("chord_explorer_arpeggio_notes", nameMode);
    setEnabled("chord_explorer_arpeggio_intervals", nameMode);
    setVisible("chord_explorer_arpeggio_texts", nameMode);

    // notes mode
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
    (<HTMLButtonElement>document.getElementById("button_page_chord_tester")).innerText = getString("page_chord_tester");
    (<HTMLButtonElement>document.getElementById("button_page_chord_explorer")).innerText = getString("page_chord_explorer");
    (<HTMLButtonElement>document.getElementById("button_page_scale_explorer")).innerText = getString("page_scale_explorer");
    (<HTMLButtonElement>document.getElementById("button_page_scale_finder")).innerText = getString("page_scale_finder");
    (<HTMLButtonElement>document.getElementById("button_page_song_generator")).innerText = getString("page_song_generator");
    (<HTMLButtonElement>document.getElementById("button_page_scale_keyboard")).innerText = getString("play");

    // welcome
    (<HTMLHeadElement>document.getElementById("welcome_title")).innerText = getString("welcome_title");
    (<HTMLHeadElement>document.getElementById("welcome_subtitle")).innerText = allInstrumentsLoaded ?
        getString("welcome_subtitle") :
        `${getString("instruments_loading")} ${Math.floor(100*(nbInstrumentsLoaded / nbInstrumentsTotal))}%`;

    // scale explorer
    (<HTMLSpanElement>document.getElementById("select_key_text")).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById("header_scale_finder")).innerText = getString("header_scale_finder");
    (<HTMLLabelElement>document.getElementById("checkboxChordsLabel")).innerText = getString("chords");
    (<HTMLLabelElement>document.getElementById("checkboxGuitarLabel")).innerText = getString("guitar");
    (<HTMLLabelElement>document.getElementById("checkboxKeyboardLabel")).innerText = getString("keyboard");
    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesScaleExplorerLabel")).innerText = getString("quarter_tones");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_tuning_text")).innerText = getString("tuning");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_position_text")).innerText = getString("position");

    // scale finder

    let resetElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");

    let tonicElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("tonic");
    for (let elem of tonicElements)
        elem.innerText = getString("tonic");

    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesScaleFinderLabel")).innerText = getString("quarter_tones");

    // chord explorer
    (<HTMLLabelElement>document.getElementById("radioChordExplorerNameLabel")).innerText = getString("name");
    (<HTMLLabelElement>document.getElementById("radioChordExplorerNotesLabel")).innerText = getString("notes");
    (<HTMLSpanElement>document.getElementById("chord_explorer_bass_text")).innerText = getString("bass_chord_explorer");
    (<HTMLButtonElement>document.getElementById("play_found_chord")).innerText = `${getString("play")} ♪`;
    (<HTMLButtonElement>document.getElementById("play_found_arpeggio")).innerText = `${getString("play_arpeggio")} ♪`;
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_tuning_text")).innerText = getString("tuning");
    (<HTMLSpanElement>document.getElementById("chord_explorer_nb_strings_max_text")).innerText = getString("chord_explorer_nb_strings_max_text");
    (<HTMLLabelElement>document.getElementById("checkboxBarresLabel")).innerText = getString("show_barres");
    (<HTMLLabelElement>document.getElementById("checkboxEmptyStringsLabel")).innerText = getString("show_empty_strings");
    
    // chord tester

    (<HTMLLabelElement>document.getElementById("radioChordTesterChordsLabel")).innerText = getString("play_chords");
    (<HTMLLabelElement>document.getElementById("radioChordTesterArpeggiosLabel")).innerText = getString("play_arpeggios");
    (<HTMLLabelElement>document.getElementById("checkboxCommonChordsLabel")).innerText = getString("show_common_chords_only");
    let startElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("start");
    for (let elem of startElements)
        elem.innerText = getString("start");

    for (let i = 1; i <= 2; i++)
        (<HTMLSpanElement>document.getElementById(`select_key_text_chord_tester${i}`)).innerText = getString("select_key");

    (<HTMLSpanElement>document.getElementById(`key_notes_chord_tester_text`)).innerText = getString("notes");

    // song generator
    (<HTMLSpanElement>document.getElementById(`song_generator_select_key_text`)).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById(`song_generator_header`)).innerText = getString("page_experimental");
    (<HTMLSpanElement>document.getElementById(`song_generator_type_text`)).innerText = getString("counterpoint") + " 1:1";
    (<HTMLButtonElement>document.getElementById("song_generator_nb_bars_text")).innerText = `${getString("nb_bars")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_tempo_text")).innerText = `${getString("tempo")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_checkbox_track1_text")).innerText = `${getString("bass")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_play")).innerText = `${getString("listen")} ♪`;
    (<HTMLButtonElement>document.getElementById("song_generator_reset")).innerText = getString("reset");
    updateSongGeneratorPage();

    // scale keyboard
    (<HTMLSpanElement>document.getElementById("scale_keyboard_header")).innerText = `♪ ${getString("scale_keyboard_header")} ♪`;
    (<HTMLSpanElement>document.getElementById("scale_keyboard_select_key_text")).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById("scale_keyboard_start_octave_text")).innerText = getString("start_from_octave");
    (<HTMLSpanElement>document.getElementById("scale_keyboard_select_instrument_text")).innerText = getString("instrument");

    // update computed data
    updateSelectors();
    onNoteChanged();
}

function updateShowQuarterTonesInScaleExplorer()
{
    updateSelectors(true /*resetScaleFinderNotes*/);
    onNoteChanged();
}

function updateShowQuarterTonesInScaleFinder()
{
    updateSelectors(false /*resetScaleExplorerNotes*/, true /*resetScaleFinderNotes*/);
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
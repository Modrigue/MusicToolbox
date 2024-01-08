let pagesArray: Array<string> =
    ["page_scale_explorer", "page_scale_finder", "page_chord_explorer", "page_chord_tester", "page_song_generator"];
let pageSelected: string = "";


let hasAudio = false;
let instrumentsLoaded: Array<number> = [];
let instrumentsLoading = false;
let instrumentLoadingId = 0;
let instrumentLoadingSelectorId = "";

let browserSupportsAudio = true;
let languageInitialized = false;
let chordExplorerUpdateMode: string = "";


///////////////////////////////// INITIALIZATION //////////////////////////////

window.onload = function()
{
    // test chord positions finder algorithms
    //testGenerateChordPositions();
    //testChordPositionsLog();

    // add events callbacks to HTML elements

    window.addEventListener("resize", onResize);
    //document.body.addEventListener("resize", onResize); // not working?

    window.addEventListener("newInstrumentLoaded", onNewInstrumentLoaded, false);
    loadDefaultInstrument();

    (<HTMLButtonElement>document.getElementById("checkboxLanguage")).addEventListener("change", updateLocales);
    //(<HTMLButtonElement>document.getElementById('welcome_button_load_instruments')).addEventListener("click", loadDefaultInstrument);

    // pages
    for (const page of pagesArray)
        (<HTMLButtonElement>document.getElementById(`button_${page}`)).addEventListener("click", () => selectPage(page));
    
    // scale explorer
    const selectScaleExplorerNote = <HTMLSelectElement>document.getElementById(`note`);
    const selectScaleExplorerScale = <HTMLSelectElement>document.getElementById(`scale`);
    selectScaleExplorerNote.addEventListener("change", () => {selectScaleExplorerNote.blur(); update();});
    selectScaleExplorerScale.addEventListener("change", () => {selectScaleExplorerScale.blur(); onScaleChanged();});
    (<HTMLInputElement>document.getElementById("checkboxChords")).addEventListener("change", () => { toggleDisplay('chords3_result');toggleDisplay('chords4_result');toggleDisplay('chordsQ_result');toggleDisplay('section_found_chords') });
    (<HTMLInputElement>document.getElementById("checkboxGuitar")).addEventListener("change", () => toggleDisplay('scale_explorer_guitar_display'));
    (<HTMLInputElement>document.getElementById("checkboxKeyboard")).addEventListener("change", () => toggleDisplay('scale_explorer_scale_keyboard_display'));
    (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer")).addEventListener("change", updateShowQuarterTonesInScaleExplorer);
    (<HTMLInputElement>document.getElementById("checkboxIntervalFretboardScaleExplorer")).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('scale_explorer'));
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_tuning")).addEventListener("change", update);
    (<HTMLSelectElement>document.getElementById("scale_explorer_guitar_position")).addEventListener("change", update);

    // scale explorer keyboard
    const selectScaleKeyboardStartOctave = <HTMLSelectElement>document.getElementById(`scale_explorer_start_octave`);
    const selectInstrumentKeyboardScale = <HTMLSelectElement>document.getElementById(`scale_explorer_instrument`);
    selectScaleKeyboardStartOctave.addEventListener("change", () => { selectScaleKeyboardStartOctave.blur(); update()});
    selectInstrumentKeyboardScale.addEventListener("change", () => { selectInstrumentKeyboardScale.blur(); onInstrumentSelected(`scale_explorer_instrument`)});

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
    (<HTMLSelectElement>document.getElementById('chord_explorer_fundamental')).addEventListener("change", () => { updateChordExplorer("name")});
    (<HTMLSelectElement>document.getElementById('chord_explorer_chord')).addEventListener("change", () => { updateChordExplorer("name")});
    (<HTMLSelectElement>document.getElementById('chord_explorer_bass')).addEventListener("change", () => { updateChordExplorer("name")});
    for (let i = 0; i <= 6; i++)
    {
        const id: string = i.toString();
        (<HTMLSelectElement>document.getElementById(`chord_explorer_note${id}`)).addEventListener("change", () => { updateChordExplorer("notes")});
    }
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_nb_strings")).addEventListener("change", () => onNbStringsChanged('chord_explorer'));
    (<HTMLSelectElement>document.getElementById("chord_explorer_guitar_tuning")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxBarres")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxEmptyStrings")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("chord_explorer_nb_strings_max")).addEventListener("change", update);
    (<HTMLInputElement>document.getElementById("checkboxQuarterTonesChordExplorer")).addEventListener("change", updateShowQuarterTonesInChordExplorer);
    (<HTMLInputElement>document.getElementById("checkboxIntervalFretboardChordExplorer")).addEventListener("change", update);

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
    (<HTMLInputElement>document.getElementById("checkboxQuarterTonesChordTester")).addEventListener("change", updateShowQuarterTonesInChordTester);

    // song generator

    (<HTMLSelectElement>document.getElementById(`song_generator_type`)).addEventListener("change", updateShowXenInSongGenerator);
    (<HTMLSelectElement>document.getElementById(`song_generator_tonic`)).addEventListener("change", () => { resetGeneratedSong() });
    (<HTMLSelectElement>document.getElementById(`song_generator_scale`)).addEventListener("change", () => { resetGeneratedSong() });
    (<HTMLSelectElement>document.getElementById(`song_generator_nb_bars`)).addEventListener("change", () => { resetGeneratedSong() });
    (<HTMLSelectElement>document.getElementById(`song_generator_nb_notes_per_bar`)).addEventListener("change", () => { resetGeneratedSong() });
    
    (<HTMLButtonElement>document.getElementById('song_generator_generate')).addEventListener("click", () => { generateNewTrack() });
    for (let i = 1; i <= 2; i++)
        (<HTMLButtonElement>document.getElementById(`song_generator_generate_track${i}`)).addEventListener("click", () => { generateNewTrack(i) });
    
    (<HTMLButtonElement>document.getElementById('song_generator_play')).addEventListener("click", playGeneratedSong);
    (<HTMLButtonElement>document.getElementById('song_generator_save')).addEventListener("click", saveGeneratedSong);
    (<HTMLButtonElement>document.getElementById('song_generator_reset')).addEventListener("click", () => { resetGeneratedSong() });
    
    for (let i = 1; i <= 2; i++)
    {
        (<HTMLInputElement>document.getElementById(`song_generator_checkbox_track${i}`)).addEventListener("change", updateSongGeneratorPage);
        (<HTMLInputElement>document.getElementById(`song_generator_octave_track${i}`)).addEventListener("change", () => { resetGeneratedSong() });
        (<HTMLInputElement>document.getElementById(`song_generator_freq_track${i}`)).addEventListener("change", () => { updateSongGeneratorPage(); resetGeneratedSong() });
        const selectInstrument = <HTMLSelectElement>document.getElementById(`song_generator_instrument_track${i}`);
        selectInstrument.addEventListener("change", () => { selectInstrument.blur(); onInstrumentSelected(`song_generator_instrument_track${i}`)});
    }
}

function initLanguage(): void
{
    languageInitialized = false;
    const defaultLang: string = <string>parseCultureParameter();
    const checkboxLanguage: HTMLInputElement = <HTMLInputElement>document.getElementById('checkboxLanguage');

    checkboxLanguage.checked = (defaultLang == "fr");

    document.title = getString("title"); // force update

    updateLocales();
    languageInitialized = true;
}

function initShowQuarterTones(): void
{
    const tonicValue: number = parseNoteParameter();

    const checkboxQuarterTones = <HTMLInputElement>document.getElementById('checkboxQuarterTonesScaleExplorer');
    checkboxQuarterTones.checked = isQuarterToneInterval(tonicValue);

    updateShowQuarterTonesInScaleExplorer();
}

////////////////////////////////// SELECTORS //////////////////////////////////

function updateSelectors(resetScaleExplorer = false, resetScaleFinder = false, resetChordTester = false,
    resetChordExplorer = false, resetSongGeneration = false): void
{
    // specific: if quarter tone chord in URL parameters, check chord explorer checkbox (only at 1st load)
    if (!languageInitialized)
    {
        const chordParamValue = parseParameterById("chord");
        if (chordParamValue != null && chordParamValue != "")
        {
            if (isQuarterToneChord(chordParamValue))
            (<HTMLInputElement>document.getElementById("checkboxQuarterTonesChordExplorer")).checked = true;
        }
    }
    
    // show quarter tones?
    const showQTonesInScaleExplorer =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer")).checked;
    const showQTonesInScaleFinder =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleFinder")).checked;
    const showQTonesInChordTester =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesChordTester")).checked;
    const showQTonesInChordExplorer =
        (<HTMLInputElement>document.getElementById("checkboxQuarterTonesChordExplorer")).checked;

    // update scale explorer selectors
    updateNoteSelector('note', 0, false, showQTonesInScaleExplorer, resetScaleExplorer);
    updateScaleSelector('scale', "7major_nat,1", true, true, true);
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
        
        updateNoteSelector(`note_finder${id}`, -1, true, showQTonesInScaleFinder, resetScaleFinder);   
        initChordSelector(`chord_finder${id}`, "-1", true, showQTonesInScaleFinder, resetScaleFinder);   
    }
    updateNoteSelector('note_finder_tonic', -1, true, showQTonesInScaleFinder, resetScaleFinder); 
    
    // update chord explorer selectors
    updateNoteSelector('chord_explorer_fundamental', 0, false, showQTonesInChordExplorer, resetChordExplorer);
    initChordSelector('chord_explorer_chord', "M", false, showQTonesInChordExplorer, resetChordExplorer);
    updateNoteSelector("chord_explorer_bass", -1, true, showQTonesInChordExplorer, resetChordExplorer);
    initGuitarNbStringsSelector('chord_explorer_guitar_nb_strings');
    initGuitarTuningSelector('chord_explorer_guitar_tuning');
    updateNbStringsForChordSelector();
    for (let i = 0; i <= 6; i++)
        updateNoteSelector(`chord_explorer_note${i}`, -1, true, showQTonesInChordExplorer, resetChordExplorer);
    chordExplorerUpdateMode = "name";
    updateChordExplorerElements();
    chordExplorerUpdateMode = "";
    
    // update chord tester selectors
    updateNoteSelector(`chord_tester_start_note`, 0, false, showQTonesInChordTester, resetChordTester);
    updateOctaveSelector(`chord_tester_start_octave`, 0, 4, 2, false);
    for (let i = 1; i <= 2; i++)
    {
        updateNoteSelector(`chord_tester_tonic${i}`, ((i == 1) ? 0 : 7), false, showQTonesInChordTester, resetChordTester);
        updateScaleSelector(`chord_tester_scale${i}`, "7major_nat,1", false, showQTonesInChordTester, false, resetChordTester);
    }

    // update song generator selectors
    updateSongTypeSelector('song_generator_type');
    //(<HTMLSelectElement>document.getElementById(`song_generator_type`)).selectedIndex = 3;
    updateNoteSelector(`song_generator_tonic`, 0, false);
    const selectedTypeId = getSelectedSongType('song_generator_type');
    const isArpeggiosProg = (selectedTypeId == "arpeggios_progression");
    const isSequence = (selectedTypeId == "sequence");
    const isCounterpoint = selectedTypeId.startsWith("counterpoint");
    updateScaleSelector(`song_generator_scale`, "7major_nat,1", true, (isSequence || isArpeggiosProg || isCounterpoint),
        (isSequence || isArpeggiosProg), resetSongGeneration);
    
    if (resetSongGeneration)
        resetGeneratedSong();

    for (let i = 1; i <= 2; i++)
        updateInstrumentSelector(`song_generator_instrument_track${i}`);

    // update scale keyboard selectors
    updateOctaveSelector(`scale_explorer_start_octave`, 0, 4);
    updateInstrumentSelector(`scale_explorer_instrument`);
}

// update chord explorer given mode (chord name / notes)
function updateChordExplorer(mode: string)
{
    if (chordExplorerUpdateMode != "")
        return;

    chordExplorerUpdateMode = mode;
    update();
    chordExplorerUpdateMode = "";
}

// update chord explorer widgets
function updateChordExplorerElements()
{
    const checkboxBarres: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxBarres");
    const checkboxEmptyStrings: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxEmptyStrings");
    const checkboxQNotes: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxQuarterTonesChordExplorer");
    const checkboxShowIntervals = (<HTMLInputElement>document.getElementById("checkboxIntervalFretboardChordExplorer"));
    
    updateChordExplorerMode();
    updateChordSelectorGivenNbStrings('chord_explorer_chord');
    updateNbStringsForChordSelector();

    // update selected notes and chord values
    const fondamental: number = getChordExplorerFondamentalValue();
    let chordId = "";
    const chordValues: Array<number> = getChordExplorerChordValues();
    let chordValuesToDisplay: Array<number> = cloneIntegerArray(chordValues);        
    switch(chordExplorerUpdateMode)
    {
        // chord name: update notes selectors
        case "name":
            {
                chordId = getChordExplorerChordId();

                const bassInterval = getChordExplorerBassInterval(fondamental);
                if (bassInterval >= 0)
                {
                    if (chordValuesToDisplay.indexOf(bassInterval) == -1) // not part of the chord, insert in 1st position
                        chordValuesToDisplay.unshift(bassInterval);
                    else
                    {
                        // inverse chord: permute array
                        for (let i = 0; i < chordValuesToDisplay.length; i++) {
                            const lastInterval = <number>chordValuesToDisplay.pop();
                            chordValuesToDisplay.unshift(lastInterval);
                            if (lastInterval == bassInterval)
                                break;
                        }
                    }
                }
                
                // update notes selectors
                for (let i = 0; i <= 6; i++)
                {
                    const chordExplorerNoteSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`chord_explorer_note${i}`);
                    chordExplorerNoteSelector.value = (i < chordValuesToDisplay.length) ? 
                        addToNoteValue(fondamental, chordValuesToDisplay[i]).toString() : "-1";
                }

                break;
            }
        
        // notes: update chord selectors
        case "notes":
        //default:
            {
                const chordExplorerFundamentalSelector = (<HTMLSelectElement>document.getElementById('chord_explorer_fundamental'));
                const chordExplorerChordSelector = (<HTMLSelectElement>document.getElementById('chord_explorer_chord'));
                const chordExplorerBassSelector = (<HTMLSelectElement>document.getElementById('chord_explorer_bass'));
                
                // take 1st selected note as fundamental or bass
                let selectedNotesValues = getSelectedChordExplorerNotes();
                let foundChords: Array<[number, string, number]> = findChords(selectedNotesValues, false, true);
                
                if (foundChords != null && foundChords.length > 0)
                {
                    let chordFondamentalValue = foundChords[0][0];
                    chordId = foundChords[0][1];
                    let chordBassValue = foundChords[0][2];
                    
                    chordExplorerFundamentalSelector.value = chordFondamentalValue.toString();
                    chordExplorerChordSelector.value = chordId;
                    chordExplorerBassSelector.value = chordBassValue.toString();
                }
                else if (selectedNotesValues != null && selectedNotesValues.length > 0)
                {
                    let chordFondamentalValue = selectedNotesValues[0];
                    chordExplorerFundamentalSelector.value = chordFondamentalValue.toString();
                    chordExplorerChordSelector.value = "-1";
                    chordExplorerBassSelector.value = "-1";
                }
                
                break;
            }
    }
    
    updateFoundChordElements();
    updateFretboard("chord_explorer_canvas_guitar", fondamental, chordValuesToDisplay, [], chordId, checkboxQNotes.checked, checkboxShowIntervals.checked);
    updateGeneratedChordsOnFretboard(checkboxBarres.checked, checkboxEmptyStrings.checked, checkboxQNotes.checked, checkboxShowIntervals.checked);
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
        if (button != null)
        {
            const buttonSelected: boolean = (id == pageId);
            button.className = buttonSelected ? "button-page-selected" :  "button-page";
        }
    }
    pageSelected = pageId;

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
    const tonicNoteValue: number = getSelectedNoteValue();
    const scaleName: string = getSelectorText("scale");
    const scaleValues: Array<number> = getScaleValues();
    const charIntervals: Array<number> = getScaleCharIntervals();

    const nbNotesInScale: number = scaleValues.length;
    const scaleValuesQTones: boolean = isQuarterToneScale(scaleValues);
    const scaleValuesXenharmonic: boolean = isXenharmonicScale(scaleValues);

    const scaleValuesChromatic: boolean = isChromaticScale(scaleValues);
    
    // build scale notes list
    const scaleNotesValues: Array<number> = getScaleNotesValues(tonicNoteValue, scaleValues);
    (<HTMLParagraphElement>document.getElementById('scale_result')).innerHTML = getScaleNotesTableHTML(tonicNoteValue, scaleValues, charIntervals, scaleName);
    const scaleNotesValuesQTones: boolean = isQuarterToneScale(scaleNotesValues);

    // build chords 3,4 notes and quartal harmonization tables
    const showChords3 = (nbNotesInScale >= 6 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    const showChords4 = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    const showChordsQ = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    (<HTMLParagraphElement>document.getElementById('chords3_result')).innerHTML = showChords3 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3) : "";
    (<HTMLParagraphElement>document.getElementById('chords4_result')).innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 4) : "";
    (<HTMLParagraphElement>document.getElementById('chordsQ_result')).innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3, 3) : "";

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
                foundScales.innerHTML = getRelativeScalesHTML(tonicNoteValue, scaleValues, scaleNotesValuesQTones);
                negativeScale.innerHTML = getNegativeScaleHTML(tonicNoteValue, scaleValues, scaleNotesValuesQTones);
            }
            setVisible('section_found_scales',  !scaleValuesChromatic && !scaleValuesXenharmonic);
            setVisible('negative_scale',  !scaleValuesChromatic && !scaleValuesXenharmonic);

            const checkboxGuitar = (<HTMLInputElement>document.getElementById("checkboxGuitar"));
            const checkboxKeyboard = (<HTMLInputElement>document.getElementById("checkboxKeyboard"));
            const checkboxChords = (<HTMLInputElement>document.getElementById("checkboxChords"));
            setVisible("scale_explorer_guitar_display", checkboxGuitar.checked && !scaleValuesXenharmonic);
            setVisible("scale_explorer_canvas_scale_keyboard", checkboxKeyboard.checked);

            if (!scaleValuesChromatic && !scaleValuesXenharmonic)
            {
                foundChordsFromScale.innerHTML = findChordsFromScaleScalesHTML(tonicNoteValue, scaleValues, charIntervals);
                neapChordFromScale.innerHTML = findNeapChordFromTonicHTML(tonicNoteValue);
                aug6thChordsFromScale.innerHTML = findAug6thChordsFromTonicHTML(tonicNoteValue);
            }
            setVisible("section_found_chords", checkboxChords.checked && !scaleValuesChromatic && !scaleValuesXenharmonic);

        // checkboxes
        //setEnabled("checkboxChords3", showChords3);
        //setEnabled("checkboxChords4", showChords4);
        //setEnabled("checkboxChords", isXen);

        const checkboxQuarterTones = (<HTMLInputElement>document.getElementById("checkboxQuarterTonesScaleExplorer"));
        const hasQuarterTones = (scaleValuesQTones || scaleNotesValuesQTones);

        const checkboxShowIntervals = (<HTMLInputElement>document.getElementById("checkboxIntervalFretboardScaleExplorer"));

        // update fretboard
        const position: number = getSelectedGuitarPosition('scale_explorer_guitar_position');
        updateFretboard("scale_explorer_canvas_guitar", tonicNoteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, checkboxShowIntervals.checked, position);
        updateFretboard("scale_explorer_canvas_guitar", tonicNoteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, checkboxShowIntervals.checked, position); // HACK to ensure correct drawing

        // disabled: update keyboard
        //updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked);
        //updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked); // HACK to ensure correct drawing

        // get selected start octave
        const octaveStartSelected: string = (<HTMLSelectElement>document.getElementById(`scale_explorer_start_octave`)).value;
        const octaveStartValue: number = parseInt(octaveStartSelected);

        updateScaleKeyboard(tonicNoteValue, scaleValues, octaveStartValue, charIntervals);

        break;

        case "page_scale_finder":
            foundScales.innerHTML = findScalesFromNotesHTML();
            setVisible('section_found_scales', true);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;

        case "page_chord_explorer":
        {
            updateChordExplorerElements();

            setVisible('section_found_scales', false);
            setVisible('negative_scale', false);
            setVisible("section_found_chords", false);
            break;
        }

        case "page_chord_tester":
        {
            // get selected start note
            const noteStartSelected: string = (<HTMLSelectElement>document.getElementById(`chord_tester_start_note`)).value;
            const noteStartValue: number = parseFloat(noteStartSelected);

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
                    const tonicValue = parseFloat(tonicValueSelected);
                    const scaleId = (<HTMLSelectElement>document.getElementById(`chord_tester_scale${i}`)).value;

                    selectedKeys.push([tonicValue, scaleId]);
                    //hasKey = true;
                }
            }

            // update keys colors if 2 keys selected
            const has2Keys = (hasKeys[0] && hasKeys[1]);
            const style = getComputedStyle(document.body);
            const key1Color = has2Keys ? style.getPropertyValue('--color-key1') : "";
            const key2Color = has2Keys ? style.getPropertyValue('--color-key2') : "";
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
    }
}

function onResize(): void
{
    let scaleExplorerCanvasGuitar: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("scale_explorer_canvas_guitar");
    scaleExplorerCanvasGuitar.width = window.innerWidth - 30;

    let chordExplorerCanvasGuitar: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("chord_explorer_canvas_guitar");
    chordExplorerCanvasGuitar.width = window.innerWidth - 30;

    //let scaleExplorerCanvasKeyboard: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("scale_explorer_canvas_keyboard");
    //scaleExplorerCanvasKeyboard.width = window.innerWidth - 30;

    let scaleExplorerCanvasScaleKeyboard: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("scale_explorer_canvas_scale_keyboard");
    scaleExplorerCanvasScaleKeyboard.width = window.innerWidth - 30;

    update();
}

function loadSelectedInstrument(selectorId: string)
{
    // get selected instrument
    const instrSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(selectorId);
    const instrId: number = parseInt(instrSelect.value);
    
    // check if instrument has already been loaded
    if (instrumentsLoaded.indexOf(instrId) >= 0)
        return;

    setEnabled(selectorId, false);

    instrumentsLoading = true;
    updateLocales();
    
    instrumentLoadingId = instrId;
    instrumentLoadingSelectorId = selectorId;
    const instrument = <string>instrumentsDict_int.get(instrId);
    loadSoundfont(instrument);
}

function onNewInstrumentLoaded()
{
    instrumentsLoaded.push(instrumentLoadingId);
    setEnabled(instrumentLoadingSelectorId, true);

    hasAudio = true;
    instrumentsLoading = false;

    updateSelectedInstrument(instrumentLoadingId, instrumentLoadingSelectorId);
    updateLocales();
}

function toggleDisplay(id: string): void
{
    let elem: HTMLElement = <HTMLElement>document.getElementById(id);
    
    if (elem.style.display === "none")
        elem.style.display = "block";
    else
        elem.style.display = "none";
}

function setVisible(id: string, status: boolean, visibility :string = "block"): void
{
    let elem: HTMLElement = <HTMLElement>document.getElementById(id);
    elem.style.display = status ? visibility : "none";
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

function updateChordExplorerMode(): void
{
    // get select nb. of strings
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');

    // notes mode
    for (let i = 0; i <= 6; i++)
    {
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
    for (let pageId of pagesArray)
        (<HTMLButtonElement>document.getElementById(`button_${pageId}`)).innerText = getString(pageId);

    // welcome

    (<HTMLHeadElement>document.getElementById("welcome_title")).innerText = getString("welcome_title");
    (<HTMLHeadElement>document.getElementById("welcome_subtitle")).innerText = getString("welcome_subtitle");

    (<HTMLSpanElement>document.getElementById("welcome_message")).innerText = browserSupportsAudio ? "" : getString("audio_not_supported");

    // scale explorer

    (<HTMLSpanElement>document.getElementById("select_key_text")).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById("header_scale_finder")).innerText = getString("header_scale_finder");
    (<HTMLLabelElement>document.getElementById("checkboxChordsLabel")).innerText = getString("chords");
    (<HTMLLabelElement>document.getElementById("checkboxGuitarLabel")).innerText = getString("guitar");
    (<HTMLLabelElement>document.getElementById("checkboxKeyboardLabel")).innerText = getString("keyboard");
    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesScaleExplorerLabel")).innerText = getString("quarter_tones");
    (<HTMLLabelElement>document.getElementById("checkboxIntervalFretboardScaleExplorerLabel")).innerText = getString("intervals");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_tuning_text")).innerText = getString("tuning");
    (<HTMLSpanElement>document.getElementById("scale_explorer_guitar_position_text")).innerText = getString("position");

    // scale explorer keyboard
    (<HTMLSpanElement>document.getElementById("scale_explorer_start_octave_text")).innerText = getString("start_from_octave");
    (<HTMLSpanElement>document.getElementById("scale_explorer_select_instrument_text")).innerText = getString("instrument");
    (<HTMLSpanElement>document.getElementById("scale_explorer_keyboard_header")).innerText = (!hasAudio || instrumentsLoading) ?
        getString("instrument_loading") : `♪ ${getString("scale_explorer_keyboard_header")} ♪`;
    initScaleKeyboardMouseCallbacks();

    // scale finder

    let resetElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");

    let tonicElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("tonic");
    for (let elem of tonicElements)
        elem.innerText = getString("tonic");

    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesScaleFinderLabel")).innerText = getString("quarter_tones");

    // chord explorer
    //(<HTMLLabelElement>document.getElementById("radioChordExplorerNameLabel")).innerText = getString("name");
    //(<HTMLLabelElement>document.getElementById("radioChordExplorerNotesLabel")).innerText = getString("notes");
    //(<HTMLSpanElement>document.getElementById("chord_explorer_bass_text")).innerText = getString("bass_chord_explorer");
    (<HTMLButtonElement>document.getElementById("play_found_chord")).innerText = `${getString("chord")} ♪`;
    (<HTMLButtonElement>document.getElementById("play_found_arpeggio")).innerText = `${getString("arpeggio")} ♪`;
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_nb_strings_text")).innerText = getString("nb_strings");
    (<HTMLSpanElement>document.getElementById("chord_explorer_guitar_tuning_text")).innerText = getString("tuning");
    (<HTMLSpanElement>document.getElementById("chord_explorer_nb_strings_max_text")).innerText = getString("chord_explorer_nb_strings_max_text");
    (<HTMLLabelElement>document.getElementById("checkboxBarresLabel")).innerText = getString("show_barres");
    (<HTMLLabelElement>document.getElementById("checkboxEmptyStringsLabel")).innerText = getString("show_empty_strings");
    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesChordExplorerLabel")).innerText = getString("quarter_tones");
    (<HTMLLabelElement>document.getElementById("checkboxIntervalFretboardChordExplorerLabel")).innerText = getString("intervals");
    
    // chord tester

    (<HTMLLabelElement>document.getElementById("radioChordTesterChordsLabel")).innerText = getString("play_chords");
    (<HTMLLabelElement>document.getElementById("radioChordTesterArpeggiosLabel")).innerText = getString("play_arpeggios");
    (<HTMLLabelElement>document.getElementById("checkboxCommonChordsLabel")).innerText = getString("show_common_chords_only");
    (<HTMLLabelElement>document.getElementById("checkboxQuarterTonesChordTesterLabel")).innerText = getString("quarter_tones");
    let startElements: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("start");
    for (let elem of startElements)
        elem.innerText = getString("start");

    for (let i = 1; i <= 2; i++)
        (<HTMLSpanElement>document.getElementById(`select_key_text_chord_tester${i}`)).innerText = getString("select_key");

    (<HTMLSpanElement>document.getElementById(`key_notes_chord_tester_text`)).innerText = getString("notes");

    // song generator

    (<HTMLSpanElement>document.getElementById(`song_generator_select_key_text`)).innerText = getString("select_key");
    (<HTMLSpanElement>document.getElementById(`song_generator_header`)).innerText = getString("page_experimental");
    (<HTMLSpanElement>document.getElementById(`song_generator_type_text`)).innerText = getString("type");
    (<HTMLButtonElement>document.getElementById("song_generator_nb_bars_text")).innerText = `${getString("nb_bars")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_nb_loops_text")).innerText = `${getString("nb_loops")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_nb_notes_per_bar_text")).innerText = `${getString("nb_notes_per_bar")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_tempo_text")).innerText = `${getString("tempo")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_time_signature_text")).innerText = `${getString("time_signature")}`;
    //(<HTMLButtonElement>document.getElementById("song_generator_checkbox_track1_text")).innerText = `${getString("bass")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_play")).innerText = `${getString("listen")} ♪`;
    (<HTMLButtonElement>document.getElementById("song_generator_save")).innerText = `${getString("save")}`;
    (<HTMLButtonElement>document.getElementById("song_generator_reset")).innerText = getString("reset");

    for (let i = 1; i <= 2; i++)
    {
        (<HTMLSpanElement>document.getElementById(`song_generator_octave_track${i}_text`)).innerText = getString("octave");
        (<HTMLSpanElement>document.getElementById(`song_generator_freq_track${i}_text`)).innerText = getString("frequency");
        (<HTMLButtonElement>document.getElementById(`song_generator_generate_track${i}`)).innerText =getString("generate");
    }

    updateSongGeneratorPage();

    // footer
    let footerCompos = (<HTMLLinkElement>document.getElementById("compos_footer"));
    if (footerCompos != null)
        footerCompos.innerText = `♪ ${getString("compositions")} ♪`;

    // update computed data
    updateSelectors();
    updateChordExplorer("name"); // forces update and notes prefilled given chord name in chord explorer
}

function updateShowQuarterTonesInScaleExplorer()
{
    updateSelectors(true /*resetScaleExplorer*/);
    update();
}

function updateShowQuarterTonesInScaleFinder()
{
    updateSelectors(false /*resetScaleExplorer*/, true /*resetScaleFinder*/);
    update();
}

function updateShowQuarterTonesInChordTester()
{
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, true /*resetChordTester*/);
    update();
}

function updateShowQuarterTonesInChordExplorer()
{
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, false /*resetChordTester*/, true /*resetChordExplorer*/);
    update();
}

function updateShowXenInSongGenerator()
{
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, false /*resetChordTester*/
        , false /*resetChordExplorer*/, true /* resetSG */);
    update();
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
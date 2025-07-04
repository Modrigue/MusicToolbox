"use strict";
let pagesArray = ["page_scale_explorer", "page_scale_finder", "page_chord_explorer", "page_chord_tester", "page_song_generator"];
let pageSelected = "";
const languages = ["en", "de", "es", "fr", "it", "pt", "vn"];
let hasAudio = false;
let instrumentsLoaded = [];
let instrumentsLoading = false;
let instrumentLoadingId = 0;
let instrumentLoadingSelectorId = "";
let browserSupportsAudio = true;
let languageInitialized = false;
let chordExplorerUpdateMode = "";
///////////////////////////////// INITIALIZATION //////////////////////////////
window.onload = function () {
    // test chord positions finder algorithms
    //testGenerateChordPositions();
    //testChordPositionsLog();
    // add events callbacks to HTML elements
    window.addEventListener("resize", onResize);
    //document.body.addEventListener("resize", onResize); // not working?
    window.addEventListener("newInstrumentLoaded", onNewInstrumentLoaded, false);
    loadDefaultInstrument();
    const languageSelect = document.getElementById("languageSelect");
    const languageFlag = document.getElementById("languageFlag");
    if (languageSelect && languageFlag) {
        languageSelect.addEventListener("change", () => {
            updateLocales();
            // Update flag image
            let lang = getLanguageISO(languageSelect.value);
            languageFlag.src = `img/flags/flag_${lang.toUpperCase()}.png`;
            languageFlag.alt = lang.toUpperCase();
        });
    }
    // pages
    for (const page of pagesArray)
        document.getElementById(`button_${page}`).addEventListener("click", () => selectPage(page));
    // scale explorer
    const selectScaleExplorerNote = document.getElementById(`note`);
    const selectScaleExplorerScale = document.getElementById(`scale`);
    selectScaleExplorerNote.addEventListener("change", () => { selectScaleExplorerNote.blur(); update(); });
    selectScaleExplorerScale.addEventListener("change", () => { selectScaleExplorerScale.blur(); onScaleChanged(); });
    document.getElementById("checkboxChords").addEventListener("change", () => { toggleDisplay('chords3_result'); toggleDisplay('chords4_result'); toggleDisplay('chordsQ_result'); toggleDisplay('section_found_chords'); });
    document.getElementById("checkboxGuitar").addEventListener("change", () => toggleDisplay('scale_explorer_guitar_display'));
    document.getElementById("checkboxKeyboard").addEventListener("change", () => toggleDisplay('scale_explorer_scale_keyboard_display'));
    document.getElementById("checkboxQuarterTonesScaleExplorer").addEventListener("change", updateShowQuarterTonesInScaleExplorer);
    document.getElementById("checkboxIntervalFretboardScaleExplorer").addEventListener("change", update);
    document.getElementById("scale_explorer_guitar_nb_strings").addEventListener("change", () => onNbStringsChanged('scale_explorer'));
    document.getElementById("scale_explorer_guitar_tuning").addEventListener("change", update);
    document.getElementById("scale_explorer_guitar_position").addEventListener("change", update);
    // scale explorer keyboard
    const selectScaleKeyboardStartOctave = document.getElementById(`scale_explorer_start_octave`);
    const selectInstrumentKeyboardScale = document.getElementById(`scale_explorer_instrument`);
    selectScaleKeyboardStartOctave.addEventListener("change", () => { selectScaleKeyboardStartOctave.blur(); update(); });
    selectInstrumentKeyboardScale.addEventListener("change", () => { selectInstrumentKeyboardScale.blur(); onInstrumentSelected(`scale_explorer_instrument`); });
    // scale finder
    for (let i = 1; i <= 8; i++) {
        const id = i.toString();
        document.getElementById(`note_finder${id}`).addEventListener("change", update);
        document.getElementById(`chord_finder${id}`).addEventListener("change", update);
    }
    document.getElementById('note_finder_tonic').addEventListener("change", update);
    document.getElementById('reset_scale_finder').addEventListener("click", resetScaleFinder);
    document.getElementById("checkboxQuarterTonesScaleFinder").addEventListener("change", updateShowQuarterTonesInScaleFinder);
    // chord explorer
    document.getElementById('chord_explorer_fundamental').addEventListener("change", () => { updateChordExplorer("name"); });
    document.getElementById('chord_explorer_chord').addEventListener("change", () => { updateChordExplorer("name"); });
    document.getElementById('chord_explorer_bass').addEventListener("change", () => { updateChordExplorer("name"); });
    for (let i = 0; i <= 6; i++) {
        const id = i.toString();
        document.getElementById(`chord_explorer_note${id}`).addEventListener("change", () => { updateChordExplorer("notes"); });
    }
    document.getElementById("chord_explorer_guitar_nb_strings").addEventListener("change", () => onNbStringsChanged('chord_explorer'));
    document.getElementById("chord_explorer_guitar_tuning").addEventListener("change", update);
    document.getElementById("checkboxBarres").addEventListener("change", update);
    document.getElementById("checkboxEmptyStrings").addEventListener("change", update);
    document.getElementById("chord_explorer_nb_strings_max").addEventListener("change", update);
    document.getElementById("checkboxQuarterTonesChordExplorer").addEventListener("change", updateShowQuarterTonesInChordExplorer);
    document.getElementById("checkboxIntervalFretboardChordExplorer").addEventListener("change", update);
    // chord tester
    document.getElementById("checkboxCommonChords").addEventListener("change", update);
    document.getElementById("chord_tester_start_note").addEventListener("change", update);
    document.getElementById("chord_tester_start_octave").addEventListener("change", update);
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`checkboxChordTesterKey${i}`).addEventListener("change", update);
        document.getElementById(`chord_tester_tonic${i}`).addEventListener("change", update);
        document.getElementById(`chord_tester_scale${i}`).addEventListener("change", update);
    }
    document.getElementById("checkboxQuarterTonesChordTester").addEventListener("change", updateShowQuarterTonesInChordTester);
    // song generator
    document.getElementById(`song_generator_type`).addEventListener("change", updateShowXenInSongGenerator);
    document.getElementById(`song_generator_tonic`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById(`song_generator_scale`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById(`song_generator_nb_bars`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById(`song_generator_nb_notes_per_bar`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById(`song_generator_time_signature_num`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById(`song_generator_time_signature_den`).addEventListener("change", () => { resetGeneratedSong(); });
    document.getElementById('song_generator_generate').addEventListener("click", () => { generateNewTrack(); });
    for (let i = 1; i <= 2; i++)
        document.getElementById(`song_generator_generate_track${i}`).addEventListener("click", () => { generateNewTrack(i); });
    document.getElementById('song_generator_play').addEventListener("click", playGeneratedSong);
    document.getElementById('song_generator_save').addEventListener("click", saveGeneratedSong);
    document.getElementById('song_generator_reset').addEventListener("click", () => { resetGeneratedSong(); });
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`song_generator_checkbox_track${i}`).addEventListener("change", updateSongGeneratorPage);
        document.getElementById(`song_generator_octave_track${i}`).addEventListener("change", () => { resetGeneratedSong(); });
        document.getElementById(`song_generator_freq_track${i}`).addEventListener("change", () => { updateSongGeneratorPage(); resetGeneratedSong(); });
        const selectInstrument = document.getElementById(`song_generator_instrument_track${i}`);
        selectInstrument.addEventListener("change", () => { selectInstrument.blur(); onInstrumentSelected(`song_generator_instrument_track${i}`); });
    }
    // Generate language dropdown options programmatically
    const languageOptions = document.getElementById("languageOptions");
    if (languageOptions) {
        languageOptions.innerHTML = "";
        for (const lang of languages) {
            const optionDiv = document.createElement("div");
            optionDiv.className = "dropdown-option";
            optionDiv.setAttribute("data-lang", lang);
            const img = document.createElement("img");
            img.src = `img/flags/flag_${lang.toUpperCase()}.png`;
            img.alt = lang.toUpperCase();
            img.style.height = "20px";
            img.style.verticalAlign = "middle";
            img.style.marginRight = "4px";
            const span = document.createElement("span");
            span.innerText = lang.toUpperCase();
            optionDiv.appendChild(img);
            optionDiv.appendChild(span);
            languageOptions.appendChild(optionDiv);
        }
    }
    // Custom language dropdown logic (must be after options are generated)
    const customDropdown = document.getElementById("customLanguageDropdown");
    if (customDropdown) {
        // Remove any existing selected language div
        const oldSelected = document.getElementById("selectedLanguage");
        if (oldSelected)
            oldSelected.remove();
        // Create new selected language div
        const selectedDiv = document.createElement("div");
        selectedDiv.className = "selected";
        selectedDiv.id = "selectedLanguage";
        // Use language from URL parameter or fallback
        const urlLang = getLanguageISO(parseCultureParameter() || 'en');
        const img = document.createElement("img");
        img.src = `img/flags/flag_${urlLang.toUpperCase()}.png`;
        img.alt = urlLang.toUpperCase();
        img.style.height = "20px";
        img.style.verticalAlign = "middle";
        img.style.marginRight = "4px";
        const span = document.createElement("span");
        span.innerText = urlLang.toUpperCase();
        selectedDiv.appendChild(img);
        selectedDiv.appendChild(span);
        customDropdown.insertBefore(selectedDiv, customDropdown.firstChild);
        window.selectedLanguage = urlLang;
        // Attach event listeners for dropdown
        const optionsDiv = document.getElementById("languageOptions");
        const optionItems = optionsDiv ? optionsDiv.getElementsByClassName("dropdown-option") : [];
        selectedDiv.addEventListener("click", function (e) {
            e.stopPropagation();
            if (optionsDiv)
                optionsDiv.style.display = (optionsDiv.style.display === "block") ? "none" : "block";
        });
        for (let i = 0; i < optionItems.length; i++) {
            optionItems[i].addEventListener("click", function () {
                var _a, _b;
                const lang = this.getAttribute("data-lang");
                const img = (_a = this.querySelector("img")) === null || _a === void 0 ? void 0 : _a.src;
                const text = (_b = this.querySelector("span")) === null || _b === void 0 ? void 0 : _b.innerText;
                // Update selected
                if (selectedDiv && img && text) {
                    selectedDiv.querySelector("img").src = img;
                    selectedDiv.querySelector("img").alt = getLanguageISO(lang).toUpperCase();
                    selectedDiv.querySelector("span").innerText = text;
                }
                if (optionsDiv)
                    optionsDiv.style.display = "none";
                // Set language and update
                window.selectedLanguage = lang;
                updateLocales();
            });
        }
        // Close dropdown on outside click
        document.addEventListener("click", function () {
            if (optionsDiv)
                optionsDiv.style.display = "none";
        });
    }
};
function initLanguage() {
    languageInitialized = false;
    const defaultLang = parseCultureParameter();
    const customDropdown = document.getElementById("customLanguageDropdown");
    const selectedDiv = document.getElementById("selectedLanguage");
    if (customDropdown && selectedDiv) {
        let lang = getLanguageISO(defaultLang);
        selectedDiv.querySelector("img").src = `img/flags/flag_${lang.toUpperCase()}.png`;
        selectedDiv.querySelector("img").alt = lang.toUpperCase();
        selectedDiv.querySelector("span").innerText = lang.toUpperCase();
        window.selectedLanguage = lang;
    }
    document.title = getString("title"); // force update
    updateLocales();
    languageInitialized = true;
}
function initShowQuarterTones() {
    const tonicValue = parseNoteParameter();
    const checkboxQuarterTones = document.getElementById('checkboxQuarterTonesScaleExplorer');
    checkboxQuarterTones.checked = isQuarterToneInterval(tonicValue);
    updateShowQuarterTonesInScaleExplorer();
}
////////////////////////////////// SELECTORS //////////////////////////////////
function updateSelectors(resetScaleExplorer = false, resetScaleFinder = false, resetChordTester = false, resetChordExplorer = false, resetSongGeneration = false) {
    // specific: if quarter tone chord in URL parameters, check chord explorer checkbox (only at 1st load)
    if (!languageInitialized) {
        const chordParamValue = parseParameterById("chord");
        if (chordParamValue != null && chordParamValue != "") {
            if (isQuarterToneChord(chordParamValue))
                document.getElementById("checkboxQuarterTonesChordExplorer").checked = true;
        }
    }
    // show quarter tones?
    const showQTonesInScaleExplorer = document.getElementById("checkboxQuarterTonesScaleExplorer").checked;
    const showQTonesInScaleFinder = document.getElementById("checkboxQuarterTonesScaleFinder").checked;
    const showQTonesInChordTester = document.getElementById("checkboxQuarterTonesChordTester").checked;
    const showQTonesInChordExplorer = document.getElementById("checkboxQuarterTonesChordExplorer").checked;
    // update scale explorer selectors
    updateNoteSelector('note', 0, false, showQTonesInScaleExplorer, resetScaleExplorer);
    updateScaleSelector('scale', "7major_nat,1", true, true, true);
    initGuitarNbStringsSelector('scale_explorer_guitar_nb_strings');
    initGuitarTuningSelector('scale_explorer_guitar_tuning');
    // update scale position on guitar selector
    const scaleValues = getScaleValues();
    let nbPositions = scaleValues.length;
    // blues scale specific: 5 positions
    const scaleValuesBlues = getScaleValues("6blues,1,diff:5major_penta;5");
    const isBluesScale = arraysEqual(scaleValues, scaleValuesBlues);
    if (isBluesScale)
        nbPositions = 5;
    initGuitarPositionSelector('scale_explorer_guitar_position', true, nbPositions);
    // update scale finder selectors
    for (let i = 1; i <= 8; i++) {
        const id = i.toString();
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
    for (let i = 1; i <= 2; i++) {
        updateNoteSelector(`chord_tester_tonic${i}`, ((i == 1) ? 0 : 7), false, showQTonesInChordTester, resetChordTester);
        updateScaleSelector(`chord_tester_scale${i}`, "7major_nat,1", false, showQTonesInChordTester, false, resetChordTester);
    }
    // update song generator selectors
    updateSongTypeSelector('song_generator_type');
    updateSongTimeSignSelector('song_generator_time_signature_den');
    //(<HTMLSelectElement>document.getElementById(`song_generator_type`)).selectedIndex = 3;
    updateNoteSelector(`song_generator_tonic`, 0, false);
    const selectedTypeId = getSelectedSongType('song_generator_type');
    const isBassMelody = (selectedTypeId == "bass+melody");
    const isArpeggiosProg = (selectedTypeId == "arpeggios_progression");
    const isSequence = (selectedTypeId == "sequence");
    const isCounterpoint = selectedTypeId.startsWith("counterpoint");
    updateScaleSelector(`song_generator_scale`, "7major_nat,1", true, (isSequence || isArpeggiosProg || isBassMelody || isCounterpoint), (isSequence || isBassMelody || isArpeggiosProg), resetSongGeneration);
    if (resetSongGeneration)
        resetGeneratedSong();
    for (let i = 1; i <= 2; i++)
        updateInstrumentSelector(`song_generator_instrument_track${i}`);
    // update scale keyboard selectors
    updateOctaveSelector(`scale_explorer_start_octave`, 0, 4);
    updateInstrumentSelector(`scale_explorer_instrument`);
}
// update chord explorer given mode (chord name / notes)
function updateChordExplorer(mode) {
    if (chordExplorerUpdateMode != "")
        return;
    chordExplorerUpdateMode = mode;
    update();
    chordExplorerUpdateMode = "";
}
// update chord explorer widgets
function updateChordExplorerElements() {
    const checkboxBarres = document.getElementById("checkboxBarres");
    const checkboxEmptyStrings = document.getElementById("checkboxEmptyStrings");
    const checkboxQNotes = document.getElementById("checkboxQuarterTonesChordExplorer");
    const checkboxShowIntervals = document.getElementById("checkboxIntervalFretboardChordExplorer");
    updateChordExplorerMode();
    updateChordSelectorGivenNbStrings('chord_explorer_chord');
    updateNbStringsForChordSelector();
    // update selected notes and chord values
    const fondamental = getChordExplorerFondamentalValue();
    let chordId = "";
    const chordValues = getChordExplorerChordValues();
    let chordValuesToDisplay = cloneIntegerArray(chordValues);
    switch (chordExplorerUpdateMode) {
        // chord name: update notes selectors
        case "name":
            {
                chordId = getChordExplorerChordId();
                const bassInterval = getChordExplorerBassInterval(fondamental);
                if (bassInterval >= 0) {
                    if (chordValuesToDisplay.indexOf(bassInterval) == -1) // not part of the chord, insert in 1st position
                        chordValuesToDisplay.unshift(bassInterval);
                    else {
                        // inverse chord: permute array
                        for (let i = 0; i < chordValuesToDisplay.length; i++) {
                            const lastInterval = chordValuesToDisplay.pop();
                            chordValuesToDisplay.unshift(lastInterval);
                            if (lastInterval == bassInterval)
                                break;
                        }
                    }
                }
                // update notes selectors
                for (let i = 0; i <= 6; i++) {
                    const chordExplorerNoteSelector = document.getElementById(`chord_explorer_note${i}`);
                    chordExplorerNoteSelector.value = (i < chordValuesToDisplay.length) ?
                        addToNoteValue(fondamental, chordValuesToDisplay[i]).toString() : "-1";
                }
                break;
            }
        // notes: update chord selectors
        case "notes":
            //default:
            {
                const chordExplorerFundamentalSelector = document.getElementById('chord_explorer_fundamental');
                const chordExplorerChordSelector = document.getElementById('chord_explorer_chord');
                const chordExplorerBassSelector = document.getElementById('chord_explorer_bass');
                // take 1st selected note as fundamental or bass
                let selectedNotesValues = getSelectedChordExplorerNotes();
                let foundChords = findChords(selectedNotesValues, false, true);
                if (foundChords != null && foundChords.length > 0) {
                    let chordFondamentalValue = foundChords[0][0];
                    chordId = foundChords[0][1];
                    let chordBassValue = foundChords[0][2];
                    chordExplorerFundamentalSelector.value = chordFondamentalValue.toString();
                    chordExplorerChordSelector.value = chordId;
                    chordExplorerBassSelector.value = chordBassValue.toString();
                }
                else if (selectedNotesValues != null && selectedNotesValues.length > 0) {
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
function getSelectorText(id) {
    const selector = document.getElementById(id);
    const selectedIndex = selector.selectedIndex;
    return selector.options[selectedIndex].text;
}
//////////////////////////////////// EVENTS ///////////////////////////////////
function selectNoteAndScale(scaleId) {
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
function initPagefromURLParams() {
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
function selectPage(pageId = "") {
    for (let id of pagesArray) {
        let button = document.getElementById(`button_${id}`);
        if (button != null) {
            const buttonSelected = (id == pageId);
            button.className = buttonSelected ? "button-page-selected" : "button-page";
        }
    }
    pageSelected = pageId;
    update();
}
function onScaleChanged() {
    // update scale position on guitar selector
    const scaleValues = getScaleValues();
    let nbPositions = scaleValues.length;
    // blues scale specific: 5 positions
    const scaleValuesBlues = getScaleValues("6blues,1,diff:5major_penta;5");
    const isBluesScale = arraysEqual(scaleValues, scaleValuesBlues);
    if (isBluesScale)
        nbPositions = 5;
    updateGuitarPositionGivenNbNotes('scale_explorer_guitar_position', nbPositions);
    update();
}
function onNbStringsChanged(id) {
    let nbStrings = -1;
    // update corresponding guitar tuning selector
    nbStrings = getSelectedGuitarNbStrings(`${id}_guitar_nb_strings`);
    updateGuitarTuningGivenNbStrings(`${id}_guitar_tuning`, nbStrings);
    update();
}
// compute and update results
function update() {
    // display selected page
    for (let pageId of pagesArray)
        setVisible(pageId, (pageId == pageSelected));
    // get selected note and scale/mode values
    const tonicNoteValue = getSelectedNoteValue();
    const scaleName = getSelectorText("scale");
    const scaleValues = getScaleValues();
    const charIntervals = getScaleCharIntervals();
    const nbNotesInScale = scaleValues.length;
    const scaleValuesQTones = isQuarterToneScale(scaleValues);
    const scaleValuesXenharmonic = isXenharmonicScale(scaleValues);
    const scaleValuesChromatic = isChromaticScale(scaleValues);
    // build scale notes list
    const scaleNotesValues = getScaleNotesValues(tonicNoteValue, scaleValues);
    document.getElementById('scale_result').innerHTML = getScaleNotesTableHTML(tonicNoteValue, scaleValues, charIntervals, scaleName);
    const scaleNotesValuesQTones = isQuarterToneScale(scaleNotesValues);
    // build chords 3,4 notes and quartal harmonization tables
    const showChords3 = (nbNotesInScale >= 6 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    const showChords4 = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    const showChordsQ = (nbNotesInScale >= 7 && !scaleValuesChromatic && !scaleValuesXenharmonic);
    document.getElementById('chords3_result').innerHTML = showChords3 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3) : "";
    document.getElementById('chords4_result').innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 4) : "";
    document.getElementById('chordsQ_result').innerHTML = showChords4 ? getChordsTableHTML(scaleValues, scaleNotesValues, charIntervals, 3, 3) : "";
    // update scale finder chords selectors
    let has1NoteSelected = false;
    for (let i = 1; i <= 8; i++) {
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
    const negativeScale = document.getElementById('negative_scale');
    const foundChordsFromScale = document.getElementById('found_chords_from_scale');
    const neapChordFromScale = document.getElementById('neap_chord_from_scale');
    const aug6thChordsFromScale = document.getElementById('aug_6th_chords_from_scale');
    switch (pageSelected) {
        case "page_scale_explorer":
            if (!scaleValuesChromatic && !scaleValuesXenharmonic) {
                foundScales.innerHTML = getRelativeScalesHTML(tonicNoteValue, scaleValues, scaleNotesValuesQTones);
                negativeScale.innerHTML = getNegativeScaleHTML(tonicNoteValue, scaleValues, scaleNotesValuesQTones);
            }
            setVisible('section_found_scales', !scaleValuesChromatic && !scaleValuesXenharmonic);
            setVisible('negative_scale', !scaleValuesChromatic && !scaleValuesXenharmonic);
            const checkboxGuitar = document.getElementById("checkboxGuitar");
            const checkboxKeyboard = document.getElementById("checkboxKeyboard");
            const checkboxChords = document.getElementById("checkboxChords");
            setVisible("scale_explorer_guitar_display", checkboxGuitar.checked && !scaleValuesXenharmonic);
            setVisible("scale_explorer_canvas_scale_keyboard", checkboxKeyboard.checked);
            if (!scaleValuesChromatic && !scaleValuesXenharmonic) {
                foundChordsFromScale.innerHTML = findChordsFromScaleScalesHTML(tonicNoteValue, scaleValues, charIntervals);
                neapChordFromScale.innerHTML = findNeapChordFromTonicHTML(tonicNoteValue);
                aug6thChordsFromScale.innerHTML = findAug6thChordsFromTonicHTML(tonicNoteValue);
            }
            setVisible("section_found_chords", checkboxChords.checked && !scaleValuesChromatic && !scaleValuesXenharmonic);
            // checkboxes
            //setEnabled("checkboxChords3", showChords3);
            //setEnabled("checkboxChords4", showChords4);
            //setEnabled("checkboxChords", isXen);
            const checkboxQuarterTones = document.getElementById("checkboxQuarterTonesScaleExplorer");
            const hasQuarterTones = (scaleValuesQTones || scaleNotesValuesQTones);
            const checkboxShowIntervals = document.getElementById("checkboxIntervalFretboardScaleExplorer");
            // update fretboard
            const position = getSelectedGuitarPosition('scale_explorer_guitar_position');
            updateFretboard("scale_explorer_canvas_guitar", tonicNoteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, checkboxShowIntervals.checked, position);
            updateFretboard("scale_explorer_canvas_guitar", tonicNoteValue, scaleValues, charIntervals, scaleName, /*hasQuarterTones ||*/ checkboxQuarterTones.checked, checkboxShowIntervals.checked, position); // HACK to ensure correct drawing
            // disabled: update keyboard
            //updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked);
            //updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, hasQuarterTones || checkboxQuarterTones.checked); // HACK to ensure correct drawing
            // get selected start octave
            const octaveStartSelected = document.getElementById(`scale_explorer_start_octave`).value;
            const octaveStartValue = parseInt(octaveStartSelected);
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
                const noteStartSelected = document.getElementById(`chord_tester_start_note`).value;
                const noteStartValue = parseFloat(noteStartSelected);
                // get selected start octave
                const octaveStartSelected = document.getElementById(`chord_tester_start_octave`).value;
                const octaveStartValue = parseInt(octaveStartSelected);
                // get selected key(s) if option checked
                let selectedKeys = [];
                let hasKeys = [];
                for (let i = 1; i <= 2; i++) {
                    const checkboxKey = document.getElementById(`checkboxChordTesterKey${i}`);
                    const keyChecked = checkboxKey.checked;
                    setEnabled(`chord_tester_tonic${i}`, keyChecked);
                    setEnabled(`chord_tester_scale${i}`, keyChecked);
                    hasKeys.push(keyChecked);
                    if (keyChecked) {
                        const tonicValueSelected = document.getElementById(`chord_tester_tonic${i}`).value;
                        const tonicValue = parseFloat(tonicValueSelected);
                        const scaleId = document.getElementById(`chord_tester_scale${i}`).value;
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
                for (let i = 1; i <= 2; i++) {
                    document.getElementById(`select_key_text_chord_tester${i}`).style.color = keyColors[i - 1];
                    document.getElementById(`chord_tester_tonic${i}`).style.color = keyColors[i - 1];
                    document.getElementById(`chord_tester_scale${i}`).style.color = keyColors[i - 1];
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
function onResize() {
    let scaleExplorerCanvasGuitar = document.getElementById("scale_explorer_canvas_guitar");
    scaleExplorerCanvasGuitar.width = window.innerWidth - 30;
    let chordExplorerCanvasGuitar = document.getElementById("chord_explorer_canvas_guitar");
    chordExplorerCanvasGuitar.width = window.innerWidth - 30;
    //let scaleExplorerCanvasKeyboard: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("scale_explorer_canvas_keyboard");
    //scaleExplorerCanvasKeyboard.width = window.innerWidth - 30;
    let scaleExplorerCanvasScaleKeyboard = document.getElementById("scale_explorer_canvas_scale_keyboard");
    scaleExplorerCanvasScaleKeyboard.width = window.innerWidth - 30;
    update();
}
function loadSelectedInstrument(selectorId) {
    // get selected instrument
    const instrSelect = document.getElementById(selectorId);
    const instrId = parseInt(instrSelect.value);
    // check if instrument has already been loaded
    if (instrumentsLoaded.indexOf(instrId) >= 0)
        return;
    setEnabled(selectorId, false);
    instrumentsLoading = true;
    updateLocales();
    instrumentLoadingId = instrId;
    instrumentLoadingSelectorId = selectorId;
    const instrument = instrumentsDict_int.get(instrId);
    loadSoundfont(instrument);
}
function onNewInstrumentLoaded() {
    instrumentsLoaded.push(instrumentLoadingId);
    setEnabled(instrumentLoadingSelectorId, true);
    hasAudio = true;
    instrumentsLoading = false;
    updateSelectedInstrument(instrumentLoadingId, instrumentLoadingSelectorId);
    updateLocales();
}
function toggleDisplay(id) {
    let elem = document.getElementById(id);
    if (elem.style.display === "none")
        elem.style.display = "block";
    else
        elem.style.display = "none";
}
function setVisible(id, status, visibility = "block") {
    let elem = document.getElementById(id);
    elem.style.display = status ? visibility : "none";
}
function setEnabled(id, status) {
    let elem = document.getElementById(id);
    elem.disabled = !status;
    // if checkbox, update also attached label
    if (elem.type && elem.type === 'checkbox') {
        const idLabel = id + "Label";
        const label = document.getElementById(idLabel);
        if (label && label.classList.contains("input-label"))
            label.style.color = status ? "black" : "grey";
    }
}
function updateChordExplorerMode() {
    // get select nb. of strings
    const nbStrings = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');
    // notes mode
    for (let i = 0; i <= 6; i++) {
        // if note index exceeds nb. of strings, reset note
        if (i > nbStrings) {
            let noteSelect = document.getElementById(`chord_explorer_note${i}`);
            noteSelect.selectedIndex = 0;
        }
    }
}
function resetScaleFinder() {
    // reset scale finder note selectors
    for (let i = 1; i <= 8; i++) {
        const id = i.toString();
        let noteSelect = document.getElementById(`note_finder${id}`);
        noteSelect.selectedIndex = 0;
    }
    let noteSelect = document.getElementById('note_finder_tonic');
    noteSelect.selectedIndex = 0;
    update();
}
//////////////////////////////////// LOCALES //////////////////////////////////
function updateLocales() {
    document.title = getString("title");
    // pages buttons
    for (let pageId of pagesArray)
        document.getElementById(`button_${pageId}`).innerText = getString(pageId);
    // welcome
    document.getElementById("welcome_title").innerText = getString("welcome_title");
    document.getElementById("welcome_subtitle").innerText = getString("welcome_subtitle");
    document.getElementById("welcome_message").innerText = browserSupportsAudio ? "" : getString("audio_not_supported");
    // scale explorer
    document.getElementById("select_key_text").innerText = getString("select_key");
    document.getElementById("header_scale_finder").innerText = getString("header_scale_finder");
    document.getElementById("checkboxChordsLabel").innerText = getString("chords");
    document.getElementById("checkboxGuitarLabel").innerText = getString("guitar");
    document.getElementById("checkboxKeyboardLabel").innerText = getString("keyboard");
    document.getElementById("checkboxQuarterTonesScaleExplorerLabel").innerText = getString("quarter_tones");
    document.getElementById("checkboxIntervalFretboardScaleExplorerLabel").innerText = getString("intervals");
    document.getElementById("scale_explorer_guitar_nb_strings_text").innerText = getString("nb_strings");
    document.getElementById("scale_explorer_guitar_tuning_text").innerText = getString("tuning");
    document.getElementById("scale_explorer_guitar_position_text").innerText = getString("position");
    // scale explorer keyboard
    document.getElementById("scale_explorer_start_octave_text").innerText = getString("start_from_octave");
    document.getElementById("scale_explorer_select_instrument_text").innerText = getString("instrument");
    document.getElementById("scale_explorer_keyboard_header").innerText = (!hasAudio || instrumentsLoading) ?
        getString("instrument_loading") : `♪ ${getString("scale_explorer_keyboard_header")} ♪`;
    initScaleKeyboardMouseCallbacks();
    // scale finder
    let resetElements = document.getElementsByClassName("reset");
    for (let resetEelem of resetElements)
        resetEelem.innerText = getString("reset");
    let tonicElements = document.getElementsByClassName("tonic");
    for (let elem of tonicElements)
        elem.innerText = getString("tonic");
    document.getElementById("checkboxQuarterTonesScaleFinderLabel").innerText = getString("quarter_tones");
    // chord explorer
    //(<HTMLLabelElement>document.getElementById("radioChordExplorerNameLabel")).innerText = getString("name");
    //(<HTMLLabelElement>document.getElementById("radioChordExplorerNotesLabel")).innerText = getString("notes");
    //(<HTMLSpanElement>document.getElementById("chord_explorer_bass_text")).innerText = getString("bass_chord_explorer");
    document.getElementById("play_found_chord").innerText = `${getString("chord")} ♪`;
    document.getElementById("play_found_arpeggio").innerText = `${getString("arpeggio")} ♪`;
    document.getElementById("chord_explorer_guitar_nb_strings_text").innerText = getString("nb_strings");
    document.getElementById("chord_explorer_guitar_tuning_text").innerText = getString("tuning");
    document.getElementById("chord_explorer_nb_strings_max_text").innerText = getString("chord_explorer_nb_strings_max_text");
    document.getElementById("checkboxBarresLabel").innerText = getString("show_barres");
    document.getElementById("checkboxEmptyStringsLabel").innerText = getString("show_empty_strings");
    document.getElementById("checkboxQuarterTonesChordExplorerLabel").innerText = getString("quarter_tones");
    document.getElementById("checkboxIntervalFretboardChordExplorerLabel").innerText = getString("intervals");
    // chord tester
    document.getElementById("radioChordTesterChordsLabel").innerText = getString("play_chords");
    document.getElementById("radioChordTesterArpeggiosLabel").innerText = getString("play_arpeggios");
    document.getElementById("checkboxCommonChordsLabel").innerText = getString("show_common_chords_only");
    document.getElementById("checkboxQuarterTonesChordTesterLabel").innerText = getString("quarter_tones");
    let startElements = document.getElementsByClassName("start");
    for (let elem of startElements)
        elem.innerText = getString("start");
    for (let i = 1; i <= 2; i++)
        document.getElementById(`select_key_text_chord_tester${i}`).innerText = getString("select_key");
    document.getElementById(`key_notes_chord_tester_text`).innerText = getString("notes");
    // song generator
    document.getElementById(`song_generator_select_key_text`).innerText = getString("select_key");
    document.getElementById(`song_generator_header`).innerText = getString("page_experimental");
    document.getElementById(`song_generator_type_text`).innerText = getString("type");
    document.getElementById("song_generator_nb_bars_text").innerText = `${getString("nb_bars")}`;
    document.getElementById("song_generator_nb_loops_text").innerText = `${getString("nb_loops")}`;
    document.getElementById("song_generator_nb_notes_per_bar_text").innerText = `${getString("nb_notes_per_bar")}`;
    document.getElementById("song_generator_tempo_text").innerText = `${getString("tempo")}`;
    document.getElementById("song_generator_time_signature_text").innerText = `${getString("time_signature")}`;
    //(<HTMLButtonElement>document.getElementById("song_generator_checkbox_track1_text")).innerText = `${getString("bass")}`;
    document.getElementById("song_generator_play").innerText = `${getString("listen")} ♪`;
    document.getElementById("song_generator_save").innerText = `${getString("save")}`;
    document.getElementById("song_generator_reset").innerText = getString("reset");
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`song_generator_octave_track${i}_text`).innerText = getString("octave");
        document.getElementById(`song_generator_freq_track${i}_text`).innerText = getString("frequency");
        document.getElementById(`song_generator_generate_track${i}`).innerText = getString("generate");
    }
    updateSongGeneratorPage();
    // footer
    let footerCompos = document.getElementById("compos_footer");
    if (footerCompos != null)
        footerCompos.innerText = `♪ ${getString("compositions")} ♪`;
    // update computed data
    updateSelectors();
    updateChordExplorer("name"); // forces update and notes prefilled given chord name in chord explorer
}
function updateShowQuarterTonesInScaleExplorer() {
    updateSelectors(true /*resetScaleExplorer*/);
    update();
}
function updateShowQuarterTonesInScaleFinder() {
    updateSelectors(false /*resetScaleExplorer*/, true /*resetScaleFinder*/);
    update();
}
function updateShowQuarterTonesInChordTester() {
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, true /*resetChordTester*/);
    update();
}
function updateShowQuarterTonesInChordExplorer() {
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, false /*resetChordTester*/, true /*resetChordExplorer*/);
    update();
}
function updateShowXenInSongGenerator() {
    updateSelectors(false /*resetScaleExplorer*/, false /*resetScaleFinder*/, false /*resetChordTester*/, false /*resetChordExplorer*/, true /* resetSG */);
    update();
}
function getSelectorIndexFromValue(selector, value) {
    const options = selector.options;
    const nbOptions = options.length;
    let index = -1;
    for (index = 0; index < nbOptions; index++) {
        if (options[index].value === value)
            return index;
    }
    return index;
}
function getLanguageISO(languageStr) {
    let defaultLang = "en";
    if (!languageStr)
        return defaultLang;
    let lang = languageStr;
    if (languages.indexOf(lang) == -1)
        lang = defaultLang;
    return lang;
}
//# sourceMappingURL=interface.js.map
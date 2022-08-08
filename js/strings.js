"use strict";
// international
const stringsDict_int = new Map();
stringsDict_int.set("page_chord_explorer", "Find chords");
stringsDict_int.set("page_chord_tester", "Test chords");
stringsDict_int.set("page_experimental", "⚠ This page is experimental and under development ⚠");
stringsDict_int.set("page_scale_explorer", "Explore scales");
stringsDict_int.set("page_scale_finder", "Find compatible scales");
stringsDict_int.set("page_song_generator", "Generate a song");
stringsDict_int.set("header_scale_finder", "Select your notes and chords:");
stringsDict_int.set("header_chord_explorer", "Select your note and chord:");
stringsDict_int.set("bass", "Bass");
stringsDict_int.set("bass_chord_explorer", "Bass:");
stringsDict_int.set("chord", "Chord");
stringsDict_int.set("chord_explorer_nb_strings_max_text", "strings played");
stringsDict_int.set("chords", "Chords");
stringsDict_int.set("counterpoint", "Counterpoint");
stringsDict_int.set("generate_new_song", "Generate new song");
stringsDict_int.set("generate_new_track", "Generate new track");
stringsDict_int.set("guitar", "Guitar");
stringsDict_int.set("fretboard", "Fretboard");
stringsDict_int.set("keyboard", "Keyboard");
stringsDict_int.set("chord_neapolitan", "Neapolitan chord:");
stringsDict_int.set("chords_aug_6th", "Augmented 6th chords:");
stringsDict_int.set("chords_N_notes", "Chords with {%1} notes");
stringsDict_int.set("chords_N_notes_all", "All chords with {%1} notes:");
stringsDict_int.set("chords_quartal", "Quartal chords");
stringsDict_int.set("instrument", "Instrument:");
stringsDict_int.set("instruments_loading", "Instruments loading, please wait...");
stringsDict_int.set("listen", "Listen");
stringsDict_int.set("listen_backwards", "Listen backwards");
stringsDict_int.set("min_2_notes", "At least 2 notes needed");
stringsDict_int.set("N_notes", "{%1} notes:");
stringsDict_int.set("name", "Name:");
stringsDict_int.set("nb_bars", "Nb. of bars:");
stringsDict_int.set("nb_strings", "Nb. of strings:");
stringsDict_int.set("negative_scale", "Negative scale:");
stringsDict_int.set("no_result", "Not found");
stringsDict_int.set("notes", "Notes:");
stringsDict_int.set("play", "Play");
stringsDict_int.set("play_arpeggio", "Play arpeggio");
stringsDict_int.set("play_arpeggios", "Play arpeggios");
stringsDict_int.set("play_backwards", "Play backwards");
stringsDict_int.set("play_backwards_with_bass", "Play backwards with bass");
stringsDict_int.set("play_chords", "Play chords");
stringsDict_int.set("play_with_bass", "Play with bass");
stringsDict_int.set("position", "Position:");
stringsDict_int.set("positions_all", "All");
stringsDict_int.set("quarter_tones", "¼ tones");
stringsDict_int.set("scales", "Scales:");
stringsDict_int.set("scales_compatible", "Compatible scales:");
stringsDict_int.set("select_key", "Key:");
stringsDict_int.set("relative_scales", "Relative scales:");
stringsDict_int.set("reset", "Reset");
stringsDict_int.set("scale_keyboard_header", "Use your keyboard to play within the selected key");
stringsDict_int.set("start", "Start:");
stringsDict_int.set("start_from_octave", "Start from octave:");
stringsDict_int.set("show_barres", "Barres");
stringsDict_int.set("show_common_chords_only", "Common chords only");
stringsDict_int.set("show_empty_strings", "Empty strings");
stringsDict_int.set("tempo", "Tempo:");
stringsDict_int.set("title", "Music Toolbox");
stringsDict_int.set("tonic", "Tonic:");
stringsDict_int.set("tuning", "Tuning:");
stringsDict_int.set("welcome_title", "Welcome to the Music Toolbox");
stringsDict_int.set("welcome_subtitle", "What do you want to do?");
// french
const stringsDict_fr = new Map();
stringsDict_fr.set("page_chord_explorer", "Trouver des accords");
stringsDict_fr.set("page_chord_tester", "Tester les accords");
stringsDict_fr.set("page_experimental", "⚠ Cette page est expérimentale et en cours de développement ⚠");
stringsDict_fr.set("page_scale_explorer", "Explorer des gammes");
stringsDict_fr.set("page_scale_finder", "Trouver des gammes compatibles");
stringsDict_fr.set("page_song_generator", "Générer un morceau");
stringsDict_fr.set("header_scale_finder", "Notes et accords :");
stringsDict_fr.set("header_chord_explorer", "Note at accord :");
stringsDict_fr.set("bass", "Basse");
stringsDict_fr.set("bass_chord_explorer", "Basse :");
stringsDict_fr.set("chord", "Accord");
stringsDict_fr.set("chord_explorer_nb_strings_max_text", "cordes jouées");
stringsDict_fr.set("chords", "Accords");
stringsDict_fr.set("counterpoint", "Contrepoint");
stringsDict_fr.set("generate_new_song", "Générer un nouveau morceau");
stringsDict_fr.set("generate_new_track", "Générer la nouvelle piste");
stringsDict_fr.set("guitar", "Guitare");
stringsDict_fr.set("fretboard", "Guitare");
stringsDict_fr.set("keyboard", "Piano");
stringsDict_fr.set("chord_neapolitan", "Accord napolitain :");
stringsDict_fr.set("chords_aug_6th", "Accords 6e augmentés :");
stringsDict_fr.set("chords_N_notes", "Accords de {%1} notes");
stringsDict_fr.set("chords_N_notes_all", "Tous les accords de {%1} notes :");
stringsDict_fr.set("chords_quartal", "Accords quartaux");
stringsDict_fr.set("instrument", "Instrument :");
stringsDict_fr.set("instruments_loading", "Veuillez patienter pendant le chargement des instruments...");
stringsDict_fr.set("listen", "Écouter");
stringsDict_fr.set("listen_backwards", "Écouter à l'envers");
stringsDict_fr.set("min_2_notes", "Au moins 2 notes requises");
stringsDict_fr.set("N_notes", "{%1} notes :");
stringsDict_fr.set("name", "Nom :");
stringsDict_fr.set("nb_bars", "Nb. de mesures :");
stringsDict_fr.set("nb_strings", "Nb. de cordes :");
stringsDict_fr.set("negative_scale", "Gamme négative :");
stringsDict_fr.set("no_result", "Pas de résultats");
stringsDict_fr.set("notes", "Notes :");
stringsDict_fr.set("play", "Jouer");
stringsDict_fr.set("play_arpeggio", "Jouer l'arpège");
stringsDict_fr.set("play_arpeggios", "Jouer les arpèges");
stringsDict_fr.set("play_backwards", "Jouer à l'envers");
stringsDict_fr.set("play_backwards_with_bass", "Jouer à l'envers avec basse");
stringsDict_fr.set("play_chords", "Jouer les accords");
stringsDict_fr.set("play_with_bass", "Jouer avec basse");
stringsDict_fr.set("position", "Position:");
stringsDict_fr.set("positions_all", "All");
stringsDict_fr.set("quarter_tones", "¼ tons");
stringsDict_fr.set("scales", "Gammes :");
stringsDict_fr.set("scales_compatible", "Gammes compatibles :");
stringsDict_fr.set("relative_scales", "Gammes relatives :");
stringsDict_fr.set("reset", "Réinitialiser");
stringsDict_fr.set("scale_keyboard_header", "Jouez dans la tonalité sélectionnée avec votre clavier");
stringsDict_fr.set("select_key", "Tonalité :");
stringsDict_fr.set("start", "Début :");
stringsDict_fr.set("start_from_octave", "Démarrer à l'octave :");
stringsDict_fr.set("show_barres", "Barrés");
stringsDict_fr.set("show_common_chords_only", "Accords courants seulement");
stringsDict_fr.set("show_empty_strings", "Cordes à vide");
stringsDict_fr.set("tempo", "Tempo :");
stringsDict_fr.set("title", "Boîte à outils musicale");
stringsDict_fr.set("tonic", "Tonique :");
stringsDict_fr.set("tuning", "Accordage :");
stringsDict_fr.set("welcome_title", "Découvrez la Boîte à outils Musicale");
stringsDict_fr.set("welcome_subtitle", "Que voulez-vous faire ?");
// global dictionary
const stringsDicts = new Map();
stringsDicts.set("int", stringsDict_int);
stringsDicts.set("fr", stringsDict_fr);
function getString(id, param = "") {
    const lang = getSelectedCulture();
    const stringsDict = stringsDicts.get(lang);
    let text = stringsDict_int.get(id); // fallback
    if (stringsDict.has(id))
        text = stringsDict.get(id);
    if (param != null)
        //text = text.replaceAll("{%1}", param); // not supported yet
        text = text.replace(/{%1}/g, param);
    return text;
}
function getNoteName(noteValue) {
    // get selected culture
    const lang = getSelectedCulture();
    const notesDict = notesDicts.get(lang);
    let noteName = "";
    let noteValueToProcess = noteValue;
    // xenharmonics specific: get nearest 1/2 tone and cents
    const isXenharmonic = isXenharmonicInterval(noteValue);
    let cents = 0;
    let sign = "+";
    if (isXenharmonic) {
        noteValueToProcess = Math.floor(noteValueToProcess);
        cents = noteValue - noteValueToProcess;
        if (cents >= 0.5) {
            cents = noteValueToProcess + 1 - noteValue;
            noteValueToProcess = (noteValueToProcess + 1) % 12;
            sign = "-";
        }
        cents = Math.round(100 * cents);
    }
    if (notesDict.has(noteValueToProcess))
        noteName = notesDict.get(noteValueToProcess);
    else
        noteName = notesDict_int.get(noteValueToProcess);
    if (isXenharmonic)
        noteName += `${sign}${cents}¢`;
    return noteName;
}
function getScaleString(id) {
    const lang = getSelectedCulture();
    const scalesDict = scalesDicts.get(lang);
    if (scalesDict.has(id))
        return scalesDict.get(id);
    else
        return scalesDict_int.get(id);
}
function getSelectedCulture() {
    const checkboxLanguage = document.getElementById("checkboxLanguage");
    const culture = checkboxLanguage.checked ? "fr" : "int";
    return culture;
}
// from https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (text) => { return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase(); });
}
//# sourceMappingURL=strings.js.map
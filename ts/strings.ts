// international
const stringsDict_int: Map<string, string> = new Map<string, string>();
stringsDict_int.set("chord_explorer_nb_strings_text", "strings played");
stringsDict_int.set("title", "Music Companion");
stringsDict_int.set("page_scale_explorer", "Explore scales");
stringsDict_int.set("page_scale_finder", "Find scales");
stringsDict_int.set("page_chord_explorer", "Find chords");
stringsDict_int.set("header_scale_finder", "Select your notes and chords:");
stringsDict_int.set("header_chord_explorer", "Select your note and chord:");
stringsDict_int.set("select_key", "Select your key:");
stringsDict_int.set("chords", "Chords");
stringsDict_int.set("guitar", "Guitar");
stringsDict_int.set("fretboard", "Fretboard");
stringsDict_int.set("keyboard", "Keyboard");
stringsDict_int.set("chords_N_notes", "Chords with {%1} notes");
stringsDict_int.set("chords_N_notes_all", "All chords with {%1} notes:");
stringsDict_int.set("min_2_notes", "At least 2 notes needed");
stringsDict_int.set("name", "Name:");
stringsDict_int.set("no_result", "Not found");
stringsDict_int.set("notes", "Notes:");
stringsDict_int.set("play", "Play");
stringsDict_int.set("play_arpeggio", "Play arpeggio");
stringsDict_int.set("scales", "Scales:");
stringsDict_int.set("relative_scales", "Relative scales:");
stringsDict_int.set("reset", "Reset");
stringsDict_int.set("show_barres", "Barres");
stringsDict_int.set("tonic", "Tonic:");
stringsDict_int.set("welcome_title", "Welcome to the Music Companion");
stringsDict_int.set("welcome_subtitle", "What do you want to do?");

// french notation
const stringsDict_fr: Map<string, string> = new Map<string, string>();
stringsDict_fr.set("chord_explorer_nb_strings_text", "cordes jouées");
stringsDict_fr.set("title", "Le compagnon musical");
stringsDict_fr.set("page_scale_explorer", "Explorer des gammes");
stringsDict_fr.set("page_scale_finder", "Trouver des gammes");
stringsDict_fr.set("page_chord_explorer", "Trouver des accords");
stringsDict_fr.set("header_scale_finder", "Notes et accords :");
stringsDict_fr.set("header_chord_explorer", "Note at accord :");
stringsDict_fr.set("select_key", "Tonalité :");
stringsDict_fr.set("chords", "Accords");
stringsDict_fr.set("guitar", "Guitare");
stringsDict_fr.set("fretboard", "Guitare");
stringsDict_fr.set("keyboard", "Piano");
stringsDict_fr.set("chords_N_notes", "Accords de {%1} notes");
stringsDict_fr.set("chords_N_notes_all", "Tous les accords de {%1} notes :");
stringsDict_fr.set("min_2_notes", "Au moins 2 notes requises");
stringsDict_fr.set("name", "Nom :");
stringsDict_fr.set("no_result", "Pas de résultats");
stringsDict_fr.set("notes", "Notes :");
stringsDict_fr.set("play", "Jouer");
stringsDict_fr.set("play_arpeggio", "Jouer l'arpège");
stringsDict_fr.set("scales", "Gammes :");
stringsDict_fr.set("relative_scales", "Gammes relatives :");
stringsDict_fr.set("reset", "Réinitialiser");
stringsDict_fr.set("show_barres", "Barrés");
stringsDict_fr.set("tonic", "Tonique :");
stringsDict_fr.set("welcome_title", "Bienvenue chez le Compagnon Musical");
stringsDict_fr.set("welcome_subtitle", "Que voulez-vous faire ?");

// global dictionary
const stringsDicts: Map<string, Map<string, string>> = new Map<string,Map<string, string>>();
stringsDicts.set("int", stringsDict_int);
stringsDicts.set("fr", stringsDict_fr);

function getString(id: string, param: string = ""): string
{
    const lang = getSelectedCulture();
    const stringsDict = stringsDicts.get(lang) as Map<string, string>;

    let text: string = stringsDict_int.get(id) as string; // fallback
    if (stringsDict.has(id))
        text = stringsDict.get(id) as string;

    if (param != null)
        //text = text.replaceAll("{%1}", param); // not supported yet
        text = text.replace(/{%1}/g, param);
    
    return text;
}

function getNoteName(noteValue: number): string
{
  // get selected culture
  const lang = getSelectedCulture(); 
  const notesDict = <Map<number, string>>notesDicts.get(lang);

  if (notesDict.has(noteValue))
    return <string>notesDict.get(noteValue);
  else
    return <string>notesDict_int.get(noteValue);
}

function getScaleString(id: string): string
{
    const lang: string = getSelectedCulture();
    const scalesDict: Map<string, string> = <Map<string, string>>scalesDicts.get(lang);

    if (scalesDict.has(id))
        return <string>scalesDict.get(id);
    else
        return <string>scalesDict_int.get(id);
}

function getSelectedCulture(): string
{
    const checkboxLanguage: HTMLInputElement = <HTMLInputElement>document.getElementById("checkboxLanguage");
    const culture: string = checkboxLanguage.checked ? "fr" : "int";
    return culture;
}
// international
const stringsDict_int = {};
stringsDict_int["chord_explorer_nb_strings_text"] = "strings played";
stringsDict_int["title"] = "Music Companion";
stringsDict_int["page_scale_explorer"] = "Explore scales";
stringsDict_int["page_scale_finder"] = "Find scales";
stringsDict_int["page_chord_explorer"] = "Find chords";
stringsDict_int["header_scale_finder"] = "Select your notes and chords:";
stringsDict_int["header_chord_explorer"] = "Select your note and chord:";
stringsDict_int["select_key"] = "Select your key:";
stringsDict_int["chords"] = "Chords";
stringsDict_int["guitar"] = "Guitar";
stringsDict_int["fretboard"] = "Fretboard";
stringsDict_int["keyboard"] = "Keyboard";
stringsDict_int["chords_N_notes"] = "Chords with {%1} notes";
stringsDict_int["chords_N_notes_all"] = "All chords with {%1} notes:";
stringsDict_int["min_2_notes"] = "At least 2 notes needed";
stringsDict_int["name"] = "Name:";
stringsDict_int["no_result"] = "Not found";
stringsDict_int["notes"] = "Notes:";
stringsDict_int["play"] = "Play";
stringsDict_int["play_arpeggio"] = "Play arpeggio";
stringsDict_int["scales"] = "Scales:";
stringsDict_int["relative_scales"] = "Relative scales:";
stringsDict_int["reset"] = "Reset";
stringsDict_int["show_barres"] = "Barres";
stringsDict_int["tonic"] = "Tonic:";
stringsDict_int["welcome_title"] = "Welcome to the Music Companion";
stringsDict_int["welcome_subtitle"] = "What do you want to do?";

// french notation
const stringsDict_fr = {};
stringsDict_fr["chord_explorer_nb_strings_text"] = "cordes jouées";
stringsDict_fr["title"] = "Le compagnon musical";
stringsDict_fr["page_scale_explorer"] = "Explorer des gammes";
stringsDict_fr["page_scale_finder"] = "Trouver des gammes";
stringsDict_fr["page_chord_explorer"] = "Trouver des accords";
stringsDict_fr["header_scale_finder"] = "Notes et accords :";
stringsDict_fr["header_chord_explorer"] = "Note at accord :";
stringsDict_fr["select_key"] = "Tonalité :";
stringsDict_fr["chords"] = "Accords";
stringsDict_fr["guitar"] = "Guitare";
stringsDict_fr["fretboard"] = "Guitare";
stringsDict_fr["keyboard"] = "Piano";
stringsDict_fr["chords_N_notes"] = "Accords de {%1} notes";
stringsDict_fr["chords_N_notes_all"] = "Tous les accords de {%1} notes :";
stringsDict_fr["min_2_notes"] = "Au moins 2 notes requises";
stringsDict_fr["name"] = "Nom :";
stringsDict_fr["no_result"] = "Pas de résultats";
stringsDict_fr["notes"] = "Notes :";
stringsDict_fr["play"] = "Jouer";
stringsDict_fr["play_arpeggio"] = "Jouer l'arpège";
stringsDict_fr["scales"] = "Gammes :";
stringsDict_fr["relative_scales"] = "Gammes relatives :";
stringsDict_fr["reset"] = "Réinitialiser";
stringsDict_fr["show_barres"] = "Barrés";
stringsDict_fr["tonic"] = "Tonique :";
stringsDict_fr["welcome_title"] = "Bienvenue chez le Compagnon Musical";
stringsDict_fr["welcome_subtitle"] = "Que voulez-vous faire ?";

// global dictionary
const stringsDicts = {};
stringsDicts["int"] = stringsDict_int;
stringsDicts["fr"] = stringsDict_fr;

function getString(id, param = "")
{
    const lang = getSelectedCulture();
    const stringsDict = stringsDicts[lang];

    let text = stringsDict_int[id]; // fallback
    if (stringsDict.hasOwnProperty(id))
        text = stringsDict[id];

    if (param != null)
        text = text.replaceAll("{%1}", param);
    
    return text;
}

function getNoteName(noteValue)
{
  // get selected culture
  const lang = getSelectedCulture(); 
  const notesDict = notesDicts[lang];

  if (notesDict.hasOwnProperty(noteValue))
    return notesDict[noteValue];
  else
    return notesDict_int[noteValue];
}

function getScaleString(id)
{
    const lang = getSelectedCulture();
    const scalesDict = scalesDicts[lang];

    if (scalesDict.hasOwnProperty(id))
        return scalesDict[id];
    else
        return scalesDict_int[id];
}
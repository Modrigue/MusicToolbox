// international
const stringsDict_int = {};
stringsDict_int["title"] = "Music Companion";
stringsDict_int["header_title"] = "Music Scale Explorer";
stringsDict_int["select_key"] = "Select your key:";
stringsDict_int["chords"] = "Chords";
stringsDict_int["guitar"] = "Guitar";
stringsDict_int["fretboard"] = "Fretboard";
stringsDict_int["keyboard"] = "Keyboard";
stringsDict_int["chords_3_notes"] = "Chords with 3 notes";
stringsDict_int["chords_4_notes"] = "Chords with 4 notes";
stringsDict_int["play"] = "Play";
stringsDict_int["relative_scales"] = "Relative scales:";
stringsDict_int["no_result"] = "Not found";

// french notation
const stringsDict_fr = {};
stringsDict_fr["title"] = "Le compagnon musical";
stringsDict_fr["header_title"] = "Explorateur de gammes musicales";
stringsDict_fr["select_key"] = "Tonalité :";
stringsDict_fr["chords"] = "Accords";
stringsDict_fr["guitar"] = "Guitare";
stringsDict_fr["fretboard"] = "Guitare";
stringsDict_fr["keyboard"] = "Piano";
stringsDict_fr["chords_3_notes"] = "Accords de 3 notes";
stringsDict_fr["chords_4_notes"] = "Accords de 4 notes";
stringsDict_fr["play"] = "Jouer";
stringsDict_fr["relative_scales"] = "Gammes relatives :";
stringsDict_fr["no_result"] = "Pas de résultats";

// global dictionary
const stringsDicts = {};
stringsDicts["int"] = stringsDict_int;
stringsDicts["fr"] = stringsDict_fr;

function getString(id)
{
    const lang = getSelectedCulture();
    const stringsDict = stringsDicts[lang];

    if (stringsDict.hasOwnProperty(id))
        return stringsDict[id];
    else
        return stringsDict_int[id];
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
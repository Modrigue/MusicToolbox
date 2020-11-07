// international
var stringsDict_int = {};
stringsDict_int["select_key"] = "Select your key:";
stringsDict_int["chords"] = "Chords";
stringsDict_int["guitar"] = "Guitar";
stringsDict_int["fretboard"] = "Fretboard";
stringsDict_int["keyboard"] = "Keyboard";
stringsDict_int["chords_3_notes"] = "Chords with 3 notes";
stringsDict_int["chords_4_notes"] = "Chords with 4 notes";
stringsDict_int["play"] = "Play";

// french notation
var stringsDict_fr = {};
stringsDict_fr["select_key"] = "Tonalité :";
stringsDict_fr["chords"] = "Accords";
stringsDict_fr["guitar"] = "Guitare";
stringsDict_fr["fretboard"] = "Manche";
stringsDict_fr["keyboard"] = "Piano";
stringsDict_fr["chords_3_notes"] = "Accords de 3 notes";
stringsDict_fr["chords_4_notes"] = "Accords de 4 notes";
stringsDict_fr["play"] = "Jouer";

// global dictionary
var stringsDicts = {};
stringsDicts["int"] = stringsDict_int;
stringsDicts["fr"] = stringsDict_fr;

function getString(id)
{
    var lang = getSelectedCulture();
    var stringsDict = stringsDicts[lang];

    if (stringsDict.hasOwnProperty(id))
        return stringsDict[id];
    else
        return stringsDict_int[id];
}

function getScaleString(id)
{
    var lang = getSelectedCulture();
    var scalesDict = scalesDicts[lang];

    if (scalesDict.hasOwnProperty(id))
        return scalesDict[id];
    else
        return scalesDict_int[id];
}
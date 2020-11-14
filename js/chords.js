// chords dictionaries

// chords with 2 notes
const chords2Dict = {};
chords2Dict["5"]  = [0, 7];

// chords with 3 notes
const chords3Dict = {};
chords3Dict["M"]                = [0, 4, 7];
chords3Dict["m"]                = [0, 3, 7];
chords3Dict["°"]                = [0, 3, 6];
chords3Dict["+"]                = [0, 4, 8];
chords3Dict["♭5"]               = [0, 4, 6];
chords3Dict["sus2"]             = [0, 2, 7];
chords3Dict["sus2♭5"]           = [0, 2, 6];
chords3Dict["sus4"]             = [0, 5, 7];
chords3Dict["sus4#5"]           = [0, 5, 8];
chords3Dict["m#5"]              = [0, 3, 8];
chords3Dict["6M(no5)"]          = [0, 4, 9];
chords3Dict["6(no5)"]           = [0, 3, 9];
chords3Dict["m7sus4(no5)"]      = [0, 5, 10];
chords3Dict["6sus4(no5)"]       = [0, 5, 9];
chords3Dict["6♭5(no3)"]         = [0, 6, 9];
chords3Dict["madd4(no5)"]       = [0, 3, 5];
chords3Dict["sus2add4(no5)"]    = [0, 2, 5];

// chords with 4 notes
const chords4Dict = {};
chords4Dict["7M"]               = [0, 4, 7, 11];
chords4Dict["7"]                = [0, 4, 7, 10];
chords4Dict["m7"]               = [0, 3, 7, 10];
chords4Dict["m7M"]              = [0, 3, 7, 11];
chords4Dict["7♭5"]              = [0, 4, 6, 10];
chords4Dict["m7♭5"]             = [0, 3, 6, 10];
chords4Dict["m7M♭5"]            = [0, 3, 6, 11];
chords4Dict["m7M#5"]            = [0, 3, 8, 11];
chords4Dict["7#5"]              = [0, 4, 8, 10];
chords4Dict["7M#5"]             = [0, 4, 8, 11];
chords4Dict["7M♭5"]             = [0, 4, 6, 11];
chords4Dict["add9"]             = [0, 4, 7, 14];
chords4Dict["madd9"]            = [0, 3, 7, 14];
chords4Dict["6M"]               = [0, 4, 7, 9];
chords4Dict["6♭5"]              = [0, 4, 6, 9];
chords4Dict["m6M"]              = [0, 3, 7, 9];
chords4Dict["m°7"]              = [0, 3, 6, 9];
chords4Dict["m6♭5"]             = [0, 3, 6, 8];
chords4Dict["sus2add6♭5"]       = [0, 2, 6, 9];
chords4Dict["sus2add4#5"]       = [0, 2, 5, 8];
chords4Dict["6Msus2add4(no5)"]  = [0, 2, 5, 9];
chords4Dict["7sus2♭5"]          = [0, 2, 6, 10];
chords4Dict["6sus2"]            = [0, 2, 7, 9];
chords4Dict["7Msus2"]           = [0, 2, 7, 11];
chords4Dict["7Msus4"]           = [0, 5, 7, 11];
chords4Dict["7Msus4#5"]         = [0, 5, 8, 11];
chords4Dict["7Msus4##5"]        = [0, 5, 9, 11];
chords4Dict["madd4/#5"]         = [0, 3, 5, 8];
chords4Dict["m7add4(no5)"]      = [0, 3, 5, 10];
chords4Dict["m6Madd4(no5)"]     = [0, 3, 5, 9];

// global chords array
const chordsDicts = {};
chordsDicts[2] = chords2Dict;
chordsDicts[3] = chords3Dict;
chordsDicts[4] = chords4Dict;

/////////////////////////////////// FUNCTIONS /////////////////////////////////

function initChordSelector(id, defaultChordValue = -1, firstChordEmpty = false)
{
    // get chord selecor
    const chordSelect = document.getElementById(id);

    // fill chord selector
    if (firstChordEmpty)
    {
        let option = document.createElement('option');
        option.value = -1;
        option.innerHTML = "";
        if (defaultChordValue == -1)
            option.selected = true;
        chordSelect.appendChild(option);
    }

    // init
    for (const nbNotesInChord in chordsDicts)
    {
        const chordsDict = chordsDicts[nbNotesInChord];

        // add header
        let header = document.createElement('option');
        header.value = nbNotesInChord;
        header.innerHTML = "-- " + nbNotesInChord.toString() + " NOTES --";
        header.classList.add('bolden');
        header.disabled = true;
        chordSelect.appendChild(header);

        // add chords
        for (const key in chordsDict)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getAltChordNotation(key);
            if (key == defaultChordValue)
                option.selected = true;
            chordSelect.appendChild(option);
        }

        // add separator
        if (nbNotesInChord < 4) // TEMP
        {
            let separator = document.createElement('option');
            separator.value = nbNotesInChord;
            separator.innerHTML = "";
            separator.disabled = true;
            chordSelect.appendChild(separator);
        }
    }
}

function getChordValues(id)
{
    for (const nbNotesInChord in chordsDicts)
    {
        const chordsDict = chordsDicts[nbNotesInChord];
        for (const key in chordsDict)
            if (key == id)
                return chordsDict[key];
    }
}

function getAltChordNotation(chord)
{
    // alternate notations
    switch (chord)
    {
        case "M":
            return "MAJ";

        case "m":
            return "min";

        case "°":
            return "dim, °";

        case "+":
            return "aug, °";
    }

    return chord;
}
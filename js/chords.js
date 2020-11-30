// chords dictionaries

// chords with 2 notes
const chords2Dict = {};
chords2Dict["5"]  = [0, 7];

// chords with 3 notes
const chords3Dict = {};
chords3Dict["M"]                = [0, 4, 7];
chords3Dict["m"]                = [0, 3, 7];
chords3Dict["dim"]              = [0, 3, 6];
chords3Dict["aug"]              = [0, 4, 8];
chords3Dict["flat5"]            = [0, 4, 6];
chords3Dict["sus2"]             = [0, 2, 7];
chords3Dict["sus2flat5"]        = [0, 2, 6];
chords3Dict["sus4"]             = [0, 5, 7];
chords3Dict["sus4sharp5"]       = [0, 5, 8];
chords3Dict["msharp5"]          = [0, 3, 8];
chords3Dict["6M(no5)"]          = [0, 4, 9];
chords3Dict["6(no5)"]           = [0, 3, 9];
chords3Dict["m7sus4(no5)"]      = [0, 5, 10];
chords3Dict["6sus4(no5)"]       = [0, 5, 9];
chords3Dict["6flat5(no3)"]      = [0, 6, 9];
chords3Dict["madd4(no5)"]       = [0, 3, 5];
chords3Dict["sus2add4(no5)"]    = [0, 2, 5];
chords3Dict["phryg"]            = [0, 1, 7]; // phrygian
chords3Dict["lyd"]              = [0, 6, 7]; // lydian
chords3Dict["loc"]              = [0, 5, 6]; // locrian

// chords with 4 notes
const chords4Dict = {};
chords4Dict["add9"]               = [0, 4, 7, 14];
chords4Dict["madd9"]              = [0, 3, 7, 14];
chords4Dict["add4"]               = [0, 4, 5, 8];
chords4Dict["madd4"]              = [0, 3, 5, 8];
chords4Dict["7M"]                 = [0, 4, 7, 11];
chords4Dict["7"]                  = [0, 4, 7, 10];
chords4Dict["m7"]                 = [0, 3, 7, 10];
chords4Dict["m7M"]                = [0, 3, 7, 11];
chords4Dict["7Msus2"]             = [0, 2, 7, 11];
chords4Dict["7Msus4"]             = [0, 5, 7, 11];
chords4Dict["m7sus2"]             = [0, 2, 7, 10];
chords4Dict["m7sus4"]             = [0, 5, 7, 10];
chords4Dict["7flat5"]             = [0, 4, 6, 10];
chords4Dict["m7flat5"]            = [0, 3, 6, 10];
chords4Dict["m7Mflat5"]           = [0, 3, 6, 11];
chords4Dict["m7Msharp5"]          = [0, 3, 8, 11];
chords4Dict["7sharp5"]            = [0, 4, 8, 10];
chords4Dict["7Msharp5"]           = [0, 4, 8, 11];
chords4Dict["7Mflat5"]            = [0, 4, 6, 11];
chords4Dict["6M"]                 = [0, 4, 7, 9];
chords4Dict["6"]                  = [0, 4, 7, 8];
chords4Dict["m6"]                 = [0, 3, 7, 8];
chords4Dict["m6M"]                = [0, 3, 7, 9];
chords4Dict["6flat5"]             = [0, 4, 6, 9];
chords4Dict["mdim7"]              = [0, 3, 6, 9];
chords4Dict["m6flat5"]            = [0, 3, 6, 8];
chords4Dict["sus2add6flat5"]      = [0, 2, 6, 9];
chords4Dict["sus2add4sharp5"]     = [0, 2, 5, 8];
chords4Dict["6Msus2add4(no5)"]    = [0, 2, 5, 9];
chords4Dict["7sus2flat5"]         = [0, 2, 6, 10];
chords4Dict["6sus2"]              = [0, 2, 7, 9];
chords4Dict["7Msus4sharp5"]       = [0, 5, 8, 11];
chords4Dict["7Msus4sharpsharp5"]  = [0, 5, 9, 11];
chords4Dict["m7add4(no5)"]        = [0, 3, 5, 10];
chords4Dict["m6Madd4(no5)"]       = [0, 3, 5, 9];

// chords with 5 notes
const chords5Dict = {};
chords5Dict["9M"]               = [0, 4, 7, 11, 14];
chords5Dict["9"]                = [0, 4, 7, 10, 14];
chords5Dict["m9"]               = [0, 3, 7, 10, 14];
chords5Dict["m9M"]              = [0, 3, 7, 11, 14];
chords5Dict["9Msus4"]           = [0, 5, 7, 11, 14];
chords5Dict["m9sus4"]           = [0, 5, 7, 10, 14];


// global chords array
const chordsDicts = {};
chordsDicts[2] = chords2Dict;
chordsDicts[3] = chords3Dict;
chordsDicts[4] = chords4Dict;
chordsDicts[5] = chords5Dict;

/////////////////////////////////// FUNCTIONS /////////////////////////////////

function initChordSelector(id, defaultChordId = -1, firstChordEmpty = false)
{
    // get chord selecor
    const chordSelect = document.getElementById(id);
    const initialized = (chordSelect.options != null && chordSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;

    // get chord parameter if existing
    const chordParamValue = parseParameterById("chord");

    if (chordParamValue != "")
        defaultChordId = chordParamValue;

    // fill chord selector
    if (firstChordEmpty)
    {
        let option = document.createElement('option');
        option.value = -1;
        option.innerHTML = "";
        if (defaultChordId == -1)
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
        header.innerHTML = `-- ${nbNotesInChord.toString()} NOTES --`;
        header.classList.add('bolden');
        header.disabled = true;
        chordSelect.appendChild(header);

        // add chords
        for (const key in chordsDict)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getAltChordNotation(key);
            if (key == defaultChordId)
                option.selected = true;
            chordSelect.appendChild(option);
        }

        // add separator
        if (nbNotesInChord < 5) // TEMP
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

////////////////////////////// CHORDS NOTATIONS ///////////////////////////////


// get chord compact representation (for tables)
function getCompactChordNotation(text, chordID)
{
  let suffix = chordID; // default
  switch (chordID)
  {
    case "M":
      suffix = "";
      break;
  }
  
  suffix = suffix.replaceAll("sharp", "#");
  suffix = suffix.replaceAll("flat", "♭");
  suffix = suffix.replaceAll("dim", "°");
  suffix = suffix.replaceAll("aug", "+");

  return text + suffix;
}

// get alternate chord notations (for selectors)
function getAltChordNotation(chordId)
{
    let notation = chordId;
    switch (chordId)
    {
        case "M":
            return "MAJ";

        case "m":
            return "min";

        case "dim":
            return "dim, °";

        case "aug":
            return "aug, +";
    }

    notation = notation.replaceAll("sharp", "#");
    notation = notation.replaceAll("flat", "♭");
    notation = notation.replaceAll("dim", "°");
    notation = notation.replaceAll("aug", "+");

    return notation;
}


////////////////////////////////// ARPEGGIOS //////////////////////////////////


function getArpeggioNotes(noteFondamental, chordValues)
{
    let arpeggioNotesStr = "";
    chordValues.forEach(function (intervalValue)
    {
      const newNoteValue = addToNoteValue(noteFondamental, intervalValue);
      const noteName = getNoteName(newNoteValue);
      arpeggioNotesStr += noteName + ",&nbsp;";
    });
    arpeggioNotesStr = arpeggioNotesStr.slice(0, -7);
    
    return arpeggioNotesStr;
}

function getArpeggioIntervals(chordValues)
{
    let arpeggioIntervalsStr = "";
    chordValues.forEach(function (intervalValue)
    {
      let intervalName = intervalsDict[intervalValue];
      if (intervalName == "T")
        intervalName = "F"; // fondamental

      arpeggioIntervalsStr += intervalName + ",&nbsp;";
    });
    arpeggioIntervalsStr = arpeggioIntervalsStr.slice(0, -7);

    return arpeggioIntervalsStr;
}

function getChordDictionary(nbNotes)
{
    let chordsDict = chords2Dict;
    switch (nbNotes)
    {
        case 3:
            chordsDict = chords3Dict;
            break;

        case 4:
            chordsDict = chords4Dict;
            break;

        case 5:
            chordsDict = chords5Dict;
            break;
    }

    return chordsDict;
}
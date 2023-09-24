// chords dictionaries

// chords with 2 notes
const chords2Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords2Dict.set("5", [0, 7]);

// chords with 3 notes
const chords3Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords3Dict.set("M",                [0, 4, 7]);
chords3Dict.set("m",                [0, 3, 7]);
chords3Dict.set("sus2",             [0, 2, 7]);
chords3Dict.set("sus4",             [0, 5, 7]);
chords3Dict.set("dim",              [0, 3, 6]);
chords3Dict.set("aug",              [0, 4, 8]);
chords3Dict.set("phryg",            [0, 1, 7]); // phrygian
chords3Dict.set("lyd",              [0, 6, 7]); // lydian
chords3Dict.set("loc",              [0, 5, 6]); // locrian
chords3Dict.set("vien",             [0, 1, 6]); // Viennese
chords3Dict.set("It+6",             [0, 4, 10]); // Italian augmented 6th
chords3Dict.set("5add9",            [0, 7, 14]);
chords3Dict.set("flat5",            [0, 4, 6]);
chords3Dict.set("sus2flat5",        [0, 2, 6]);
chords3Dict.set("sus2sharp5",       [0, 2, 8]);
chords3Dict.set("sus4sharp5",       [0, 5, 8]);
chords3Dict.set("q",                [0, 5, 10]); // quartal chords
chords3Dict.set("+4q",              [0, 6, 11]);
chords3Dict.set("q+4",              [0, 5, 11]);
chords3Dict.set("7M(no5)",          [0, 4, 11]);
chords3Dict.set("m7(no5)",          [0, 3, 10]);
chords3Dict.set("7M(no3)",          [0, 7, 11]);
chords3Dict.set("m7(no3)",          [0, 7, 10]);
chords3Dict.set("m7flat5(no3)",     [0, 6, 10]);
chords3Dict.set("6M(no5)",          [0, 4, 9]);
chords3Dict.set("m6(no5)",          [0, 3, 8]);
chords3Dict.set("dor(no5)",         [0, 3, 9]);
chords3Dict.set("6sus4(no5)",       [0, 5, 9]);
chords3Dict.set("6flat5(no3)",      [0, 6, 9]);
chords3Dict.set("add4(no5)",        [0, 4, 5]);
chords3Dict.set("madd4(no5)",       [0, 3, 5]);
chords3Dict.set("sus2add4(no5)",    [0, 2, 5]);
chords3Dict.set("65",               [0, 7, 9]);
chords3Dict.set("m65",              [0, 7, 8]);

// chords with 4 notes
const chords4Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords4Dict.set("7M",                 [0, 4, 7, 11]);
chords4Dict.set("7",                  [0, 4, 7, 10]);
chords4Dict.set("m7",                 [0, 3, 7, 10]);
chords4Dict.set("m7M",                [0, 3, 7, 11]);
chords4Dict.set("add9",               [0, 4, 7, 14]);
chords4Dict.set("madd9",              [0, 3, 7, 14]);
chords4Dict.set("add11",              [0, 4, 7, 17]);
chords4Dict.set("madd11",             [0, 3, 7, 17]);
chords4Dict.set("7Msus2",             [0, 2, 7, 11]);
chords4Dict.set("7Msus4",             [0, 5, 7, 11]);
chords4Dict.set("m7sus2",             [0, 2, 7, 10]);
chords4Dict.set("m7sus4",             [0, 5, 7, 10]);
chords4Dict.set("m7flat5",            [0, 3, 6, 10]);
chords4Dict.set("m7Mflat5",           [0, 3, 6, 11]);
chords4Dict.set("m7Msharp5",          [0, 3, 8, 11]);
chords4Dict.set("7Msharp5",           [0, 4, 8, 11]);
chords4Dict.set("7Mflat5",            [0, 4, 6, 11]);
chords4Dict.set("dim7",               [0, 3, 6, 9]);
chords4Dict.set("6M",                 [0, 4, 7, 9]);
chords4Dict.set("6",                  [0, 4, 7, 8]);
chords4Dict.set("m6",                 [0, 3, 7, 8]);
chords4Dict.set("dor",                [0, 3, 7, 9]);
chords4Dict.set("6flat5",             [0, 4, 6, 9]);
chords4Dict.set("sus2add6flat5",      [0, 2, 6, 9]);
chords4Dict.set("sus2add4sharp5",     [0, 2, 5, 8]);
chords4Dict.set("6Msus2add4(no5)",    [0, 2, 5, 9]);
chords4Dict.set("7sus2flat5",         [0, 2, 6, 10]);
chords4Dict.set("6sus2",              [0, 2, 7, 9]);
chords4Dict.set("7Msus4sharp5",       [0, 5, 8, 11]);
chords4Dict.set("7Msus4sharpsharp5",  [0, 5, 9, 11]);
chords4Dict.set("7Maddsharp11(no5)",  [0, 4, 11, 18]);
chords4Dict.set("susb9",              [0, 5, 7, 13]);
chords4Dict.set("m7add4(no5)",        [0, 3, 5, 10]);
chords4Dict.set("doradd4(no5)",       [0, 3, 5, 9]);
chords4Dict.set("13M(modern)",        [0, 4, 11, 21]);
chords4Dict.set("13(modern)",         [0, 4, 10, 21]);
chords4Dict.set("m13(modern)",        [0, 3, 10, 21]);
chords4Dict.set("m13M(modern)",       [0, 3, 11, 21]);
chords4Dict.set("altdom",             [0, 4, 9, 13]); // altered dominant
chords4Dict.set("Fr+6",               [0, 4, 6, 10]); // French augmented 6th
chords4Dict.set("hendrix(no5)",       [0, 4, 10, 15]); // Hendrix
chords4Dict.set("dream",              [0, 5, 6, 7]);
chords4Dict.set("tristan",            [0, 6, 10, 15]);

// chords with 5 notes
const chords5Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords5Dict.set("9M",               [0, 4, 7, 11, 14]);
chords5Dict.set("9",                [0, 4, 7, 10, 14]);
chords5Dict.set("m9",               [0, 3, 7, 10, 14]);
chords5Dict.set("m9M",              [0, 3, 7, 11, 14]);
chords5Dict.set("9Msus",            [0, 5, 7, 11, 14]);
chords5Dict.set("m9sus",            [0, 5, 7, 10, 14]);
chords5Dict.set("6slash9",          [0, 4, 7,  9, 14]);
chords5Dict.set("7Mflat5flat9",     [0, 4, 6, 11, 13]);
chords5Dict.set("7flat5flat9",      [0, 4, 6, 10, 13]);
chords5Dict.set("m7flat5flat9",     [0, 3, 6, 10, 13]);
chords5Dict.set("m7Mflat5flat9",    [0, 3, 6, 11, 13]);
chords5Dict.set("7Madd9",           [0, 4, 7, 11, 14]);
chords5Dict.set("7add9",            [0, 4, 7, 10, 14]);
chords5Dict.set("m7add9",           [0, 3, 7, 10, 14]);
chords5Dict.set("m7Madd9",          [0, 3, 7, 11, 14]);
chords5Dict.set("7Madd11",          [0, 4, 7, 11, 17]);
chords5Dict.set("7add11",           [0, 4, 7, 10, 17]);
chords5Dict.set("m7add11",          [0, 3, 7, 10, 17]);
chords5Dict.set("m7Madd11",         [0, 3, 7, 11, 17]);
chords5Dict.set("7Maddsharp11",     [0, 4, 7, 11, 18]);
chords5Dict.set("7addsharp11",      [0, 4, 7, 10, 18]);
chords5Dict.set("m7addsharp11",     [0, 3, 7, 10, 18]);
chords5Dict.set("m7Maddsharp11",    [0, 3, 7, 11, 18]);
chords5Dict.set("7Madd13",          [0, 4, 7, 11, 21]);
chords5Dict.set("7add13",           [0, 4, 7, 10, 21]);
chords5Dict.set("m7add13",          [0, 3, 7, 10, 21]);
chords5Dict.set("m7Madd13",         [0, 3, 7, 11, 21]);
chords5Dict.set("11M(no5)",         [0, 4, 11, 14, 17]);
chords5Dict.set("11(no5)",          [0, 4, 10, 14, 17]);
chords5Dict.set("m11(no5)",         [0, 3, 10, 14, 17]);
chords5Dict.set("m11M(no5)",        [0, 3, 11, 14, 17]);
chords5Dict.set("sowhat",           [0, 5, 10, 15, 19]);
chords5Dict.set("hendrix",          [0, 4, 7, 10, 15]); // Hendrix
chords5Dict.set("beta",             [0, 3, 6, 9 , 11]);
chords5Dict.set("gamma",            [0, 3, 6, 8 , 11]);
chords5Dict.set("elektra",          [0, 7, 9, 13, 16]);
chords5Dict.set("farben",           [0, 8, 11, 16, 21]);

// chords with 6 notes
const chords6Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords6Dict.set("11M",               [0, 4, 7, 11, 14, 17]);
chords6Dict.set("11",                [0, 4, 7, 10, 14, 17]);
chords6Dict.set("m11",               [0, 3, 7, 10, 14, 17]);
chords6Dict.set("m11M",              [0, 3, 7, 11, 14, 17]);
chords6Dict.set("11Mflat9",          [0, 4, 7, 11, 13, 17]);
chords6Dict.set("11flat9",           [0, 4, 7, 10, 13, 17]);
chords6Dict.set("m11flat9",          [0, 3, 7, 10, 13, 17]);
chords6Dict.set("m11Mflat9",         [0, 3, 7, 11, 13, 17]);
chords6Dict.set("13M(no5)",          [0, 4, 11, 14, 17, 21]);
chords6Dict.set("13(no5)",           [0, 4, 10, 14, 17, 21]);
chords6Dict.set("m13(no5)",          [0, 3, 10, 14, 17, 21]);
chords6Dict.set("m13M(no5)",         [0, 3, 11, 14, 17, 21]);
chords6Dict.set("bridge",            [0, 3, 7, 14, 18, 21]);
chords6Dict.set("mystic",            [0, 6, 10, 16, 21, 26]);

// disabled for now: chords with 7 notes
const chords7Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
chords7Dict.set("13M",               [0, 4, 7, 11, 14, 17, 21]);
chords7Dict.set("13",                [0, 4, 7, 10, 14, 17, 21]);
chords7Dict.set("m13",               [0, 3, 7, 10, 14, 17, 21]);
chords7Dict.set("m13M",              [0, 3, 7, 11, 14, 17, 21]);
chords7Dict.set("13Mflat9",          [0, 4, 7, 11, 13, 17, 21]);
chords7Dict.set("13flat9",           [0, 4, 7, 10, 13, 17, 21]);
chords7Dict.set("m13flat9",          [0, 3, 7, 10, 13, 17, 21]);
chords7Dict.set("m13Mflat9",         [0, 3, 7, 11, 13, 17, 21]);
chords7Dict.set("13Msharp9",         [0, 4, 7, 11, 13, 17, 21]);
chords7Dict.set("13sharp9",          [0, 4, 7, 10, 13, 17, 21]);
chords7Dict.set("m13sharp9",         [0, 3, 7, 10, 13, 17, 21]);
chords7Dict.set("m13Msharp9",        [0, 3, 7, 11, 13, 17, 21]);
chords7Dict.set("13Msus",            [0, 5, 7, 11, 14, 17, 21]); // sus4?
chords7Dict.set("m13sus",            [0, 5, 7, 10, 14, 17, 21]); // sus4?


// global chords dictionary
const chordsDicts: Map<number, Map<string, Array<number>>> = new Map<number, Map<string, Array<number>>>();
chordsDicts.set(2, chords2Dict);
chordsDicts.set(3, chords3Dict);
chordsDicts.set(4, chords4Dict);
chordsDicts.set(5, chords5Dict);
chordsDicts.set(6, chords6Dict);
//chordsDicts.set(7, chords7Dict);

/////////////////////////////////// FUNCTIONS /////////////////////////////////

function initChordSelector(id: string, defaultChordId: string = "-1",
    firstChordEmpty: boolean = false, showQTonesChords: boolean = false,
    reset: boolean = false): void
{
    // get chord selector
    const chordSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    
    // if reset option set, remove all options
    if (reset)
        while (chordSelect.firstChild)
            chordSelect.firstChild.remove();
    
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
        let option: HTMLOptionElement = document.createElement('option');
        option.value = "-1";
        option.innerHTML = "";
        if (defaultChordId == "-1")
            option.selected = true;
        chordSelect.appendChild(option);
    }

    // disable chords options given selected nb. of strings
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');

    // init
    for (const [nbNotesInChord, chordsDict] of chordsDicts)
    {
        // add header
        let header: HTMLOptionElement = document.createElement('option');
        header.value = nbNotesInChord.toString();
        header.innerHTML = `-- ${nbNotesInChord.toString()} NOTES --`;
        header.classList.add('bolden');
        header.disabled = true;
        chordSelect.appendChild(header);

        // add chords
        for (const [key, value] of chordsDict)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = getAltChordNotation(key);
            option.disabled = (nbNotesInChord > nbStrings);
            if (key == defaultChordId && !option.disabled)
                option.selected = true;

            let includeChord = true;
            if (!showQTonesChords && isQuarterToneChord(key))
                includeChord = false;

            if (includeChord)
                chordSelect.appendChild(option);
        }

        // add separator
        if (nbNotesInChord < 6) // TEMP
        {
            let separator = document.createElement('option');
            separator.value = nbNotesInChord.toString();
            separator.innerHTML = "";
            separator.disabled = true;
            chordSelect.appendChild(separator);
        }
    }
}

function updateChordSelectorGivenNbStrings(id: string): void
{
    // get chord selector
    const chordSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (chordSelect.options != null && chordSelect.options.length > 0);
    if (!initialized) // nop if not initialized
        return;

    // disable chords options given selected nb. of strings
    const nbStrings: number = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');

    for (let option of chordSelect.options)
    {
        const id = option.value;
        const chordValues: Array<number> = getChordValues(id);
        const nbNotesInChord: number = chordValues.length;
        if (nbNotesInChord == 0)
            continue;

        option.disabled = (nbNotesInChord > nbStrings);
        if (option.selected && option.disabled)
            chordSelect.selectedIndex = 4; // default chord
    }
}

function getChordValues(id: string): Array<number>
{
    for (const [nbNotesInChord, chordsDict] of chordsDicts)
        for (const [key, value] of chordsDict)
            if (key == id)
                return value;

    return [];
}

function getChordIntervalsWithBass(fondamentalValue: number, chordValues: Array<number>,
    bassValue: number = -1): Array<number>
{
    let chordValuesWithBass = cloneIntegerArray(chordValues);
    const fondamentalValueInOctave = (fondamentalValue % 12);

    // add bass if specified
    if (bassValue >= 0 && bassValue != fondamentalValueInOctave)
    {
        // check if bass corresponds to chord inversion
        const bassIntervalValue = (bassValue - fondamentalValueInOctave + 12) % 12;
        let bassIndex = -1;
        for (let octave = 0; octave <= 2; octave++)
        {
            bassIndex = chordValuesWithBass.indexOf(bassIntervalValue + 12*octave);
            if (bassIndex >= 0)
                break;
        }

        // bass corresponds to chord inversion
        if (bassIndex >= 0)
        {
            // 1st pass: invert chord
            for (let i = 0; i < bassIndex; i++)
            {
                const interval = <number>chordValuesWithBass.shift(); // remove 1st element
                chordValuesWithBass.push(interval + 12);
            }

            // 2nd pass: check intervals ascending order and correct octave if needed
            for (let i = 1; i < chordValuesWithBass.length; i++)
            {
                const intervalPrev = chordValuesWithBass[i - 1];
                const intervalCur = chordValuesWithBass[i];

                if (intervalCur <= intervalPrev)
                {
                    for (let j = i; j < chordValuesWithBass.length; j++)
                    {
                        while (chordValuesWithBass[j] <= chordValuesWithBass[j - 1])
                            chordValuesWithBass[j] += 12;
                    }
                }
                
            }
        }
        // not a chord inversion
        else
        {
            chordValuesWithBass.unshift(bassIntervalValue - 12);
        }
    }

    return chordValuesWithBass;
}

////////////////////////////// CHORDS NOTATIONS ///////////////////////////////


// get chord compact representation (for tables)
function getCompactChordNotation(text: string, chordID: string): string
{
  let suffix = chordID; // default
  switch (chordID)
  {
    case "M":
      suffix = "";
      break;
  }
  
//   suffix = suffix.replaceAll("sharp", "#");
//   suffix = suffix.replaceAll("flat", "♭");
//   suffix = suffix.replaceAll("dim", "°");
//   suffix = suffix.replaceAll("aug", "+");
  suffix = suffix.replace(/sharp/g, "#");
  suffix = suffix.replace(/flat/g , "♭");
  suffix = suffix.replace(/dim/g  , "°");
  suffix = suffix.replace(/aug/g  , "+");
  suffix = suffix.replace(/slash/g, "/");

  return text + suffix;
}

// get alternate chord notations (for selectors)
function getAltChordNotation(chordId: string): string
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

        case "dor":
            return "dor, m6M";

        case "mystic":
            return "mystic, prom";
    }

    // notation = notation.replaceAll("sharp", "#");
    // notation = notation.replaceAll("flat", "♭");
    // notation = notation.replaceAll("dim", "°");
    // notation = notation.replaceAll("aug", "+");
    notation = notation.replace(/sharp/g, "#");
    notation = notation.replace(/flat/g , "♭");
    notation = notation.replace(/dim/g  , "°");
    notation = notation.replace(/aug/g  , "+");
    notation = notation.replace(/slash/g, "/");

    return notation;
}


////////////////////////////////// ARPEGGIOS //////////////////////////////////


function getArpeggioNotesText(fondamentalValue: number, chordValues: Array<number>,
    noteTonic: number = -1, charNotesValues: Array<number> = [],
    bassValue: number = -1): string
{
    let arpeggioNotesStr = "";
    let chordValuesToDisplay = getChordIntervalsWithBass(fondamentalValue, chordValues, bassValue);

    let hasDisplayedBass = false;
    for (const intervalValue of chordValuesToDisplay)
    {
      const curNoteValue = addToNoteValue(fondamentalValue, intervalValue);

      // skip bass if existing and already processed
      if (bassValue >= 0)
      if (bassValue != fondamentalValue && curNoteValue == bassValue)
      {
        if (!hasDisplayedBass)
            hasDisplayedBass = true;
        else
            continue;
      }
      
      const noteName = getNoteName(curNoteValue);

      const noteSpan: HTMLSpanElement = document.createElement("span");
      noteSpan.textContent = noteName;
      if (noteTonic >= 0 && curNoteValue == noteTonic)
        noteSpan.classList.add("span-tonic");
      else if (charNotesValues.length > 0 && charNotesValues.indexOf(curNoteValue) >= 0)
        noteSpan.classList.add("span-char");

      arpeggioNotesStr += noteSpan.outerHTML;
      arpeggioNotesStr += `, `;
    }
    arpeggioNotesStr = arpeggioNotesStr.slice(0, -2);
    
    return arpeggioNotesStr;
}

function getArpeggioIntervalsValues(chordValues: Array<number>, bassInterval: number = -1): Array<number>
{
    let intervalsValues = (bassInterval > 0) ?
        getChordIntervalsWithBass(0, chordValues, bassInterval) : cloneIntegerArray(chordValues);

    //if (bassInterval >= 0)
    //    console.log(chordValuesToDisplay);

    return intervalsValues;
}

function getArpeggioIntervalsNames(chordValues: Array<number>, bassInterval: number = -1): Array<string>
{
    let arpeggioIntervals = new Array<string>();
    const chordValuesToDisplay = getArpeggioIntervalsValues(chordValues, bassInterval);

    chordValuesToDisplay.forEach(function (intervalValue)
    {
      let intervalName = getIntervalChordNotation(intervalValue);
      arpeggioIntervals.push(intervalName);
    });

    return arpeggioIntervals;
}

function getArpeggioIntervalsString(chordValues: Array<number>, bassInterval: number = -1): string
{
    let arpeggioIntervalsStr = "";
    let arpeggioIntervals = getArpeggioIntervalsNames(chordValues, bassInterval);
    arpeggioIntervals.forEach(function (intervalName)
    {
      arpeggioIntervalsStr += `${intervalName}, `;
    });
    arpeggioIntervalsStr = arpeggioIntervalsStr.slice(0, -2);

    return arpeggioIntervalsStr;
}

function isChordCharacteristic(noteFondamental: number, chordValues: Array<number>,
    charNotesValues: Array<number> = []): boolean
{
    if (charNotesValues == null || charNotesValues.length == 0)
        return false;
    
    let isCharacteristic = false;

    chordValues.forEach(function (intervalValue)
    {
      const noteValue = addToNoteValue(noteFondamental, intervalValue);

      if (charNotesValues.length > 0 && charNotesValues.indexOf(noteValue) >= 0)
        isCharacteristic = true
    });

    return isCharacteristic;
}

function areChordNotesInScale(fondamentalValue: number, chordValues: Array<number>, scaleNotesValues: Array<number>) : boolean
{
    if (scaleNotesValues == null || scaleNotesValues.length == 0)
        return false;
    
    let isInScale = true;

    chordValues.forEach(function (intervalValue)
    {
        const noteValue = addToNoteValue(fondamentalValue, intervalValue);
        if (scaleNotesValues.indexOf(noteValue) < 0)
            isInScale = false;
    });

    return isInScale;
}

// Neapolitan chord: bII
function isChordNeapolitan(tonicValue: number, fondamentalValue: number, chordId: string) : boolean
{
    if (tonicValue < 0)
        return false;
    
    if (fondamentalValue != addToNoteValue(tonicValue, 1))
        return false;
    
    return (chordId == "M");
}

// Augmented 6th chords
function isChordAugmented6th(tonicValue: number, fondamentalValue: number, chordId: string) : boolean
{
    if (tonicValue < 0)
        return false;
    
    // Italian 6th chord: bVI7(no5)
    const it6Chord: [number, string] = [8, "It+6"];

    // French 6th chord: bVI7b5
    const fr6Chord: [number, string] = [8, "Fr+6"];

    // German 6th chord: bVI7
    const ger6Chord: [number, string] = [8, "7"];

    const aug6Chords: Array<[number, string]> = [it6Chord, fr6Chord, ger6Chord];
    for (let [intervalValue, chordAug6Id] of aug6Chords)
    {
        let noteValue = addToNoteValue(tonicValue, intervalValue);
        if (fondamentalValue == noteValue && chordId == chordAug6Id)
            return true;
    }
    
    return false;
}

// German augmented 6th chord: bVI7
function isChordGermanAug6th(tonicValue: number, fondamentalValue: number, chordId: string) : boolean
{
    if (tonicValue < 0)
        return false;
    
    if (fondamentalValue != addToNoteValue(tonicValue, 8))
        return false;
    
    return (chordId == "7");
}

function getChordDictionary(nbNotes: number): Map<string, Array<number>>
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

        case 6:
            chordsDict = chords6Dict;
            break;
    }

    return chordsDict;
}
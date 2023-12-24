// update scale selector
function updateScaleSelector(id: string, defaultScaleId: string,
    includesChromatic = true, includesQTones = true, includesXen = false,
    reset = false): void
{
    const scaleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized: boolean = (scaleSelect.options != null && scaleSelect.options.length > 0);
    const regexNbNotes = /(\d+)notes/;

    const scaleParamValue = parseParameterById("scale");
    if (scaleParamValue != "")
        defaultScaleId = scaleParamValue;

    // if reset option set, remove all options
    if (reset)
        while (scaleSelect.firstChild)
            scaleSelect.firstChild.remove();

    if (!initialized || reset)
    {
        // init
        for (const [key , value] of scalesDict_int)
        {
            if (!includesChromatic && (key.startsWith("12tet") || key.startsWith("24tet")))
                continue;

            if (!includesQTones && key.includes("quarter_tones"))
                break;

            if (!includesXen && key.startsWith("xenharmonics"))
                break;
            
            const scaleName = getScaleString(key);
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = scaleName;
            
            // scale to highlight
            if (hightlightScale(key))
                option.classList.add('bolden');
    
            // notes seperator
            if (key.match(regexNbNotes) || key.startsWith("qtones") || key.startsWith("xenharmonics"))
            {
                option.classList.add('bolden');
                option.disabled = true;
            }
    
            // simple separator
            if (scaleName == "")
                option.disabled = true;
    
            // default scale
            if (key == defaultScaleId)
                option.selected = true;
    
            scaleSelect.appendChild(option);
        }
    }
    else
    {
        // update
        let scaleValue = 0;
        for (const [key , value] of scalesDict_int)
        {
            if (!includesQTones && key.includes("quarter_tones"))
                break;
            
            if (!includesChromatic && key.startsWith("12tet"))
                continue;
            
            if (!includesXen && key.includes("xenharmonics"))
                break;
            
            scaleSelect.options[scaleValue].innerHTML = getScaleString(key);
            scaleValue++;
        }
    }
}

// get scale notes values given tonic and scale
function getScaleNotesValues(noteValue: number, scaleValues: Array<number>): Array<number>
{
    let scaleNotesValues: Array<number> = new Array<number>();

    scaleValues.forEach(function (interval, index)
    {
        const newNoteValue: number = addToNoteValue(noteValue, interval);
        scaleNotesValues.push(newNoteValue);
    });

    return scaleNotesValues;
}

// consider 24-TET as chromatic
function isChromaticScale(scaleValues: Array<number>): boolean
{
    const is12TET = arraysEqual(scaleValues, <Array<number>>scaleFamiliesDict.get("12tet"));
    const is24TET = arraysEqual(scaleValues, <Array<number>>scaleFamiliesDict.get("24tet"));
    return (is12TET || is24TET);
}

// build scale notes array from octaves range
function GetScaleNotesOctaveRangeValues(tonicValue: number, scaleValues: Array<number>, octave: number): Array<number>
{
    const scaleNotesValues: Array<number> = [];
    for (let octaveCur = octave - 1; octaveCur <= octave; octaveCur++)
        for (const scaleValue of scaleValues)
            scaleNotesValues.push(tonicValue + scaleValue + 12*(octaveCur + 2)); 

    return scaleNotesValues;
}


////////////////////////////////// XENHARMONICS ///////////////////////////////


function isQuarterToneScale(notesValues: Array<number>): boolean
{
    for (const noteValue of notesValues)
        if (isQuarterToneInterval(noteValue))
            return true;

    return false;
}

function isXenharmonicScale(notesValues: Array<number>): boolean
{
    for (const noteValue of notesValues)
        if (isXenharmonicInterval(noteValue))
            return true;

    return false;
}

function isOctaveScale(scaleValues: Array<number>): boolean
{
    if (scaleValues != null && scaleValues.length > 0 && scaleValues[0] != 0)
        return false;

    return true;
}


// Scales computations functions

function getEDOScaleValues(temperament: number, intervalToDivide: number = 2): Array<number>
{
    let scaleValues: Array<number> = [];
    const isOctave = (intervalToDivide == 2);

    for (let i = (isOctave ? 0 : 1); i <= (isOctave ? temperament - 1 : temperament); i++)
        scaleValues.push(12 * Math.log2(intervalToDivide) * i / temperament);

    return scaleValues;
}

function getEDOSubsetScaleValues(temperament: number, indexes: Array<number>, intervalToDivide: number = 2): Array<number>
{
    if (indexes == null || indexes.length == 0)
        return [];

    let scaleValues: Array<number> = [];
    const isOctave = (intervalToDivide == 2);

    for (const i of indexes)
        scaleValues.push(12 * Math.log2(intervalToDivide) * i / temperament);

    // handle non-octave scale
    if (!isOctave)
    {
        scaleValues.shift();
        scaleValues.push(12 * Math.log2(intervalToDivide));
    }

    return scaleValues;
}

function getRatiosScaleValues(ratios: Array<number>): Array<number>
{
    if (ratios == null || ratios.length == 0)
        return [];

    let scaleValues: Array<number> = [];
    for (const ratio of ratios)
        scaleValues.push((ratio == 0) ? 0 : 12 * Math.log2(ratio));

    return scaleValues;
}

function getHarmonicSeriesScaleValues(valueMin: number, valueMax: number): Array<number>
{
    let ratios = [];

    const hasOctave = ((valueMax / valueMin) % 2 == 0);
    if (hasOctave)
        ratios.push(0);

    for (let value = valueMin + 1; value <= (hasOctave ? valueMax - 1 : valueMax); value++)
        ratios.push(value / valueMin)

    return getRatiosScaleValues(ratios);
}

function getSubharmonicSeriesScaleValues(valueMin: number, valueMax: number): Array<number>
{
    let ratios = [];

    const hasOctave = ((valueMax / valueMin) % 2 == 0);
    if (hasOctave)
        ratios.push(0);

    for (let value = valueMax - 1; value >= (hasOctave ? valueMin + 1 : valueMin); value--)
        ratios.push(valueMax / value)

    return getRatiosScaleValues(ratios);
}

function getChordEnumerationScaleValues(values: Array<number>, invert: boolean = false): Array<number>
{
    if (values == null || values.length <= 1)
        return [];

    let ratios = [];

    const nbNotesInScale = values.length - 1;
    const valuesSorted = values.sort();
    const valueMin = valuesSorted[0];
    const valueMax = valuesSorted[nbNotesInScale];

    const hasOctave = ((valueMax / valueMin) % 2 == 0);
    if (hasOctave)
        ratios.push(0);

    if (invert)
    {
        for (let index = nbNotesInScale - 1; index >= (hasOctave ? 1 : 0); index--)
            ratios.push(valueMax / valuesSorted[index])
    }
    else
    {
        for (let index = 1; index <= (hasOctave ? nbNotesInScale - 1 : nbNotesInScale); index++)
            ratios.push(valuesSorted[index] / valueMin)
    }

    return getRatiosScaleValues(ratios);
}
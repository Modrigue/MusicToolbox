// guitar tunings with 4 notes (bass)
const guitarTunings4Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings4Dict.set("standard" , [7, 0, 5, 10]);
guitarTunings4Dict.set("dropped_d", [5, 0, 5, 10]);

// guitar tunings with 7 notes -bass / mandolin)
const guitarTunings5Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings5Dict.set("standard", [2, 7, 0, 5, 10]);

// guitar tunings with 6 notes
const guitarTunings6Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings6Dict.set("standard" , [7 , 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("dropped_d", [5 , 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("open_g"   , [10, 2, 5, 10, 2, 5]);
guitarTunings6Dict.set("dadgad"   , [5 , 0, 5, 10, 0, 5]);

// guitar tunings with 7 notes
const guitarTunings7Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings7Dict.set("standard", [2, 7, 0, 5, 10, 2, 7]);

// global guitar tunings dictionary
const guitarTuningsDict: Map<number, Map<string, Array<number>>> = new Map<number, Map<string, Array<number>>>();
guitarTuningsDict.set(4, guitarTunings4Dict);
guitarTuningsDict.set(5, guitarTunings5Dict);
guitarTuningsDict.set(6, guitarTunings6Dict);
guitarTuningsDict.set(7, guitarTunings7Dict);


///////////////////////////////// GUITAR TUNING ///////////////////////////////

function initGuitarTuningSelector(id: string, useURLParams: boolean = true, nbStrings: number = 6, tuningId: string = "Standard"): void
{
    // get chord selecor
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (tuningSelect.options != null && tuningSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;

    // get nb. strings and tuning parameter if existing
    if (useURLParams)
    {
        const nbStringsParamValue = parseParameterById("guitar_nb_strings");
        const tuningParamValue = parseParameterById("guitar_tuning");

        if (nbStringsParamValue != "")
            nbStrings = parseInt(nbStringsParamValue);
        if (tuningParamValue != "")
            tuningId = tuningParamValue;
    }

    // add tunings
    let guitarTuningDict: Map<string, Array<number>> = <Map<string, Array<number>>>guitarTuningsDict.get(nbStrings);
    for (const [key, value] of guitarTuningDict)
    {
        let option = document.createElement('option');
        option.value = key;
        option.innerHTML = getGuitarTuningNotation(key);
        if (key == tuningId)
            option.selected = true;
        tuningSelect.appendChild(option);
    }

    // disable if only 1 option
    tuningSelect.disabled = (tuningSelect.options.length <= 1);
}

function updateGuitarTuningGivenNbStrings(id: string, nbStrings: number): void
{
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const tuningIdFormer: string = getSelectedGuitarTuningId(id);

    // get corresponding guitar tunings
    if (!guitarTuningsDict.has(nbStrings))
        return;
    const guitarTuningDict: Map<string, Array<number>> = <Map<string, Array<number>>>guitarTuningsDict.get(nbStrings);

    // replace selector options and try to select former corresponding guitar tuning
    removeAllChildNodes(tuningSelect);
    const tuningId = guitarTuningDict.has(tuningIdFormer) ? tuningIdFormer : "standard";
    initGuitarTuningSelector(id, false, nbStrings, tuningId);
}

function getGuitarTuningNotation(tuningId: string): string
{
    // specific
    if (tuningId.toUpperCase() == "DADGAD")
        return "DADGAD";

    let tuning = tuningId.replace(/_/g, " ");
    tuning = toTitleCase(tuning);

    return tuning;
}

function getSelectedGuitarTuningId(id: string): string
{
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    let tuningId = tuningSelect.value;

    return tuningId;
}

function getSelectedGuitarTuningValue(id: string): Array<number>
{
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    let tuningId = tuningSelect.value;

    // get tunings dict corresponding to selected nb. strings
    const nbStringsSelectId = id.replace('guitar_tuning', 'guitar_nb_strings');
    const nbStrings = getSelectedGuitarNbStrings(nbStringsSelectId);
    const guitarTuningDict: Map<string, Array<number>> = <Map<string, Array<number>>>guitarTuningsDict.get(nbStrings);

    if (!guitarTuningDict.has(tuningId))
        tuningId = "Standard"; // fallback

    return <Array<number>>guitarTuningDict.get(tuningId);
}

function removeAllChildNodes(parent: Element): void
{
    while (parent.firstChild)
    {
        parent.removeChild(parent.firstChild);
    }
}


////////////////////////////// NUMBER OF STRINGS //////////////////////////////

function initGuitarNbStringsSelector(id: string, minNbStrings: number = 4, maxNbStrings: number = 7, defaultNbStrings: number = 6): void
{
    // get chord selecor
    const nbStringsSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (nbStringsSelect.options != null && nbStringsSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;

    // get nb. strings and tuning parameter if existing
    const nbStringsParamValue = parseParameterById("guitar_nb_strings");

    if (nbStringsParamValue != "")
        defaultNbStrings = parseInt(nbStringsParamValue);

    // add tunings
    for (let i = minNbStrings; i <= maxNbStrings; i++)
    {
        let option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        if (i == defaultNbStrings)
            option.selected = true;

        nbStringsSelect.appendChild(option);
    }
}

function getSelectedGuitarNbStrings(id: string): number
{
    if (id.startsWith('chord_explorer'))
        return 6;

    const nbStringsSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    let nbStrings = parseInt(nbStringsSelect.value);

    return nbStrings;
}
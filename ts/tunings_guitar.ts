// guitar tunings with 4 notes (bass)
const guitarTunings4Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings4Dict.set("Standard" , [7, 0, 5, 10]);
guitarTunings4Dict.set("Dropped D", [5, 0, 5, 10]);

// guitar tunings with 7 notes -bass / mandolin)
const guitarTunings5Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings5Dict.set("Standard", [2, 7, 0, 5, 10]);

// guitar tunings with 6 notes
const guitarTunings6Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings6Dict.set("Standard" , [7 , 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("Dropped D", [5 , 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("Open G"   , [10, 2, 5, 10, 2, 5]);
guitarTunings6Dict.set("DADGAD"   , [5 , 0, 5, 10, 0, 5]);

// guitar tunings with 7 notes
const guitarTunings7Dict: Map<string, Array<number>> = new Map<string, Array<number>>();
guitarTunings7Dict.set("Standard", [2, 7, 0, 5, 10, 2, 7]);

// global guitar tunings dictionary
const guitarTuningsDict: Map<number, Map<string, Array<number>>> = new Map<number, Map<string, Array<number>>>();
guitarTuningsDict.set(4, guitarTunings4Dict);
guitarTuningsDict.set(5, guitarTunings5Dict);
guitarTuningsDict.set(6, guitarTunings6Dict);
guitarTuningsDict.set(7, guitarTunings7Dict);


/////////////////////////////////// FUNCTIONS /////////////////////////////////

function initGuitarTuningSelector(id: string, defaultNbStrings = 6, defaultTuningId: string = "Standard"): void
{
    // get chord selecor
    //const nbStringsSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (tuningSelect.options != null && tuningSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;

    // get nb. strings and tuning parameter if existing
    const nbStringsParamValue = parseParameterById("nb_strings");
    const tuningParamValue = parseParameterById("guitar_tuning");

    if (nbStringsParamValue != "")
        defaultNbStrings = parseInt(nbStringsParamValue);
    if (tuningParamValue != "")
        defaultTuningId = tuningParamValue;

    // init
    let guitarTuningDict: Map<string, Array<number>> = guitarTunings6Dict;

    {
        // add tunings
        for (const [key, value] of guitarTuningDict)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = key;
            if (key == defaultTuningId)
                option.selected = true;
            tuningSelect.appendChild(option);
        }
    }
}

function getSelectedGuitarTuningValue(id: string): Array<number>
{
    const tuningSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    let tuningId = tuningSelect.value;

    // TODO: get tunings dict corresponding to selected nb. strings
    const guitarTuningDict: Map<string, Array<number>> = guitarTunings6Dict;

    if (!guitarTuningDict.has(tuningId))
        tuningId = "Standard"; // fallback

    return <Array<number>>guitarTuningDict.get(tuningId);
}
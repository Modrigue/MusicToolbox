//////////////////////////////////// STRINGS //////////////////////////////////

// notes dictionnary (international notation)
const notesDict_int: Map<number, string> = new Map<number, string>();
notesDict_int.set(0   , "C");
notesDict_int.set(0.5 , "C‡");
notesDict_int.set(1   , "C#");
notesDict_int.set(1.5 , "C⧥"); // Dd
notesDict_int.set(2   , "D");
notesDict_int.set(2.5 , "D‡");
notesDict_int.set(3   , "D#");
notesDict_int.set(3.5 , "D⧥");
notesDict_int.set(4   , "E");
notesDict_int.set(4.5 , "E‡");
notesDict_int.set(5   , "F");
notesDict_int.set(5.5 , "F‡");
notesDict_int.set(6   , "F#");
notesDict_int.set(6.5 , "F⧥");
notesDict_int.set(7   , "G");
notesDict_int.set(7.5 , "G‡");
notesDict_int.set(8   , "G#");
notesDict_int.set(8.5 , "G⧥");
notesDict_int.set(9   , "A");
notesDict_int.set(9.5 , "A‡");
notesDict_int.set(10  , "A#");
notesDict_int.set(10.5, "A⧥");
notesDict_int.set(11  , "B");
notesDict_int.set(11.5, "B‡");

// notes dictionnary (french notation)
const notesDict_fr: Map<number, string> = new Map<number, string>();
notesDict_fr.set(0   , "Do");
notesDict_fr.set(0.5 , "Do‡");
notesDict_fr.set(1   , "Do#");
notesDict_fr.set(1.5 , "Do⧥"); // Réd
notesDict_fr.set(2   , "Ré");
notesDict_fr.set(2.5 , "Ré‡");
notesDict_fr.set(3   , "Ré#");
notesDict_fr.set(3.5 , "Ré⧥");
notesDict_fr.set(4   , "Mi");
notesDict_fr.set(4.5 , "Mi‡");
notesDict_fr.set(5   , "Fa");
notesDict_fr.set(5.5 , "Fa‡");
notesDict_fr.set(6   , "Fa#");
notesDict_fr.set(6.5 , "Fa⧥");
notesDict_fr.set(7   , "Sol");
notesDict_fr.set(7.5 , "Sol‡");
notesDict_fr.set(8   , "Sol#");
notesDict_fr.set(8.5 , "Sol⧥");
notesDict_fr.set(9   , "La");
notesDict_fr.set(9.5 , "La‡");
notesDict_fr.set(10  , "La#");
notesDict_fr.set(10.5, "La⧥");
notesDict_fr.set(11  , "Si");
notesDict_fr.set(11.5, "Si‡");

// global dictionary
const notesDicts: Map<string, Map<number, string>> = new Map<string,Map<number, string>>();
notesDicts.set("int", notesDict_int);
notesDicts.set("fr", notesDict_fr);


/////////////////////////////////// FUNCTIONS /////////////////////////////////

function GetNoteFromValue(noteValue: number): number
{
    return (noteValue % 12);
}

function GetOctaveFromValue(noteValue: number): number
{
    return (Math.floor(noteValue / 12) - 2);
}

function GetNoteValueFromNoteOctave(note: number, octave: number): number
{
    return (note + 12*(octave + 2));
}

function GetIntervalBetweenNotes(noteValue1: number, noteValue2: number): number
{
    const note1 = (noteValue1 % 12);
    const note2 = (noteValue2 % 12);
    return (note1 - note2 + 12) % 12;
}

function GetMotionBetweenNotes(noteValuePrev: number, noteValueNext: number): number
{
    if (noteValueNext > noteValuePrev)
        return 1;
    else if (noteValueNext < noteValuePrev)
        return -1;
    
    return 0;
}

// add interval to note value
function addToNoteValue(noteValue: number, interval: number): number
{
  return ((noteValue + interval + 12) % 12);
}

function updateNoteSelector(id: string, defaultNoteValue: number = -1,
    firstNoteEmpty: boolean = false, showMicrotones: boolean = false,
    reset: boolean = false): void
{
    // get selected culture
    const lang = getSelectedCulture();

    // get note selecor
    const noteSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized: boolean = (noteSelect.options != null && noteSelect.options.length > 0);
    const notesDict : Map<number, string> = <Map<number, string>>notesDicts.get(lang);

    let noteParamValue: number = parseNoteParameter();

    // bass specific
    if (id == "chord_explorer_bass")
        noteParamValue = parseBassParameter();

    if (noteParamValue >= 0)
        defaultNoteValue = noteParamValue;

    // do not set default values for scale finder / chord finder notes selectors
    if ((id.startsWith("note_finder") && id != "note_finder_tonic")
      || id.startsWith("chord_explorer_note"))
        defaultNoteValue = -1;

    // if reset option set, remove all options
    if (reset)
        while (noteSelect.firstChild)
            noteSelect.firstChild.remove();

    // fill note selector
    if (!initialized || reset)
    {
        if (firstNoteEmpty)
        {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = "-1";
            option.innerHTML = "";
            if (defaultNoteValue == -1)
                option.selected = true;
            noteSelect.appendChild(option);
        }

        // init
        for (const [key, value] of notesDict)
        {
            // don't handle microtones if option not set
            if (!showMicrotones && isMicrotonalInterval(key))
                continue;

            let option = document.createElement('option');
            option.value = key.toString();
            option.innerHTML = <string>notesDict.get(key);
            if (key == defaultNoteValue)
                option.selected = true;
            noteSelect.appendChild(option);
        }
    }
    else
    {
        // update
        let index = firstNoteEmpty ? 1 : 0;
        for (const [key, value] of notesDict)
        {
            // don't handle microtones if option not set
            if (!showMicrotones && isMicrotonalInterval(key))
                continue;

            // if empty note, nop
            if (key == -1)
                continue;

            noteSelect.options[index].innerHTML = <string>notesDict.get(key);
            index++;
        }
    }
}

function updateOctaveSelector(id: string, minOctave: number = 0, maxOctave: number = 4, defaultOctaveValue: number = -1,
    firstOctaveEmpty: boolean = false, reset: boolean = false): void
{
    // get selecor
    const octaveSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized: boolean = (octaveSelect.options != null && octaveSelect.options.length > 0);

    // if reset option set, remove all options
    if (reset)
        while (octaveSelect.firstChild)
            octaveSelect.firstChild.remove();

    // fill octave selector
    if (!initialized || reset)
    {
        if (firstOctaveEmpty)
        {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = "-1";
            option.innerHTML = "";
            if (defaultOctaveValue == -1)
                option.selected = true;
            octaveSelect.appendChild(option);
        }

        // init
        for (let octave = minOctave; octave <= maxOctave; octave++)
        {
            let option = document.createElement('option');
            option.value = octave.toString();
            option.innerHTML = octave.toString();
            if (octave == defaultOctaveValue)
                option.selected = true;
            octaveSelect.appendChild(option);
        }
    }
    else
    {
        // update
        let index = firstOctaveEmpty ? 1 : 0;
        for (let octave = minOctave; octave <= maxOctave; octave++)
        {
            // if empty octave, nop
            if (octave == -1)
                continue;

            octaveSelect.options[index].innerHTML = octave.toString();
            index++;
        }
    }
}
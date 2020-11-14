//////////////////////////////////// STRINGS //////////////////////////////////

// notes dictionnary (international notation)
const notesDict_int = {};
notesDict_int[0] = "A";
notesDict_int[1] = "A#";
notesDict_int[2] = "B";
notesDict_int[3] = "C";
notesDict_int[4] = "C#";
notesDict_int[5] = "D";
notesDict_int[6] = "D#";
notesDict_int[7] = "E";
notesDict_int[8] = "F";
notesDict_int[9] = "F#";
notesDict_int[10] = "G";
notesDict_int[11] = "G#";

// notes dictionnary (french notation)
const notesDict_fr = {};
notesDict_fr[0] = "La";
notesDict_fr[1] = "La#";
notesDict_fr[2] = "Si";
notesDict_fr[3] = "Do";
notesDict_fr[4] = "Do#";
notesDict_fr[5] = "Ré";
notesDict_fr[6] = "Ré#";
notesDict_fr[7] = "Mi";
notesDict_fr[8] = "Fa";
notesDict_fr[9] = "Fa#";
notesDict_fr[10] = "Sol";
notesDict_fr[11] = "Sol#";

// global dictionary
const notesDicts = {};
notesDicts["int"] = notesDict_int;
notesDicts["fr"] = notesDict_fr;


/////////////////////////////////// FUNCTIONS /////////////////////////////////

function updateNoteSelector(id, defaultNoteValue = -1, firstNoteEmpty = false)
{
// get selected culture
    const lang = getSelectedCulture();

    // get note selecor
    const noteSelect = document.getElementById(id);
    initialized = (noteSelect.options != null && noteSelect.options.length > 0);
    const notesDict = notesDicts[lang];

    const noteParamValue = parseNoteParameter();
    if (noteParamValue >= 0)
        defaultNoteValue = noteParamValue;

    // fill note selector
    if (!initialized)
    {
        if (firstNoteEmpty)
        {
            let option = document.createElement('option');
            option.value = -1;
            option.innerHTML = "";
            if (defaultNoteValue == -1)
                option.selected = true;
            noteSelect.appendChild(option);
        }

        // init
        for (const key in notesDict)
        {
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = notesDict[key];
            if (key == defaultNoteValue)
                option.selected = true;
            noteSelect.appendChild(option);
        }
    }
    else
    {
        // update
        let index = firstNoteEmpty ? 1 : 0;
        for (const key in notesDict)
        {
            // if empty note, nop
            if (key == -1)
                continue;

            noteSelect.options[index].innerHTML = notesDict[key];
            index++;
        }
    }
}
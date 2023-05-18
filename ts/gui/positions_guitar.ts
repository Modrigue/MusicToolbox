//////////////////////////////// GUITAR POSITIONS /////////////////////////////


function initGuitarPositionSelector(id: string, useURLParams: boolean = true,
    nbPos: number = 7, position: number = -1): void
{
    // get selector
    const posSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized = (posSelect.options != null && posSelect.options.length > 0);
    if (initialized) // nop if already initialized
        return;

    // add tunings
    for (let i = -1; i < nbPos; i++)
    {
        const positionAll = (i == -1);

        let option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = positionAll ? "" : (i + 1).toString();
        if (i == position)
            option.selected = true;

        posSelect.appendChild(option);
    }

    // disable if only 1 option
    posSelect.disabled = (posSelect.options.length <= 1);
}

function updateGuitarPositionGivenNbNotes(id: string, nbNotes: number): void
{
    const posSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const posFormer: number = getSelectedGuitarPosition(id);

    // replace selector options and try to select former corresponding guitar tuning
    removeAllChildNodes(posSelect);
    const position = (posFormer <= nbNotes) ? posFormer : -1;
    initGuitarPositionSelector(id, false, nbNotes, position);
}

function getSelectedGuitarPosition(id: string): number
{
    const posSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    let posId = posSelect.value;

    return parseInt(posId);
}
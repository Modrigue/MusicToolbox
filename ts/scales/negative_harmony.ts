// compute negative note value given tonic
function getNegativeNoteValue(tonicValue: number, noteValue: number): number
{
    return (7 - noteValue + 12 + 2*tonicValue) % 12;
}

// compute negative scale values given tonic
function getNegativeScaleValues(scaleValues: Array<number>, tonicValue: number = -1): Array<number>
{
    let negScaleValues: Array<number> = new Array<number>();

    if (scaleValues == null || scaleValues.length == 0)
        return new Array<number>();

    const refTonicValue = (tonicValue >= 0) ? tonicValue : scaleValues[0];
    for (let noteValue of scaleValues)
    {
        const negNoteValue = getNegativeNoteValue(refTonicValue, noteValue);
        negScaleValues.push(negNoteValue);
    }

    return negScaleValues;
}
// compute negative note value given tonic
function getNegativeNoteValue(tonicValue: number, noteValue: number): number
{
    return (7 - noteValue + 12 + 2*tonicValue) % 12;
}
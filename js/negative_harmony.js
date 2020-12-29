"use strict";
// compute negative note value given tonic
function getNegativeNoteValue(tonicValue, noteValue) {
    return (7 - noteValue + 12 + 2 * tonicValue) % 12;
}
//# sourceMappingURL=negative_harmony.js.map
"use strict";
// guitar tunings with 4 notes (bass)
const guitarTunings4Dict = new Map();
guitarTunings4Dict.set("4;Standard", [7, 0, 5, 10]);
guitarTunings4Dict.set("4;Dropped D", [5, 0, 5, 10]);
// guitar tunings with 7 notes -bass / mandolin)
const guitarTunings5Dict = new Map();
guitarTunings5Dict.set("5;Standard", [2, 7, 0, 5, 10]);
// guitar tunings with 6 notes
const guitarTunings6Dict = new Map();
guitarTunings6Dict.set("6;Standard", [7, 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("6;Dropped D", [5, 0, 5, 10, 2, 7]);
guitarTunings6Dict.set("6;Open G", [10, 2, 5, 10, 2, 5]);
guitarTunings6Dict.set("6;DADGAD", [5, 0, 5, 10, 0, 5]);
// guitar tunings with 7 notes
const guitarTunings7Dict = new Map();
guitarTunings7Dict.set("7;Standard", [2, 7, 0, 5, 10, 2, 7]);
// global guitar tunings dictionary
const guitarTuningsDict = new Map();
guitarTuningsDict.set(4, guitarTunings4Dict);
guitarTuningsDict.set(5, guitarTunings5Dict);
guitarTuningsDict.set(6, guitarTunings6Dict);
guitarTuningsDict.set(7, guitarTunings7Dict);
//# sourceMappingURL=tunings_guitar.js.map
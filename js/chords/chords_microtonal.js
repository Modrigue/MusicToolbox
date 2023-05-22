"use strict";
// quarter tone approximated harmonics
// h7  = 9.5, ‡6 (7/4)
// h11 = 5.5, ‡4 (11/8)
// h13 = 8.5, d6 (13/8)
// quarter tone chords with 3 notes
chords3Dict.set("n", [0, 3.5, 7]);
chords3Dict.set("n65", [0, 7, 8.5]);
chords3Dict.set("h7sus4", [0, 5, 9.5]);
chords3Dict.set("h7sus2", [0, 2, 9.5]);
chords3Dict.set("h13sus4", [0, 5, 8.5]);
chords3Dict.set("h13sus2", [0, 2, 8.5]);
chords3Dict.set("h11sus2", [0, 2, 5.5]);
chords3Dict.set("d5", [0, 4, 6.5]);
chords3Dict.set("nd5", [0, 3.5, 6.5]);
chords3Dict.set("mind5", [0, 3, 6.5]);
chords3Dict.set("addh13(no5)", [0, 4, 8.5]);
chords3Dict.set("naddh13(no5)", [0, 3.5, 8.5]);
chords3Dict.set("maddh13(no5)", [0, 3, 8.5]);
// quarter tone chords with 4 notes
chords4Dict.set("h7", [0, 4, 7, 9.5]); // harmonic 7th / quartertone dominant 7th
chords4Dict.set("nh7", [0, 3.5, 7, 9.5]); // neutral harmonic 7th
chords4Dict.set("mh7", [0, 3, 7, 9.5]); // minor harmonic 7th
chords4Dict.set("nh7flat5", [0, 3.5, 6, 9.5]); // neutral diminished 7th
chords4Dict.set("h13", [0, 3, 5.5, 8.5]); // harmonic 13th
chords4Dict.set("nh13", [0, 3.5, 5.5, 8.5]); // neutral harmonic 13th
chords4Dict.set("addh13", [0, 4, 7, 8.5]);
chords4Dict.set("naddh13", [0, 3.5, 7, 8.5]);
chords4Dict.set("maddh13", [0, 3, 7, 8.5]);
chords4Dict.set("addh11", [0, 4, 7, 17.5]);
chords4Dict.set("naddh11", [0, 3.5, 7, 17.5]);
chords4Dict.set("maddh11", [0, 3, 7, 17.5]);
chords4Dict.set("h7h11(no5)", [0, 4, 9.5, 17.5]);
chords4Dict.set("n7", [0, 3.5, 7, 10.5]);
chords4Dict.set("n7sus2", [0, 2, 7, 10.5]);
chords4Dict.set("n7sus4", [0, 5, 7, 10.5]);
chords4Dict.set("nadd9", [0, 3.5, 7, 14]);
chords4Dict.set("nadd11", [0, 3.5, 5, 17]);
chords4Dict.set("19to15", [0, 3, 6.5, 9.5]); // 19th to 15th
// quarter tone chords with 5 notes
chords5Dict.set("h7db9", [0, 4, 7, 9.5, 12.5]);
chords5Dict.set("h7h11", [0, 4, 7, 9.5, 17.5]);
chords5Dict.set("h7h11h13(no5)", [0, 4, 9.5, 17.5, 20.5]);
chords5Dict.set("n9sus", [0, 5, 7, 10.5, 14]);
// quarter tone chords with 6 notes
chords6Dict.set("h7h11h13", [0, 4, 7, 9.5, 17.5, 20.5]);
// quarter tone chords functions
function isQuarterToneChord(chordId) {
    const chordValues = getChordValues(chordId);
    return areQuarterToneChordValues(chordValues);
}
function isXenharmonicChord(chordId) {
    const chordValues = getChordValues(chordId);
    return areXenharmonicChordValues(chordValues);
}
function areQuarterToneChordValues(chordValues) {
    for (const value of chordValues)
        if (isQuarterToneInterval(value))
            return true;
    return false;
}
function areXenharmonicChordValues(chordValues) {
    for (const value of chordValues)
        if (isXenharmonicInterval(value))
            return true;
    return false;
}
//# sourceMappingURL=chords_microtonal.js.map
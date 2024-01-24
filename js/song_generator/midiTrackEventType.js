"use strict";
var MidiTrackEventType;
(function (MidiTrackEventType) {
    MidiTrackEventType[MidiTrackEventType["UNKNOWN"] = 0] = "UNKNOWN";
    MidiTrackEventType[MidiTrackEventType["END_TRACK"] = 1] = "END_TRACK";
    MidiTrackEventType[MidiTrackEventType["TEMPO"] = 2] = "TEMPO";
    MidiTrackEventType[MidiTrackEventType["TIME_SIGNATURE"] = 3] = "TIME_SIGNATURE";
    MidiTrackEventType[MidiTrackEventType["NAME"] = 4] = "NAME";
    MidiTrackEventType[MidiTrackEventType["INSTRUMENT"] = 5] = "INSTRUMENT";
    MidiTrackEventType[MidiTrackEventType["NOTE_ON"] = 6] = "NOTE_ON";
    MidiTrackEventType[MidiTrackEventType["NOTE_OFF"] = 7] = "NOTE_OFF";
    MidiTrackEventType[MidiTrackEventType["PICTH_BEND"] = 8] = "PICTH_BEND";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_FINE"] = 9] = "CONTROL_CHANGE_FINE";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_COARSE"] = 10] = "CONTROL_CHANGE_COARSE";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_ENTRY_SLIDER"] = 11] = "CONTROL_CHANGE_ENTRY_SLIDER";
})(MidiTrackEventType || (MidiTrackEventType = {}));
;
//# sourceMappingURL=midiTrackEventType.js.map
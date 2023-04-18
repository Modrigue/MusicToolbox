"use strict";
var MidiTrackEventType;
(function (MidiTrackEventType) {
    MidiTrackEventType[MidiTrackEventType["UNKNOWN"] = 0] = "UNKNOWN";
    MidiTrackEventType[MidiTrackEventType["END_TRACK"] = 1] = "END_TRACK";
    MidiTrackEventType[MidiTrackEventType["TEMPO"] = 2] = "TEMPO";
    MidiTrackEventType[MidiTrackEventType["TIME_SIGNATURE"] = 3] = "TIME_SIGNATURE";
    MidiTrackEventType[MidiTrackEventType["NOTE_ON"] = 4] = "NOTE_ON";
    MidiTrackEventType[MidiTrackEventType["NOTE_OFF"] = 5] = "NOTE_OFF";
    MidiTrackEventType[MidiTrackEventType["PICTH_BEND"] = 6] = "PICTH_BEND";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_FINE"] = 7] = "CONTROL_CHANGE_FINE";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_COARSE"] = 8] = "CONTROL_CHANGE_COARSE";
    MidiTrackEventType[MidiTrackEventType["CONTROL_CHANGE_ENTRY_SLIDER"] = 9] = "CONTROL_CHANGE_ENTRY_SLIDER";
})(MidiTrackEventType || (MidiTrackEventType = {}));
;
//# sourceMappingURL=midiTrackEventType.js.map
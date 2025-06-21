"use strict";
const nbKeysInRowsScaleKeyboard = [11, 12, 12, 12];
const startRowsScaleKeyboard = [0, 2 / 3, 1 / 3, 0];
const keyboardCharactersMap = {
    int: [
        "⇧\\", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "\/",
        "A", "S", "D", "F", "G", "H", "J", "K", "L", "M", ";", "'",
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ")", "="
    ],
    es: [
        "<", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-",
        "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ", "´", "ç",
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "`", "+",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¡"
    ],
    fr: [
        "<", "W", "X", "C", "V", "B", "N", ",", ";", ":", "!",
        "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "ù", "*",
        "A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "^", "$",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="
    ],
    it: [
        "<", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-", // row 1
        "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ò", "À", "È", // row 2
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "È", "+", // row 3
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "ì" // row 4
    ],
    pt: [
        "<", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-",
        "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ", "´", "ç",
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "`", "+",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¡"
    ]
};
const keyboardCharactersArrays = new Map();
for (const lang in keyboardCharactersMap) {
    keyboardCharactersArrays.set(lang, keyboardCharactersMap[lang]);
}
let wScaleKeyboardKey = 0;
let hScaleKeyboardKey = 0;
let mouseDownInScaleKeyboard = false;
let posMouseInScaleKeyboard = -1;
function updateScaleKeyboard(tonicValue, scaleValues, startOctave, charIntervals = []) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    // keyboard
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // fill background
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    wScaleKeyboardKey = canvas.width / 13;
    hScaleKeyboardKey = canvas.height / 4;
    ctx.strokeStyle = colorPianoNoteNormal;
    // draw computer keyboard grid
    // fill rows (from top to bottom)
    let xRowStart = 0, xRowEnd = 0;
    let xRowStartPrev = 0, xRowEndPrev = 0;
    let yRowStart = 0;
    let nbKeysInRow = 0;
    for (let row = 4; row >= 1; row--) {
        nbKeysInRow = nbKeysInRowsScaleKeyboard[row - 1];
        xRowStart = wScaleKeyboardKey * startRowsScaleKeyboard[row - 1];
        xRowEnd = xRowStart + nbKeysInRow * wScaleKeyboardKey;
        yRowStart = hScaleKeyboardKey * (4 - row);
        let xRowStartCur = xRowStart;
        let xRowEndCur = xRowEnd;
        if (row < 4) {
            xRowStartCur = Math.min(xRowStart, xRowStartPrev);
            xRowEndCur = Math.max(xRowEnd, xRowEndPrev);
        }
        // horizontal top line
        let y = yRowStart;
        ctx.beginPath();
        ctx.moveTo(xRowStartCur, y);
        ctx.lineTo(xRowEndCur, y);
        ctx.stroke();
        // vertical lines
        for (let j = 0; j <= nbKeysInRow; j++) {
            let x = xRowStart + j * wScaleKeyboardKey;
            ctx.beginPath();
            ctx.moveTo(x, yRowStart);
            ctx.lineTo(x, yRowStart + hScaleKeyboardKey);
            ctx.stroke();
        }
        xRowStartPrev = xRowStart;
        xRowEndPrev = xRowEnd;
    }
    // horizontal bottom line
    let y = yRowStart + hScaleKeyboardKey;
    ctx.beginPath();
    ctx.moveTo(xRowStart, y);
    ctx.lineTo(xRowStart + nbKeysInRow * wScaleKeyboardKey, y);
    ctx.stroke();
    const lang = getSelectedCulture();
    const keyboardCharactersArray = keyboardCharactersArrays.get(lang);
    // fill with selected scale notes
    const scaleNotesValues = getScaleNotesValues(tonicValue, scaleValues);
    const scaleValuesPositions = getScaleValuesPositions(scaleValues);
    const noteValueMinOctave = 12 * startOctave + noteValueMin;
    for (let pos = 0; pos <= 46; pos++) {
        const noteValue = noteValueMinOctave + tonicValue + scaleValuesPositions[pos];
        // get note color
        let colorNote = colorPianoNoteNormal;
        if (noteValue % 12 == tonicValue)
            colorNote = colorPianoNoteTonic;
        const indexNote = scaleNotesValues.indexOf(noteValue % 12);
        if (charIntervals.indexOf(indexNote) >= 0)
            colorNote = colorPianoNoteChar; // characteristic note
        let pressed = (notesPressed.indexOf(noteValue) >= 0);
        if (pressed) {
            fillKey(pos, colorNote);
            colorNote = "white";
        }
        // display character on key
        if (pos < keyboardCharactersArray.length)
            displayCharacterOnKey(pos, keyboardCharactersArray[pos], colorNote);
        // display note on key
        if (noteValue <= noteValueMax)
            displayNoteOnKey(pos, getNoteNameWithOctave(noteValue), colorNote);
        // highlight characteristic notes keys
        if (charIntervals.indexOf(indexNote) >= 0)
            highlightKeyBorders(pos, colorNote);
    }
    // 2nd pass to highlight tonic notes keys
    for (let pos = 0; pos <= 46; pos++) {
        const noteValue = noteValueMinOctave + tonicValue + scaleValuesPositions[pos];
        if (noteValue % 12 == tonicValue)
            highlightKeyBorders(pos, colorPianoNoteTonic);
    }
}
// key display functions
function displayNoteOnKey(position, text, color) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    const coords = getKeyCoordinates(position);
    // text display
    const lang = getSelectedCulture();
    let xShift = 0;
    let yShift = 0;
    ctx.font = "18px Arial";
    xShift = -5 * text.length;
    yShift = -8;
    ctx.fillText(text, coords[0] + xShift, coords[1] + hScaleKeyboardKey / 2 + yShift);
}
function displayCharacterOnKey(position, text, color) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    const coords = getKeyCoordinates(position);
    // text display
    const lang = getSelectedCulture();
    let xShift = 0;
    let yShift = 0;
    ctx.font = "15px Times New Roman";
    xShift = -4.5 * text.length;
    yShift = 16;
    ctx.fillText(text, coords[0] + xShift, coords[1] - hScaleKeyboardKey / 2 + yShift);
}
function highlightKeyBorders(position, color) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    const coords = getKeyCoordinates(position);
    const xC = coords[0];
    const yC = coords[1];
    ctx.beginPath();
    ctx.moveTo(xC - wScaleKeyboardKey / 2, yC - hScaleKeyboardKey / 2);
    ctx.lineTo(xC + wScaleKeyboardKey / 2, yC - hScaleKeyboardKey / 2);
    ctx.stroke();
    ctx.lineTo(xC + wScaleKeyboardKey / 2, yC + hScaleKeyboardKey / 2);
    ctx.stroke();
    ctx.lineTo(xC - wScaleKeyboardKey / 2, yC + hScaleKeyboardKey / 2);
    ctx.stroke();
    ctx.lineTo(xC - wScaleKeyboardKey / 2, yC - hScaleKeyboardKey / 2);
    ctx.stroke();
    ctx.closePath();
}
function fillKey(position, color) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    const coords = getKeyCoordinates(position);
    const xC = coords[0];
    const yC = coords[1];
    ctx.beginPath();
    ctx.fillRect(xC - wScaleKeyboardKey / 2, yC - hScaleKeyboardKey / 2, wScaleKeyboardKey, hScaleKeyboardKey);
    ctx.closePath();
}
// get position corresponding key center coordinates
function getKeyCoordinates(pos) {
    if (pos < 0)
        return [-1, -1];
    if (0 <= pos && pos <= 10)
        return [wScaleKeyboardKey * (pos - 0 + startRowsScaleKeyboard[1 - 1] + 0.5), hScaleKeyboardKey * 3.5]; // 1st row
    else if (11 <= pos && pos <= 22)
        return [wScaleKeyboardKey * (pos - 11 + startRowsScaleKeyboard[2 - 1] + 0.5), hScaleKeyboardKey * 2.5]; // 2nd row
    else if (23 <= pos && pos <= 34)
        return [wScaleKeyboardKey * (pos - 23 + startRowsScaleKeyboard[3 - 1] + 0.5), hScaleKeyboardKey * 1.5]; // 3rd row
    else if (35 <= pos && pos <= 46)
        return [wScaleKeyboardKey * (pos - 35 + startRowsScaleKeyboard[4 - 1] + 0.5), hScaleKeyboardKey * 0.5]; // 4th row
    return [-1, -1];
}
function getPositionFromInputKey(e) {
    let position = -999;
    //console.log(e.code);
    switch (e.code) {
        // 1st row
        case "ShiftLeft":
        case "IntlBackslash":
            position = 0;
            break;
        case "KeyZ":
            position = 1;
            break;
        case "KeyX":
            position = 2;
            break;
        case "KeyC":
            position = 3;
            break;
        case "KeyV":
            position = 4;
            break;
        case "KeyB":
            position = 5;
            break;
        case "KeyN":
            position = 6;
            break;
        case "KeyM":
            position = 7;
            break;
        case "Comma":
            position = 8;
            break;
        case "Period":
            position = 9;
            break;
        case "Slash":
            position = 10;
            break;
        // 2nd row
        case "KeyA":
            position = 11;
            break;
        case "KeyS":
            position = 12;
            break;
        case "KeyD":
            position = 13;
            break;
        case "KeyF":
            position = 14;
            break;
        case "KeyG":
            position = 15;
            break;
        case "KeyH":
            position = 16;
            break;
        case "KeyJ":
            position = 17;
            break;
        case "KeyK":
            position = 18;
            break;
        case "KeyL":
            position = 19;
            break;
        case "Semicolon":
            position = 20;
            break;
        case "Quote":
            position = 21;
            break;
        case "Backslash":
            position = 22;
            break;
        // 3rd row
        case "KeyQ":
            position = 23;
            break;
        case "KeyW":
            position = 24;
            break;
        case "KeyE":
            position = 25;
            break;
        case "KeyR":
            position = 26;
            break;
        case "KeyT":
            position = 27;
            break;
        case "KeyY":
            position = 28;
            break;
        case "KeyU":
            position = 29;
            break;
        case "KeyI":
            position = 30;
            break;
        case "KeyO":
            position = 31;
            break;
        case "KeyP":
            position = 32;
            break;
        case "BracketLeft":
            position = 33;
            break;
        case "BracketRight":
            position = 34;
            break;
        // 4th row
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
            for (let i = 1; i <= 9; i++) {
                if (e.code == `Digit${i}`) {
                    position = 34 + i;
                    break;
                }
            }
            break;
        case "Digit0":
            position = 44;
            break;
        case "Minus":
            position = 45;
            break;
        case "Equal":
            position = 46;
            break;
    }
    return position;
}
// build scale intervals positions values array
function getScaleValuesPositions(scaleValues) {
    let scaleValuesArray = [];
    if (scaleValues == null || scaleValues.length == 0)
        return [];
    let scaleValuesToProcess = cloneIntegerArray(scaleValues);
    const nbValuesInScale = scaleValuesToProcess.length;
    // if scale values starts with 0, the scale supports octave.
    // remove and push octave (value 12) at end of array.
    if (scaleValuesToProcess[0] == 0) {
        scaleValuesToProcess.shift();
        scaleValuesToProcess.push(12);
    }
    // compute scale values array
    scaleValuesArray.push(0);
    let curStartValue = 0;
    const nbValuesMax = 50;
    for (let i = 1; i <= nbValuesMax; i++) {
        // re-loop on scale values
        if (i % nbValuesInScale == 0) {
            curStartValue += scaleValuesToProcess[nbValuesInScale - 1];
            scaleValuesArray.push(curStartValue);
        }
        else {
            const curValue = curStartValue + scaleValuesToProcess[(i - 1) % nbValuesInScale];
            scaleValuesArray.push(curValue);
        }
    }
    return scaleValuesArray;
}
///////////////////////////////////// MOUSE PLAY //////////////////////////////
function initScaleKeyboardMouseCallbacks() {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    canvas.addEventListener("mousedown", function (e) {
        if (!hasAudio)
            return;
        if (pageSelected != "page_scale_explorer")
            return;
        // get position from mouse
        const position = getPositionFromMouse(canvas, e);
        if (position < 0)
            return;
        posMouseInScaleKeyboard = position;
        playScaleKeyboardNotePosition(position, true);
        mouseDownInScaleKeyboard = true;
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        if (!mouseDownInScaleKeyboard)
            return;
        if (!hasAudio)
            return;
        if (pageSelected != "page_scale_explorer")
            return;
        // get position from mouse
        const position = getPositionFromMouse(canvas, e);
        if (position < 0 || posMouseInScaleKeyboard < 0)
            return;
        let posMouseInScaleKeyboardCur = position;
        if (posMouseInScaleKeyboardCur == posMouseInScaleKeyboard) // nop if previously pressed
            return;
        // stop previous pressed note
        //console.log("notePressedByMouse", posMouseInScaleKeyboard, posMouseInScaleKeyboardCur);
        playScaleKeyboardNotePosition(posMouseInScaleKeyboard, false);
        playScaleKeyboardNotePosition(posMouseInScaleKeyboardCur, true);
        posMouseInScaleKeyboard = posMouseInScaleKeyboardCur;
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        if (!mouseDownInScaleKeyboard)
            return;
        // stop pressed note     
        playScaleKeyboardNotePosition(posMouseInScaleKeyboard, false);
        posMouseInScaleKeyboard = -1;
        mouseDownInScaleKeyboard = false;
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        // warning: duplicated code
        if (!mouseDownInScaleKeyboard)
            return;
        // stop pressed note     
        playScaleKeyboardNotePosition(posMouseInScaleKeyboard, false);
        posMouseInScaleKeyboard = -1;
        mouseDownInScaleKeyboard = false;
    }, false);
}
function getPositionFromMouse(canvas, e) {
    const mouseCoords = getMousePositionInCanvas(canvas, e);
    //console.log("mouse down", mousePos.x, mousePos.y);
    // get row
    let row = 4 - Math.floor(mouseCoords.y / hScaleKeyboardKey);
    // get position given row
    let pos = -1;
    switch (row) {
        case 1:
            pos = Math.floor(mouseCoords.x / wScaleKeyboardKey);
            pos = Math.min(pos, nbKeysInRowsScaleKeyboard[row - 1] - 1);
            break;
        case 2:
            pos = Math.floor((mouseCoords.x - startRowsScaleKeyboard[row - 1] * wScaleKeyboardKey) / wScaleKeyboardKey);
            pos = Math.max(Math.min(pos, nbKeysInRowsScaleKeyboard[row - 1] - 1), 0);
            pos += 11;
            break;
        case 3:
            pos = Math.floor((mouseCoords.x - startRowsScaleKeyboard[row - 1] * wScaleKeyboardKey) / wScaleKeyboardKey);
            pos = Math.max(Math.min(pos, nbKeysInRowsScaleKeyboard[row - 1] - 1), 0);
            pos += 23;
            break;
        case 4:
            pos = Math.floor(mouseCoords.x / wScaleKeyboardKey);
            pos = Math.min(pos, nbKeysInRowsScaleKeyboard[row - 1] - 1);
            pos += 35;
            break;
    }
    //console.log(pos);
    return pos;
}
// from https://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
function getMousePositionInCanvas(canvas, e /* type? */) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
////////////////////////////////// KEYBOARD PLAY //////////////////////////////
document.addEventListener('keydown', function (e) {
    if (!hasAudio)
        return;
    if (pageSelected != "page_scale_explorer")
        return;
    const position = getPositionFromInputKey(e);
    if (position < 0)
        return;
    playScaleKeyboardNotePosition(position, true);
}, false);
document.addEventListener('keyup', function (e) {
    if (!hasAudio)
        return;
    if (pageSelected != "page_scale_explorer")
        return;
    const position = getPositionFromInputKey(e);
    if (position < 0)
        return;
    playScaleKeyboardNotePosition(position, false);
}, false);
//# sourceMappingURL=scale_keyboard.js.map
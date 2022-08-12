"use strict";
const nbKeysInRowsScaleKeyboard = [11, 12, 12, 12];
const startRowsScaleKeyboard = [0, 2 / 3, 1 / 3, 0];
let wScaleKeyboardKey = 0;
let hScalekeyboardKey = 0;
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
    hScalekeyboardKey = canvas.height / 4;
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
        yRowStart = hScalekeyboardKey * (4 - row);
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
            ctx.lineTo(x, yRowStart + hScalekeyboardKey);
            ctx.stroke();
        }
        xRowStartPrev = xRowStart;
        xRowEndPrev = xRowEnd;
    }
    // horizontal bottom line
    let y = yRowStart + hScalekeyboardKey;
    ctx.beginPath();
    ctx.moveTo(xRowStart, y);
    ctx.lineTo(xRowStart + nbKeysInRow * wScaleKeyboardKey, y);
    ctx.stroke();
    // fill with selected scale notes
    const scaleValuesPositions = getScaleValuesPositions(scaleValues);
    const noteValueMinOctave = 12 * startOctave + noteValueMin;
    for (let pos = 0; pos <= 46; pos++) {
        const noteValue = noteValueMinOctave + tonicValue + scaleValuesPositions[pos];
        if (noteValue <= noteValueMax)
            displayNoteOnKey(pos, getNoteNameWithOctave(noteValue), colorPianoNoteNormal);
    }
}
function displayNoteOnKey(pos, text, color) {
    let canvas = document.getElementById("scale_explorer_canvas_scale_keyboard");
    if (!canvas.getContext)
        return;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    let coords = getKeyCoordinates(pos);
    // text display
    const lang = getSelectedCulture();
    let xShift = 0;
    let yShift = 0;
    switch (lang) {
        case "fr":
            ctx.font = "13px Arial";
            xShift = -3.5 * text.length;
            yShift = 2;
            break;
        case "int":
        default:
            ctx.font = "18px Arial";
            xShift = -5 * text.length;
            yShift = 6;
            break;
    }
    ctx.fillText(text, coords[0] + xShift, coords[1] + yShift);
}
// get position corresponding key center coordinates
function getKeyCoordinates(pos) {
    if (pos < 0)
        return [-1, -1];
    if (0 <= pos && pos <= 10)
        return [wScaleKeyboardKey * (pos - 0 + startRowsScaleKeyboard[1 - 1] + 0.5), hScalekeyboardKey * 3.5]; // 1st row
    else if (11 <= pos && pos <= 22)
        return [wScaleKeyboardKey * (pos - 11 + startRowsScaleKeyboard[2 - 1] + 0.5), hScalekeyboardKey * 2.5]; // 2nd row
    else if (23 <= pos && pos <= 34)
        return [wScaleKeyboardKey * (pos - 23 + startRowsScaleKeyboard[3 - 1] + 0.5), hScalekeyboardKey * 1.5]; // 3rd row
    else if (35 <= pos && pos <= 46)
        return [wScaleKeyboardKey * (pos - 35 + startRowsScaleKeyboard[4 - 1] + 0.5), hScalekeyboardKey * 0.5]; // 4th row
    return [-1, -1];
}
function getPositionFromInputKey(e) {
    let position = -999;
    switch (e.code) {
        // 1st row
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
//# sourceMappingURL=scale_keyboard.js.map
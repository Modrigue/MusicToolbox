"use strict";
// parameters
let xKeyMargin = 40;
let yKeyMargin = 20;
let xKeyStep = 60;
const wFactorBlackKey = 0.6;
const hFactorBlackKey = 0.65;
const wFactorBlackKeyQTones = 0.5;
const hFactorBlackKeyQTones = 0.5;
const wFactorGreyKeyQTones = 0.5;
const hFactorGreyKeyQTones = 0.75;
// colors
const colorPianoNoteNormal = getComputedStyle(document.documentElement).getPropertyValue('--color-normal');
const colorPianoNoteTonic = getComputedStyle(document.documentElement).getPropertyValue('--color-tonic');
const colorPianoNoteChar = getComputedStyle(document.documentElement).getPropertyValue('--color-char');
const colorPianoGreyKey = "#E0E0E0";
const colorPianoGreyKeyBorder = "#888888";
// notes position on keyboard dictionnary
const notesKeyPos = new Map();
notesKeyPos.set(0, 0); // C
notesKeyPos.set(0.5, 0.25);
notesKeyPos.set(1, 0.5);
notesKeyPos.set(1.5, 0.75);
notesKeyPos.set(2, 1);
notesKeyPos.set(2.5, 1.25);
notesKeyPos.set(3, 1.5);
notesKeyPos.set(3.5, 1.75);
notesKeyPos.set(4, 2);
notesKeyPos.set(4.5, 2.25);
notesKeyPos.set(5, 3);
notesKeyPos.set(5.5, 3.25);
notesKeyPos.set(6, 3.5);
notesKeyPos.set(6.5, 3.75);
notesKeyPos.set(7, 4);
notesKeyPos.set(7.5, 4.25);
notesKeyPos.set(8, 4.5);
notesKeyPos.set(8.5, 4.75);
notesKeyPos.set(9, 5);
notesKeyPos.set(9.5, 5.25);
notesKeyPos.set(10, 5.5);
notesKeyPos.set(10.5, 5.75);
notesKeyPos.set(11, 6);
notesKeyPos.set(11.5, 6.25);
// <i> has offset 0
function displayNoteOnKeyboard(i, text, color, showQuarterTones = false) {
    let canvas = document.getElementById("scale_explorer_canvas_keyboard");
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        const yStep = (canvas.height - 2 * yKeyMargin) / (6 - 1);
        const radius = Math.min(xKeyStep, yStep) / 2 - 2;
        // x position
        const indexOctave = Math.floor((i - 3) / 12);
        const indexKeyPos = notesKeyPos.get(i % 12) + 7 * indexOctave;
        const x = xKeyMargin + indexKeyPos * xKeyStep + xKeyStep / 2;
        if (x > canvas.width - xKeyStep)
            return;
        // y position
        const isBlackKey = (indexKeyPos % 1 == 0.5);
        const isGreyKey = (indexKeyPos % 0.5 == 0.25);
        const hFactorBlackKeyCur = showQuarterTones ? hFactorBlackKeyQTones : hFactorBlackKey;
        let y = 0.8 * canvas.height;
        if (isBlackKey)
            y = yKeyMargin + hFactorBlackKeyCur * (canvas.height - 2 * yKeyMargin) - radius - 5;
        else if (isGreyKey)
            y = yKeyMargin + hFactorGreyKeyQTones * (canvas.height - 2 * yKeyMargin) - radius - 5;
        // draw
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        // text
        const lang = getSelectedCulture();
        let xShift = 0;
        let yShift = 0;
        switch (lang) {
            case "fr":
                ctx.font = "13px Arial";
                xShift = -9 - 2 * (text.length - 2);
                yShift = 4; //6;
                break;
            case "int":
            default:
                ctx.font = "18px Arial";
                xShift = (text.length == 2) ? -12 : -6;
                yShift = 6;
                break;
        }
        ctx.fillStyle = "white";
        ctx.fillText(text, x + xShift, y + yShift);
    }
}
function updateKeyboard(noteValue, scaleValues, charIntervals, scaleName, showQuarterTones = false) {
    let canvas = document.getElementById("scale_explorer_canvas_keyboard");
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
    // grey keys (quarter tones)
    if (showQuarterTones) {
        ctx.fillStyle = colorPianoGreyKey;
        ctx.strokeStyle = colorPianoGreyKeyBorder;
        const indexGreyKeys = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6]; // integer = ‡, .5 = ⧥
        for (let index = 0; index < 6 * 12; index += 0.5) {
            if (indexGreyKeys.indexOf(index % 7) < 0)
                continue;
            const isHalfSharp = (Math.floor(index) == index);
            const xKey = isHalfSharp ?
                xKeyMargin + (index + 1 - wFactorGreyKeyQTones) * xKeyStep :
                xKeyMargin + (Math.floor(index) + 1) * xKeyStep;
            if (xKey >= canvas.width - xKeyMargin)
                break;
            ctx.beginPath();
            ctx.fillRect(xKey, yKeyMargin, wFactorGreyKeyQTones * xKeyStep, hFactorGreyKeyQTones * (canvas.height - 2 * yKeyMargin));
            ctx.closePath();
            // draw horizontal bottom border
            const yBottom = yKeyMargin + hFactorGreyKeyQTones * (canvas.height - 2 * yKeyMargin);
            ctx.beginPath();
            ctx.moveTo(xKey, yBottom);
            ctx.lineTo(xKey + wFactorGreyKeyQTones * xKeyStep, yBottom);
            ctx.stroke();
            ctx.closePath();
            // draw vertical bottom border
            if (isHalfSharp) {
                ctx.beginPath();
                ctx.moveTo(xKey, yKeyMargin);
                ctx.lineTo(xKey, yBottom);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    // black keys
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    const indexBlackKeys = [1, 2, 4, 5, 6];
    let index = 0;
    const wFactorBlackKeyCur = showQuarterTones ? wFactorBlackKeyQTones : wFactorBlackKey;
    const hFactorBlackKeyCur = showQuarterTones ? hFactorBlackKeyQTones : hFactorBlackKey;
    for (let x = xKeyMargin + xKeyStep; x < canvas.width - xKeyMargin; x += xKeyStep) {
        index++;
        if (indexBlackKeys.indexOf(index % 7) < 0)
            continue;
        ctx.beginPath();
        ctx.fillRect(x - 0.5 * wFactorBlackKeyCur * xKeyStep, yKeyMargin, wFactorBlackKeyCur * xKeyStep, hFactorBlackKeyCur * (canvas.height - 2 * yKeyMargin));
        ctx.closePath();
    }
    // white keys
    for (let x = xKeyMargin; x < canvas.width - xKeyMargin; x += xKeyStep) {
        ctx.beginPath();
        ctx.moveTo(x, yKeyMargin);
        ctx.lineTo(x, canvas.height - yKeyMargin);
        ctx.stroke();
        ctx.closePath();
    }
    // horizontal lines
    const yStep = (canvas.height - 2 * yKeyMargin);
    for (let i = 0; i < 2; i++) {
        const y = yKeyMargin + i * yStep;
        ctx.moveTo(xKeyMargin, y);
        ctx.lineTo(canvas.width - xKeyMargin, y);
        ctx.stroke();
    }
    // display notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    const halfToneInc = showQuarterTones ? 0.5 : 1;
    for (let i = 3; i <= 3 + 4 * 12; i += halfToneInc) {
        const currentNoteValue = (i % 12);
        if (scaleNotesValues.indexOf(currentNoteValue) < 0)
            continue;
        // display note
        const currentNote = getNoteName(currentNoteValue);
        let colorNote = colorPianoNoteNormal;
        if (currentNoteValue == noteValue)
            colorNote = colorPianoNoteTonic;
        const indexNote = scaleNotesValues.indexOf(currentNoteValue);
        if (charIntervals.indexOf(indexNote) >= 0)
            colorNote = colorPianoNoteChar; // characteristic note
        displayNoteOnKeyboard(i, currentNote, colorNote, showQuarterTones);
    }
    // update save callback
    canvas.setAttribute("onclick", `saveKeyboardImage(${noteValue}, "${scaleName}")`);
}
function saveKeyboardImage(noteValue, scaleName) {
    let canvasElement = document.getElementById('scale_explorer_canvas_keyboard');
    let canvasImage = canvasElement.toDataURL('image/png');
    const noteSelectedText = getNoteName(noteValue);
    let scaleSelectedText = scaleName;
    // scaleSelectedText = scaleSelectedText.replaceAll(" / ", ' ');
    // scaleSelectedText = scaleSelectedText.replaceAll(' ', '_');
    // scaleSelectedText = scaleSelectedText.replaceAll('♭', 'b');
    scaleSelectedText = scaleSelectedText.replace(/ \//g, ' ');
    scaleSelectedText = scaleSelectedText.replace(/ /g, '_');
    scaleSelectedText = scaleSelectedText.replace(/♭/g, 'b');
    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `${getString("keyboard")}-${noteSelectedText}-${scaleSelectedText}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}
//# sourceMappingURL=keyboard.js.map
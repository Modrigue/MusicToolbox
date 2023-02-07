"use strict";
// parameters
let xFretMargin = 40;
let yFretMargin = 20;
let yFretStep = 32;
let xFretScaleStep = 60; // used for scale explorer
let xFretChordStep = 50; // used for chord explorer
const yFretMarginChordBottom = 10;
// colors
const colorFretsStrings = "silver";
const colorFretsStringsQTones = "#E4E4E4";
const colorFretsOctave = "dimgrey";
const colorHintFret = "whitesmoke";
const colorNoteTonic = "firebrick";
const colorNoteNormal = "dimgrey";
const colorNoteChar = "dodgerblue";
const colorNoteTonicDisabled = "mistyrose";
const colorNoteNormalDisabled = "gainsboro";
const colorNoteCharDisabled = "#C8E8FF";
function getCaseNoteValue(tuningValues, i, j) {
    // handle not hit string
    if (j < 0)
        return -1;
    return ((tuningValues[i - 1] + j) % 12);
}
// octaves indexes / nb. strings arrays
const octavesStringDict = new Map();
octavesStringDict.set(7, [1, 2, 2, 3, 3, 3, 4]);
octavesStringDict.set(6, [2, 2, 3, 3, 3, 4]);
octavesStringDict.set(5, [2, 3, 3, 4, 4]);
octavesStringDict.set(4, [1, 1, 2, 2]);
// get case note value with octave
function getCaseNoteValueAbs(tuningValues, i, j, nbStrings = 6) {
    // handle not hit string
    if (j < 0)
        return -1;
    const octavesString = (octavesStringDict.get(nbStrings));
    return (octavesString[i - 1] * 12 + tuningValues[i - 1] + j);
}
// <i> has offset 1
function displayNoteOnFretboard(id, i, j, text, color, nbStrings, xFretStep = xFretScaleStep, marginBottom = 0, startFret = 0, showQuarterTones = false) {
    let canvas = document.getElementById(id);
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        const yStep = (canvas.height - marginBottom - 2 * yFretMargin) / (nbStrings - 1);
        const radius = Math.min(xFretStep, yFretStep) / 2 - 2;
        if (i > nbStrings)
            return;
        // get last fret x
        let xFretLast = getLastFretX(id);
        // handle startFret if > 0
        if (startFret > 0 && j > 0)
            j -= startFret - 1;
        // position
        const xFretStart = showQuarterTones ?
            3 / 4 * xFretStep :
            (isMicrotonalInterval(j) ? 0 : xFretStep / 2);
        let x = xFretMargin + (j - 1) * xFretStep + xFretStart;
        if (j <= 0)
            x = xFretMargin - 40 + 40 / 2 - 1;
        let y = yFretMargin + (nbStrings - i) * yStep - 1;
        if (x > xFretLast)
            return;
        // do not show bent microtonal notes on empty strings
        if (!showQuarterTones && isMicrotonalInterval(j))
            if (j < 1)
                return;
        // handle not hit string
        if (j < 0) {
            ctx.font = "24px Arial";
            ctx.fillStyle = "grey";
            ctx.fillText(text, x - 8, y + 8);
            return;
        }
        // draw disc
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        // if note microtonal but not guitar, draw bend hint
        if (!showQuarterTones && isMicrotonalInterval(j)) {
            ctx.beginPath();
            ctx.lineTo(x, y - radius);
            ctx.lineTo(x + radius, y - radius);
            ctx.lineTo(x + radius, y);
            ctx.lineTo(x, y - radius);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
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
function updateFretboard(id, noteValue, scaleValues, charIntervals = [], scaleChordName = "", showQuarterTones = false, position = -1) {
    const nbStrings = getSelectedGuitarNbStrings(id.replace('canvas_guitar', 'guitar_nb_strings'));
    let canvas = document.getElementById(id);
    if (!canvas.getContext)
        return;
    // hide if no tonic / fondamental
    const hasNote = (noteValue >= 0);
    setVisible(id, hasNote);
    if (!hasNote)
        return;
    canvas.height = getCanvasHeight(nbStrings);
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = colorFretsStrings;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // fill background
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    // get last fret x
    let xFretLast = getLastFretX(id);
    // hint frets
    const hintFrets = [0, 3, 5, 7, 9];
    let indexFret = 0;
    for (let x = xFretMargin; x < xFretLast; x += xFretScaleStep) {
        indexFret++;
        if (hintFrets.indexOf(indexFret % 12) < 0)
            continue;
        // fill hint fret
        ctx.beginPath();
        ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
        ctx.fillStyle = colorHintFret;
        ctx.fillRect(x, yFretMargin, xFretScaleStep, canvas.height - 2 * yFretMargin);
        ctx.closePath();
    }
    // horizontal lines (strings)   
    for (let i = 0; i < nbStrings; i++) {
        let y = yFretMargin + i * yFretStep;
        ctx.beginPath();
        ctx.strokeStyle = colorFretsStrings;
        ctx.moveTo(xFretMargin, y);
        ctx.lineTo(xFretLast, y);
        ctx.stroke();
    }
    // vertical lines
    indexFret = 0;
    const halfToneInc = showQuarterTones ? 0.5 : 1;
    for (let x = xFretMargin; x <= xFretLast; x += halfToneInc * xFretScaleStep) {
        const isFretOctave = ((indexFret == 0) || ((indexFret + 1) % 12) == 0);
        const isFretQuarterTone = isMicrotonalInterval(indexFret);
        ctx.beginPath();
        ctx.strokeStyle = isFretOctave ?
            colorFretsOctave :
            (isFretQuarterTone ? colorFretsStringsQTones : colorFretsStrings);
        ctx.moveTo(x, yFretMargin);
        ctx.lineTo(x, canvas.height - yFretMargin);
        ctx.stroke();
        ctx.closePath();
        indexFret += halfToneInc;
    }
    // display notes
    const tuningValues = getSelectedGuitarTuningValue(id.replace('canvas_guitar', 'guitar_tuning'));
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    let nbNotesPositionPerString = (scaleValues.length > 5) ? 3 : 2;
    let nbNotesPositionPerStringCur = 0;
    let startNotePositionFound = false;
    let notePositionValueCur = -1;
    // blues scale specific
    const scaleValuesBlues = getScaleValues("6blues,1,diff:5major_penta;5");
    const isBluesScale = arraysEqual(scaleValues, scaleValuesBlues);
    if (isBluesScale) {
        nbNotesPositionPerString = 2;
        // skip blue note as start position
        if (position >= 3)
            position++;
    }
    for (let i = 1; i <= nbStrings; i++) {
        nbNotesPositionPerStringCur = 0;
        startNotePositionFound = false;
        let hasDisplayedBlueNoteOnString = false;
        let lastDisplayedPosOnString = 0;
        for (let j = 0; j < 3 * 12; j += 0.5) {
            const currentNoteValue = getCaseNoteValue(tuningValues, i, j);
            if (scaleNotesValues.indexOf(currentNoteValue) < 0)
                continue;
            // display note
            let displayNote = true;
            const currentNote = getNoteName(currentNoteValue);
            // if position set, display only notes with corresponding position
            if (position >= 0) {
                displayNote = false;
                const isBlueNote = (isBluesScale && scaleNotesValues.indexOf(currentNoteValue) == 3);
                if (nbNotesPositionPerStringCur < nbNotesPositionPerString
                    && !isBlueNote) {
                    const currentNoteValueAbs = getCaseNoteValueAbs(tuningValues, i, j, nbStrings);
                    //console.log(i, currentNoteValueAbs, notePositionValueCur);
                    if ((i == 1 && notePositionValueCur < 0 && currentNoteValue == scaleNotesValues[position])
                        || (i > 1 && currentNoteValueAbs > notePositionValueCur)
                        || startNotePositionFound) {
                        notePositionValueCur = currentNoteValueAbs;
                        nbNotesPositionPerStringCur++;
                        displayNote = true;
                        startNotePositionFound = true;
                        lastDisplayedPosOnString = j;
                    }
                }
                // display blue note in blues scale iff:
                //  - another note has already been displayed on the current string
                //  - the last note displayed on the current string is 1 case far
                //  - no other blue note has been displayed
                if (isBlueNote && (j - lastDisplayedPosOnString) < 2)
                    if (startNotePositionFound && !hasDisplayedBlueNoteOnString) {
                        displayNote = true;
                        hasDisplayedBlueNoteOnString = true;
                    }
            }
            let colorNote = displayNote ? colorNoteNormal : colorNoteNormalDisabled;
            if (currentNoteValue == noteValue)
                colorNote = displayNote ? colorNoteTonic : colorNoteTonicDisabled;
            const indexNote = scaleNotesValues.indexOf(currentNoteValue);
            if (charIntervals != null && charIntervals.length > 0 && charIntervals.indexOf(indexNote) >= 0)
                colorNote = displayNote ? colorNoteChar : colorNoteCharDisabled; // characteristic note
            //if (displayNote)
            displayNoteOnFretboard(id, i, j, currentNote, colorNote, nbStrings, xFretScaleStep, 0, 0, showQuarterTones);
        }
    }
    // update save callback
    let callbackStr = "";
    switch (id) {
        case "scale_explorer_canvas_guitar":
            callbackStr = `saveFretboardImage(\"scale_explorer_canvas_guitar\", ${noteValue}, "${scaleChordName}", ${position})`;
            break;
        case "chord_explorer_canvas_guitar":
            {
                let chordName = "";
                let bassValue = -1;
                let freeNotesSelected = [];
                if (scaleChordName != null && scaleChordName.length > 0) {
                    chordName = scaleChordName;
                    bassValue = getChordExplorerBassValue();
                }
                else {
                    // get selected notes values
                    freeNotesSelected = getSelectedChordExplorerNotes();
                }
                callbackStr = `saveFretboardChordImage(\"chord_explorer_canvas_guitar\", ${noteValue}, ${bassValue},\"${chordName}\", \"${freeNotesSelected.toString()}\")`;
            }
            break;
    }
    canvas.setAttribute("onclick", callbackStr);
}
// get last fret x position
function getLastFretX(id) {
    let canvas = document.getElementById("scale_explorer_canvas_guitar");
    let xFretLast = 0;
    for (let x = xFretMargin; x < canvas.width - xFretMargin; x += xFretScaleStep)
        xFretLast = x;
    return xFretLast;
}
function saveFretboardImage(id, noteValue, scaleChordName, position = -1) {
    let canvasElement = document.getElementById(id);
    let canvasImage = canvasElement.toDataURL('image/png');
    const noteSelectedText = getNoteName(noteValue);
    let scaleChordNameStr = scaleChordName;
    // scaleSelectedText = scaleSelectedText.replaceAll(" / ", ' ');
    // scaleSelectedText = scaleSelectedText.replaceAll(' ', '_');
    // scaleSelectedText = scaleSelectedText.replaceAll('♭', 'b');
    scaleChordNameStr = scaleChordNameStr.replace(/ \//g, ' ');
    scaleChordNameStr = scaleChordNameStr.replace(/ /g, '_');
    scaleChordNameStr = scaleChordNameStr.replace(/♭/g, 'b');
    const positionText = (position < 0) ? "" : `-Position_${position + 1}`;
    // used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `${getString("fretboard")}-${noteSelectedText}-${scaleChordNameStr}${positionText}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    xhr.open('GET', canvasImage); // download the canvas Image
    xhr.send();
}
/////////////////////////////////// CHORDS ////////////////////////////////////
function initChordsFretboardHTML(noteFondamental, noteBass, chordSelected, freeNotesSelected, nbPositions) {
    const nbStrings = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');
    let chordsFretboardHTML = "";
    for (let i = 0; i < nbPositions; i++) {
        let divGeneratedChord = document.createElement('div');
        let canvasGeneratedChord = document.createElement('canvas');
        const idText = "generated_chords_fretboard" + i.toString();
        canvasGeneratedChord.id = idText;
        //canvas.className = "canvas_generated_chords_fretboard";
        canvasGeneratedChord.width = xFretMargin + 5 * xFretChordStep;
        canvasGeneratedChord.height = getCanvasHeight(nbStrings) + yFretMarginChordBottom;
        //canvas.style.border = '1px solid grey';
        let callbackStr = `saveFretboardChordImage(\"${idText}\", ${noteFondamental}, ${noteBass},\"${chordSelected}\", \"${freeNotesSelected.toString()}\")`;
        canvasGeneratedChord.setAttribute("onclick", callbackStr);
        // create play chord button
        let buttonPlayChord = document.createElement('button');
        buttonPlayChord.id = "generated_chords_play_chord" + i.toString();
        buttonPlayChord.innerText = `${getString("chord")} ♪`;
        buttonPlayChord.disabled = !hasAudio;
        buttonPlayChord.classList.add('button-generatedchord');
        // create play arpeggio button
        let buttonPlayArpeggio = document.createElement('button');
        buttonPlayArpeggio.id = "generated_chords_play_arpeggio" + i.toString();
        buttonPlayArpeggio.innerText = `${getString("arpeggio")} ♪`;
        buttonPlayArpeggio.disabled = !hasAudio;
        buttonPlayChord.classList.add('button-generatedchord');
        let divButtons = document.createElement('div');
        divButtons.appendChild(buttonPlayChord);
        divButtons.appendChild(buttonPlayArpeggio);
        divButtons.classList.add('div-generatedchord');
        divGeneratedChord.appendChild(canvasGeneratedChord);
        divGeneratedChord.appendChild(divButtons);
        chordsFretboardHTML += divGeneratedChord.outerHTML;
    }
    return chordsFretboardHTML;
}
function updateChordFretboard(positionsArray, showBarres = true) {
    const nbStrings = getSelectedGuitarNbStrings('chord_explorer_guitar_nb_strings');
    const tuningValues = getSelectedGuitarTuningValue("chord_explorer_guitar_tuning");
    const nbPositions = positionsArray.length;
    for (let index = 0; index < nbPositions; index++) {
        // get start fret index
        const positions = positionsArray[index];
        const startFret = getStartFret(positions);
        let canvas = document.getElementById(`generated_chords_fretboard${index.toString()}`);
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            ctx.strokeStyle = colorFretsStrings;
            // clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // fill background
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.closePath();
            // get last fret x
            let xFretLast = getLastFretX("scale_explorer_canvas_guitar");
            // hint frets
            const hintFrets = [0, 3, 5, 7, 9];
            let indexFret = (startFret > 0) ? startFret - 1 : 0;
            for (let x = xFretMargin; x < xFretLast; x += xFretChordStep) {
                indexFret++;
                if (hintFrets.indexOf(indexFret % 12) < 0)
                    continue;
                // fill hint fret
                ctx.beginPath();
                ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
                ctx.fillStyle = colorHintFret;
                ctx.fillRect(x, yFretMargin, xFretChordStep, canvas.height - yFretMarginChordBottom - 2 * yFretMargin);
                ctx.closePath();
            }
            // horizontal lines (strings)
            let yFretLast = 0;
            for (let i = 0; i < nbStrings; i++) {
                let y = yFretMargin + i * yFretStep;
                ctx.beginPath();
                ctx.strokeStyle = colorFretsStrings;
                ctx.moveTo(xFretMargin, y);
                ctx.lineTo(xFretLast, y);
                ctx.stroke();
                yFretLast = y;
            }
            // vertical lines
            indexFret = 0;
            for (let x = xFretMargin; x <= xFretLast; x += xFretChordStep) {
                let isFretOctave = ((indexFret == 0) || ((indexFret + 1) % 12) == 0);
                ctx.beginPath();
                ctx.strokeStyle = isFretOctave ? colorFretsOctave : colorFretsStrings;
                ctx.moveTo(x, yFretMargin);
                ctx.lineTo(x, canvas.height - yFretMarginChordBottom - yFretMargin);
                ctx.stroke();
                ctx.closePath();
                indexFret++;
            }
            // display start fret number if > 0
            if (startFret > 0) {
                ctx.beginPath();
                ctx.font = "24px Arial";
                ctx.fillStyle = "grey";
                ctx.fillText(startFret.toString(), xFretMargin - 6, yFretLast + 30);
                ctx.closePath();
            }
            // display barres if existing and option set
            if (showBarres) {
                const barres = computeBarres(positions);
                for (let [pos, barre] of barres) {
                    const stringMin = barre[0];
                    const stringMax = barre[1];
                    let posBarre = pos;
                    if (startFret > 0)
                        posBarre -= startFret - 1;
                    // position
                    const yStep = (canvas.height - yFretMarginChordBottom - 2 * yFretMargin) / (nbStrings - 1);
                    const radius = Math.min(xFretChordStep, yStep) / 2 - 2;
                    let x = xFretMargin + (posBarre - 1) * xFretChordStep + xFretChordStep / 2 - 1;
                    let yMin = yFretMargin + (nbStrings - stringMin - 1) * yStep - 1;
                    let yMax = yFretMargin + (nbStrings - stringMax - 1) * yStep - 1;
                    // fill barre
                    ctx.beginPath();
                    ctx.fillStyle = colorNoteNormal;
                    ctx.fillRect(x - radius, yMax, 2 * radius, yMin - yMax);
                    ctx.closePath();
                }
            }
        }
        // get fundamental given mode
        let noteFondamental = getChordExplorerFondamentalValue();
        // display notes positions
        let currentNoteValuesAbs = [];
        for (let i = 1; i <= nbStrings; i++) {
            const j = positions[i - 1];
            const currentNoteValue = getCaseNoteValue(tuningValues, i, j);
            const currentNoteValueAbs = getCaseNoteValueAbs(tuningValues, i, j);
            if (currentNoteValue >= 0)
                currentNoteValuesAbs.push(currentNoteValueAbs);
            // display note
            let currentNote = (currentNoteValue >= 0) ? getNoteName(currentNoteValue) : "X";
            let colorNote = colorNoteNormal;
            if (currentNoteValue == noteFondamental)
                colorNote = colorNoteTonic;
            displayNoteOnFretboard(`generated_chords_fretboard${index.toString()}`, i, j, currentNote, colorNote, nbStrings, xFretChordStep, yFretMarginChordBottom, startFret);
        }
        // update buttons callbacks
        let currentChordsNoteValues = [];
        let bassChordValue = currentNoteValuesAbs[0];
        currentChordsNoteValues.push(0);
        for (let index = 1; index < currentNoteValuesAbs.length; index++) {
            const noteChordValue = currentNoteValuesAbs[index];
            currentChordsNoteValues.push(noteChordValue - bassChordValue);
        }
        bassChordValue -= 36;
        let buttonPlayChord = document.getElementById(`generated_chords_play_chord${index.toString()}`);
        if (buttonPlayChord)
            buttonPlayChord.setAttribute("onClick", `playChord(${bassChordValue}, [${currentChordsNoteValues.toString()}], 0, 0)`);
        let buttonPlayArpeggio = document.getElementById(`generated_chords_play_arpeggio${index.toString()}`);
        if (buttonPlayArpeggio)
            buttonPlayArpeggio.setAttribute("onClick", `playChord(${bassChordValue}, [${currentChordsNoteValues.toString()}], 0, 0.25)`);
    }
}
function getStartFret(positions) {
    if (positions == null || positions.length == 0)
        return 0;
    const positionsNotEmpty = removePositionsEmpty(positions);
    if (positionsNotEmpty == null || positionsNotEmpty.length == 0)
        return 0;
    const posMin = Math.min(...positionsNotEmpty);
    const posMax = Math.max(...positionsNotEmpty);
    const startFret = (posMax > 5) ? posMin : 0;
    return startFret;
}
function saveFretboardChordImage(id, fondamental, bass, chordId, freeNotesStr) {
    let canvasElement = document.getElementById(id);
    let canvasImage = canvasElement.toDataURL('image/png');
    let prefix = (id == "chord_explorer_canvas_guitar") ? "Fretboard" : getString("chord");
    let filename = "";
    if (chordId != null && chordId.length > 0) {
        // chord name mode
        let fondamentalText = getNoteName(fondamental);
        let chordText = chordId;
        // chordText = chordText.replaceAll("sharp", "#");
        // chordText = chordText.replaceAll("flat", "b");
        chordText = chordText.replace(/sharp/g, '#');
        chordText = chordText.replace(/flat/g, 'b');
        chordText = chordText.replace(/slash/g, '/');
        //chordText = chordText.replaceAll("dim", "°");
        //chordText = chordText.replaceAll("aug", "+");
        if (chordId == "M")
            chordText = "MAJ";
        else if (chordId == "m")
            chordText = "min";
        filename = `${prefix}-${fondamentalText}-${chordText}`;
        if (bass >= 0 && bass != fondamental)
            filename += `-${getString("bass")}-${getNoteName(bass)}`;
        filename += ".png";
    }
    else {
        // free notes mode
        let notesStr = "";
        const freeNotesValues = freeNotesStr.split(",");
        let index = 0;
        for (let noteStr of freeNotesValues) {
            if (index > 0)
                notesStr += "-";
            const noteValue = parseInt(noteStr);
            const note = getNoteName(noteValue);
            notesStr += note;
            index++;
        }
        filename = `${prefix}-${notesStr}.png`;
    }
    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}
function getCanvasHeight(nbStrings = 6) {
    return 8 + yFretStep * nbStrings;
}
//# sourceMappingURL=fretboard.js.map
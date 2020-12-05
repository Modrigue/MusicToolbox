// parameters
let tuning: Array<number>= [7, 0, 5, 10, 2, 7];
let nbStrings: number = tuning.length;
let xFretMargin: number = 40;
let yFretMargin: number= 20;
let xFretScaleStep: number = 60;    // used for scale explorer
let xFretChordStep: number = 50;    // used for chord explorer
const yFretMarginChordBottom: number = 20;

// colors
const colorFretsStrings: string = "lightgrey";
const colorFretsOctave: string = "dimgrey";
const colorNoteTonic: string = "firebrick";
const colorNoteNormal: string = "dimgrey";
const colorNoteChar: string = "dodgerblue";
const colorHintFret: string = "whitesmoke";

function getCaseNoteValue(i: number, j: number): number
{
    // handle not hit string
    if (j < 0)
        return -1;

    return ((tuning[i - 1] + j) % 12);
}

// <i> has offset 1
function displayNoteOnFretboard(id: string, i: number, j: number, text: string, color: string, xFretStep: number = xFretScaleStep, marginBottom: number = 0, startFret: number = 0): void
{
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(id);
    if (canvas.getContext) 
    {
        let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
        const yStep = (canvas.height - marginBottom - 2* yFretMargin) / (nbStrings - 1);
        const radius = Math.min(xFretStep, yStep) / 2 - 2;

        if ( i > nbStrings)
            return;

        // get last fret x
        let xFretLast = getLastFretX();

        // handle startFret if > 0
        if (startFret > 0 && j > 0)
            j -= startFret - 1;

        // position
        let x = xFretMargin + (j - 1) * xFretStep + xFretStep / 2 - 1;
        if (j <= 0)
            x = xFretMargin - 40 + 40 / 2 - 1;
        let y = yFretMargin + (nbStrings - i) * yStep - 1;
        if (x > xFretLast)
            return;

        // handle not hit string
        if (j < 0)
        {
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
        
        // text
        const lang = getSelectedCulture();
        let xShift = 0;
        let yShift = 0;
        switch (lang)
        {
            case "fr":
                ctx.font = "14px Arial";
                xShift = -9 - 2*(text.length - 2);
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

function updateFretboard(noteValue: number, scaleValues: Array<number>,
    charIntervals: Array<number>, scaleName: string): void
{
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas_guitar");

    // fretboard
    if (canvas.getContext) 
    {
        let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
        ctx.strokeStyle = colorFretsStrings;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fill background
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        // get last fret x
        let xFretLast = getLastFretX();

        // hint frets
        const hintFrets = [0, 3, 5, 7, 9];
        let indexFret = 0;
        for (let x = xFretMargin; x < xFretLast; x += xFretScaleStep) 
        {
            indexFret++;

            if (hintFrets.indexOf(indexFret % 12) < 0)
                continue;

            // fill hint fret
            ctx.beginPath();
            ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
            ctx.fillStyle = colorHintFret;
            ctx.fillRect(x, yFretMargin, xFretScaleStep, canvas.height - 2*yFretMargin);
            ctx.closePath();
        }

        // horizontal lines (strings)
        let yStep = (canvas.height - 2 * yFretMargin) / (nbStrings - 1);
        for (let i = 0; i < nbStrings; i++) 
        {
            let y = yFretMargin + i*yStep;

            ctx.beginPath();
            ctx.strokeStyle = colorFretsStrings;
            ctx.moveTo(xFretMargin, y);
            ctx.lineTo(xFretLast, y);
            ctx.stroke();
        }

        // vertical lines
        indexFret = 0;
        for (let x = xFretMargin; x <= xFretLast; x += xFretScaleStep) 
        {
            let isFretOctave = ((indexFret == 0) || ((indexFret + 1) % 12) == 0);

            ctx.beginPath();
            ctx.strokeStyle = isFretOctave ? colorFretsOctave : colorFretsStrings;
            ctx.moveTo(x, yFretMargin);
            ctx.lineTo(x, canvas.height - yFretMargin);
            ctx.stroke();
            ctx.closePath();

            indexFret++;
        }
    }

    // display notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    for (let i: number = 1; i <= nbStrings; i++)
    {
        for (let j: number = 0; j <3*12; j++)
        {
            const currentNoteValue = getCaseNoteValue(i, j);
            if (scaleNotesValues.indexOf(currentNoteValue) < 0)
                continue;

            // display note

            const currentNote = getNoteName(currentNoteValue);

            let colorNote = colorNoteNormal;
            if (currentNoteValue == noteValue)
                colorNote = colorNoteTonic;

                const indexNote = scaleNotesValues.indexOf(currentNoteValue);
            if (charIntervals.indexOf(indexNote) >= 0)
                colorNote = colorNoteChar; // characteristic note

            displayNoteOnFretboard("canvas_guitar", i, j, currentNote, colorNote);
        }
    }

    // update save callback
    canvas.setAttribute("onclick", `saveFretboardImage(${noteValue}, "${scaleName}")`);
}

// get last fret x position
function getLastFretX()
{
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas_guitar");

    let xFretLast = 0;
    for (let x = xFretMargin; x < canvas.width - xFretMargin; x += xFretScaleStep) 
        xFretLast = x;

    return xFretLast;
}

function saveFretboardImage(noteValue: number, scaleName: string)
{
    let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas_guitar');
    let canvasImage: string = canvasElement.toDataURL('image/png');
    const noteSelectedText: string = getNoteName(noteValue);
    let scaleSelectedText: string = scaleName;
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
        a.download = `${getString("fretboard")}-${noteSelectedText}-${scaleSelectedText}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove()
      };

    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}


/////////////////////////////////// CHORDS ////////////////////////////////////


function initChordsFretboardHTML(noteFondamental: number, chordSelected: string, freeNotesSelected: Array<number>, nbPositions: number): string
{
    let chordsFretboardHTML = "";

    for (let i = 0; i < nbPositions; i++)
    {
        if (i > 0)
            chordsFretboardHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

        let canvas = document.createElement('canvas');
        const idText = "generated_chords_fretboard" + i.toString();
        canvas.id = idText;
        //canvas.className = "canvas_generated_chords_fretboard";
        canvas.width = xFretMargin + 5*xFretChordStep;
        canvas.height = 200 + yFretMarginChordBottom;
        //canvas.style.border = '1px solid grey';
        canvas.setAttribute("onclick", `saveFretboardChordImage(\"${idText}\", ${noteFondamental},\"${chordSelected}\", \"${freeNotesSelected.toString()}\")`);

        chordsFretboardHTML += canvas.outerHTML;
    }

    return chordsFretboardHTML;
}

function updateChordFretboard(positionsArray: Array<Array<number>>, showBarres = true)
{
    const nbPositions = positionsArray.length;
    for (let index = 0; index < nbPositions; index++)
    {
        // get start fret index
        const positions = positionsArray[index];
        const startFret = getStartFret(positions);

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(`generated_chords_fretboard${index.toString()}`);
        if (canvas.getContext) 
        {
            let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
            ctx.strokeStyle = colorFretsStrings;

            // clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // fill background
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.closePath();

            // get last fret x
            let xFretLast = getLastFretX();

            // hint frets
            const hintFrets = [0, 3, 5, 7, 9];
            let indexFret = (startFret > 0) ? startFret - 1 : 0;
            for (let x = xFretMargin; x < xFretLast; x += xFretChordStep) 
            {
                indexFret++;

                if (hintFrets.indexOf(indexFret % 12) < 0)
                    continue;

                // fill hint fret
                ctx.beginPath();
                ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
                ctx.fillStyle = colorHintFret;
                ctx.fillRect(x, yFretMargin, xFretChordStep, canvas.height  - yFretMarginChordBottom - 2*yFretMargin);
                ctx.closePath();
            }

            // horizontal lines (strings)
            let yStep = (canvas.height - yFretMarginChordBottom - 2 * yFretMargin) / (nbStrings - 1);
            let yFretLast = 0;
            for (let i = 0; i < nbStrings; i++) 
            {
                let y = yFretMargin + i*yStep;

                ctx.beginPath();
                ctx.strokeStyle = colorFretsStrings;
                ctx.moveTo(xFretMargin, y);
                ctx.lineTo(xFretLast, y);
                ctx.stroke();

                yFretLast = y;
            }

            // vertical lines
            indexFret = 0;
            for (let x = xFretMargin; x <= xFretLast; x += xFretChordStep) 
            {
                let isFretOctave = ((indexFret == 0) || ((indexFret + 1) % 12) == 0);

                ctx.beginPath();
                ctx.strokeStyle = isFretOctave ? colorFretsOctave : colorFretsStrings;
                ctx.moveTo(x, yFretMargin);
                ctx.lineTo(x, canvas.height  - yFretMarginChordBottom - yFretMargin);
                ctx.stroke();
                ctx.closePath();

                indexFret++;
            }

            // display start fret number if > 0
            if (startFret > 0)
            {
                ctx.beginPath();
                ctx.font = "24px Arial";
                ctx.fillStyle = "grey";
                ctx.fillText(startFret.toString(), xFretMargin - 6, yFretLast + 30);
                ctx.closePath();
            }

            // display barres if existing and option set
            if (showBarres)
            {
                const barres: Map<number, [number, number]> = computeBarres(positions);
                for (let [pos, barre] of barres)
                {
                    const stringMin = barre[0];
                    const stringMax = barre[1];
                    let posBarre: number = pos;
                    if (startFret > 0)
                        posBarre -= startFret - 1;
                    
                    // position
                    const yStep = (canvas.height - yFretMarginChordBottom - 2* yFretMargin) / (nbStrings - 1);
                    const radius = Math.min(xFretChordStep, yStep) / 2 - 2;
                    let x = xFretMargin + (posBarre - 1) * xFretChordStep + xFretChordStep / 2 - 1;
                    let yMin = yFretMargin + (nbStrings - stringMin - 1) * yStep - 1;
                    let yMax = yFretMargin + (nbStrings - stringMax - 1) * yStep - 1;

                    // fill barre
                    ctx.beginPath();
                    ctx.fillStyle = colorNoteNormal;
                    ctx.fillRect(x - radius, yMax, 2*radius, yMin - yMax);
                    ctx.closePath();
                }
            }
        }

        // get fundamental given mode
        let noteFondamental = -1;
        let selectedMode = getSelectedChordGeneratorMode();
        if (selectedMode == "name")
        {
            const noteExplorerChordInput: HTMLInputElement = <HTMLInputElement>document.getElementById('note_explorer_chord');
            const noteSelected: string = noteExplorerChordInput.value;
            noteFondamental = parseInt(noteSelected);
        }
        else
        {
            const selectedNotesValues = getSelectedChordExplorerNotes();
            noteFondamental = (selectedNotesValues.length > 0) ? selectedNotesValues[0] : -1;
        }

        // display notes positions
        for (let i = 1; i <= nbStrings; i++)
        {
            const j = positions[i - 1];
            const currentNoteValue = getCaseNoteValue(i, j);
            
            // display note

            let currentNote = (currentNoteValue >= 0) ? getNoteName(currentNoteValue) : "X";

            let colorNote = colorNoteNormal;
            if (currentNoteValue == noteFondamental)
                colorNote = colorNoteTonic;

            displayNoteOnFretboard(`generated_chords_fretboard${index.toString()}`, i, j, currentNote, colorNote, xFretChordStep, yFretMarginChordBottom, startFret);
        }
    }
}

function getStartFret(positions: Array<number>)
{
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

function saveFretboardChordImage(id: string, noteValue: number, chordId: string, freeNotesStr: string): void
{    
    let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(id);
    let canvasImage: string = canvasElement.toDataURL('image/png');
    let filename = "";

    if (freeNotesStr == null || freeNotesStr.length == 0)
    {
        // chord name mode
        let noteText = getNoteName(noteValue);

        let chordText = chordId;
        // chordText = chordText.replaceAll("sharp", "#");
        // chordText = chordText.replaceAll("flat", "b");
        chordText = chordText.replace(/sharp/g, '#');
        chordText = chordText.replace(/flat/g, 'b');
        //chordText = chordText.replaceAll("dim", "°");
        //chordText = chordText.replaceAll("aug", "+");
        if (chordId == "M")
            chordText = "MAJ";
        else if (chordId == "m")
            chordText = "min";

        filename = `${getString("fretboard")}-${noteText}-${chordText}.png`;
    }
    else
    {
        // free notes mode
        let notesStr = "";
        const freeNotesValues = freeNotesStr.split(",");
        let index = 0;
        for (let noteStr of freeNotesValues)
        {
            if (index > 0)
                notesStr += "-";

            const noteValue = parseInt(noteStr);
            const note = getNoteName(noteValue);
            notesStr += note;
            index++;
        }

        filename = `${getString("fretboard")}-${notesStr}.png`;
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
        a.remove()
      };

    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}
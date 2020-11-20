// parameters
let xKeyMargin = 40;
let yKeyMargin = 20;
let xKeyStep = 60;
const wFactorBlackKey = 0.6;
const hFactorBlackKey = 0.7;

// <i> has offset 0
function displayNoteOnKeyboard(i, text, color)
{
    let canvas = document.getElementById("canvas_keyboard");
    if (canvas.getContext) 
    {
        let ctx = canvas.getContext("2d");
        const yStep = (canvas.height - 2* yKeyMargin) / (nbStrings - 1);
        const radius = Math.min(xKeyStep, yStep) / 2 - 2;

        const notesBlackKeys = [1, 4, 6, 9, 11];

        // position
        const xFirstKey = xKeyMargin + xKeyStep / 2 - 1;
        let x = xFirstKey;
        if (i > 3)
        {
            for (let noteValue = 4; noteValue <= i; noteValue++)
            {
                const noteValueRel = noteValue % 12;
                const noteValuePrev = (noteValue - 1) % 12;

                if (notesBlackKeys.includes(noteValueRel))
                    x += xKeyStep/2;
                else if (!notesBlackKeys.includes(noteValueRel) && notesBlackKeys.includes(noteValuePrev))
                    x += xKeyStep/2;
                else if (!notesBlackKeys.includes(noteValueRel) && !notesBlackKeys.includes(noteValuePrev))
                    x += xKeyStep;
            }
        }

        const y = (notesBlackKeys.includes(i % 12)) ? wFactorBlackKey * canvas.height - radius/2 - 5: 0.8 * canvas.height;
        if (x > canvas.width - xKeyStep)
            return;
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

function updateKeyboardFromTonality()
{
  // get selected note and scale/mode values
  const noteValue = getSelectedNoteValue();
  const scaleValues = getSelectedScaleValues();
  const charIntervals = getSelectedScaleCharIntervals();

  // update keyboard
  updateKeyboard(noteValue, scaleValues, charIntervals);
}

function updateKeyboard(noteValue, scaleValues, charIntervals)
{
    let canvas = document.getElementById("canvas_keyboard");

    // keyboard
    if (canvas.getContext) 
    {
        let ctx = canvas.getContext("2d");

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fill background
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";

        // horizontal lines
        const yStep = (canvas.height - 2 * yKeyMargin);
        for (let i = 0; i < 2; i++) 
        {
            const y = yKeyMargin + i*yStep;
            ctx.moveTo(xKeyMargin, y);
            ctx.lineTo(canvas.width - xKeyMargin, y);
            ctx.stroke();
        }

        // white keys
        for (let x = xKeyMargin; x < canvas.width - xKeyMargin; x += xKeyStep) 
        {
            ctx.beginPath();
            ctx.moveTo(x, yKeyMargin);
            ctx.lineTo(x, canvas.height - yKeyMargin);
            ctx.stroke();
            ctx.closePath();
        }

        // black keys
        const indexBlackKeys = [1, 2, 4, 5, 6];
        let index = 0;
        for (let x = xKeyMargin + xKeyStep; x < canvas.width - xKeyMargin; x += xKeyStep) 
        {
            index++;
            if (!indexBlackKeys.includes(index % 7))
                continue;

            ctx.beginPath();
            ctx.fillRect(x - 0.5*wFactorBlackKey*xKeyStep, yKeyMargin, wFactorBlackKey*xKeyStep, hFactorBlackKey*(canvas.height - 2*yKeyMargin));
            ctx.closePath();
        }
    }

    // display notes
    const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    for (let i = 3; i <= 3 + 4*12; i++)
    {
        const currentNoteValue = (i % 12);
        if (!scaleNotesValues.includes(currentNoteValue))
            continue;

        // display note
        
        const currentNote = getNoteName(currentNoteValue);

        let colorNote = colorNoteNormal;
        if (currentNoteValue == noteValue)
            colorNote = colorNoteTonic;

        const indexNote = scaleNotesValues.indexOf(currentNoteValue);
        if (charIntervals != null && charIntervals.includes(indexNote))
            colorNote = colorNoteChar; // characteristic note

        displayNoteOnKeyboard(i, currentNote, colorNote);
    }
}

function saveKeyboardImage()
{
    let canvasImage = document.getElementById('canvas_keyboard').toDataURL('image/png');
    const noteSelectedText = getSelectorText("note");
    let scaleSelectedText = getSelectorText("scale");
    scaleSelectedText = scaleSelectedText.replaceAll(" / ", ' ');
    scaleSelectedText = scaleSelectedText.replaceAll(' ', '_');
    scaleSelectedText = scaleSelectedText.replaceAll('♭', 'b');

    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = getString("keyboard") + '-' + noteSelectedText + '-' + scaleSelectedText + '.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove()
      };

    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}
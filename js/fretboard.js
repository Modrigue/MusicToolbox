// parameters
var tuning = [7, 0, 5, 10, 2, 7];
var nbStrings = tuning.length;
var xFretMargin = 40;
var yFretMargin = 20;
var xFretStep = 60;

// colors
var colorFretsStrings = "lightgrey";
var colorFretsOctave = "dimgrey";
var colorNoteTonic = "firebrick";
var colorNoteNormal = "dimgrey";
var colorNoteChar = "dodgerblue";
var colorHintFret = "whitesmoke";

function getCaseNoteValue(i, j)
{
    return ((tuning[i - 1] + j) % 12);
}

// <i> has offset 1
function displayNoteOnFretboard(i, j, text, color)
{
    canvas = document.getElementById("canvas_guitar");
    if (canvas.getContext) 
    {
        var ctx = canvas.getContext("2d");
        var yStep = (canvas.height - 2* yFretMargin) / (nbStrings - 1);
        var radius = Math.min(xFretStep, yStep) / 2 - 2;

        if ( i > nbStrings)
            return;

        // position
        var x = xFretMargin + (j - 1) * xFretStep + xFretStep / 2 - 1;
        if (j == 0)
            x = xFretMargin + (j - 1) * 40 + 40 / 2 - 1;
        var y = yFretMargin + (nbStrings - i) * yStep - 1;
        if (x > canvas.width - xFretMargin)
            return;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // text
        var lang = getSelectedCulture();
        switch (lang)
        {
            case "fr":
                ctx.font = "14px Arial";
                var xShift = -9 - 2*(text.length - 2);
                var yShift = 4; //6;
                break;

            case "int":
            default:
                ctx.font = "18px Arial";
                var xShift = (text.length == 2) ? -12 : -6;
                var yShift = 6;
                break;
        }
        ctx.fillStyle = "white";
        ctx.fillText(text, x + xShift, y + yShift); 
    }
}

function updateFretboardFromTonality()
{
  // get selected note and scale/mode values
  var noteValue = getSelectedNoteValue();
  var scaleValues = getSelectedScaleValues();
  var charIntervals = getSelectedScaleCharIntervals();

  // update fretboard
  updateFretboard(noteValue, scaleValues, charIntervals);
}

function updateFretboard(noteValue, scaleValues, charIntervals)
{
    var canvas = document.getElementById("canvas_guitar");

    // fretboard
    if (canvas.getContext) 
    {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = colorFretsStrings;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fill background
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        // hint frets
        var hintFrets = [0, 3, 5, 7, 9];
        var indexFret = 0;
        for (x = xFretMargin; x < canvas.width - xFretMargin; x += xFretStep) 
        {
            indexFret++;

            if (!hintFrets.includes(indexFret % 12))
                continue;

            // fill hint fret
            ctx.beginPath();
            ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
            ctx.fillStyle = colorHintFret;
            ctx.fillRect(x, yFretMargin, xFretStep, canvas.height - 2*yFretMargin);
            ctx.closePath();
        }

        // horizontal lines (strings)
        var yStep = (canvas.height - 2 * yFretMargin) / (nbStrings - 1);
        for (i = 0; i < nbStrings; i++) 
        {
            var y = yFretMargin + i*yStep;
            ctx.moveTo(xFretMargin, y);
            ctx.lineTo(canvas.width - xFretMargin, y);
            ctx.stroke();
        }

        // vertical lines
        var indexFret = 0;
        for (x = xFretMargin; x < canvas.width - xFretMargin; x += xFretStep) 
        {
            var isFretOctave = ((indexFret == 0) || ((indexFret + 1) % 12) == 0);

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
    var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
    for (i = 1; i <= nbStrings; i++)
    {
        for (j = 0; j <3*12; j++)
        {
            var currentNoteValue = getCaseNoteValue(i, j);
            if (!scaleNotesValues.includes(currentNoteValue))
                continue;

            // display note

            var currentNote = getNoteName(currentNoteValue);

            var colorNote = colorNoteNormal;
            if (currentNoteValue == noteValue)
                colorNote = colorNoteTonic;

            var indexNote = scaleNotesValues.indexOf(currentNoteValue);
            if (charIntervals != null && charIntervals.includes(indexNote))
                colorNote = colorNoteChar; // characteristic note

            displayNoteOnFretboard(i, j, currentNote, colorNote);
        }
    }
}

function saveFretboardImage()
{
    let canvasImage = document.getElementById('canvas_guitar').toDataURL('image/png');
    var noteSelectedText = getSelectorText("note");
    var scaleSelectedText = getSelectorText("scale");
    scaleSelectedText = scaleSelectedText.replaceAll(" / ", ' ');
    scaleSelectedText = scaleSelectedText.replaceAll(' ', '_');
    scaleSelectedText = scaleSelectedText.replaceAll('♭', 'b');

    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = getString("fretboard") + '-' + noteSelectedText + '-' + scaleSelectedText + '.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove()
      };

    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}
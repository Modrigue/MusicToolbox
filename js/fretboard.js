// parameters
var tuning = [7, 0, 5, 10, 2, 7];
var nbStrings = tuning.length;
var xMargin = 40;
var yMargin = 20;
var xStep = 50;

// colors
var colorFretsStrings = "lightgrey";
var colorFretsOctave = "dimgrey";
var colorNoteTonic = "firebrick";
var colorNoteNormal = "dimgrey";
var colorNoteChar = "dodgerblue";

function getCaseNoteValue(i, j)
{
    return ((tuning[i - 1] + j) % 12);
}

// <i> has offset 1
function displayNoteOnFretboard(i, j, text, color)
{
    canvas = document.getElementById("canvas");
    if (canvas.getContext) 
    {
        var ctx = canvas.getContext("2d");
        var yStep = (canvas.height - 2* yMargin) / (nbStrings - 1);
        var radius = Math.min(xStep, yStep) / 2 - 2;

        if ( i > nbStrings)
            return;

        // position
        var x = xMargin + (j - 1) * xStep + xStep / 2 - 1;
        var y = yMargin + (nbStrings - i) * yStep - 1;
        if (x > canvas.width - xMargin)
            return;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // text
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        var xShift = (text.length == 2) ? -12 : -6;
        var yShift = 6;
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
    var canvas = document.getElementById("canvas");

    // fretboard
    if (canvas.getContext) 
    {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = colorFretsStrings;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // horizontal lines (strings)
        var yStep = (canvas.height - 2 * yMargin) / (nbStrings - 1);
        for (i = 0; i < nbStrings; i++) 
        {
            var y = yMargin + i*yStep;
            ctx.moveTo(xMargin, y);
            ctx.lineTo(canvas.width - xMargin, y);
            ctx.stroke();
        }

        // vertical lines
        var indexFret = 0;
        for (j = xMargin; j < canvas.width - xMargin; j += 50) 
        {
            ctx.beginPath();
            ctx.strokeStyle = ((indexFret % 12) == 0) ? colorFretsOctave : colorFretsStrings;
            ctx.moveTo(j, yMargin);
            ctx.lineTo(j, canvas.height - yMargin);
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

            var currentNote = notesDict[currentNoteValue];

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

function resizeCanvas()
{
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 30;
    //updateFretboardFromTonality();
    onNoteChanged();
}
////////////////////////////// SELECTORS FUNCTIONS ////////////////////////////

// get selected note
function getSelectedNoteValue()
{
  noteSelected = document.getElementById("note").value;
  return parseInt(noteSelected);
}

// get selected scale and mode notes values
function getSelectedScaleValues()
{
  scaleSelected = document.getElementById("scale").value;
  var scaleAttributes = scaleSelected.split(",");
  var scaleName = scaleAttributes[0];
  var modeValue = parseInt(scaleAttributes[1]);
  var scaleFamily = scaleFamiliesDict[scaleName];
  
  return getModeNotesValues(scaleFamily, modeValue);
}

// get selected scale and mode characteristic interval(s)
function getSelectedScaleCharIntervals()
{
  scaleSelected = document.getElementById("scale").value;
  var refScaleAttributes = scaleSelected.split(",");

  // no characterisitic notes
  if (refScaleAttributes.length < 3)
    return "";
  
  // parse reference scale attribute
  var diffString = refScaleAttributes[2];
  var diffAttributes = scaleSelected.split(":");
  if (diffAttributes.length < 2)
    return "";
  var refScaleString = diffAttributes[1];
  var refScaleAttributes = refScaleString.split(";");
  var refScaleName = refScaleAttributes[0];
  var refModeValue = parseInt(refScaleAttributes[1]);
  var refScaleFamily = scaleFamiliesDict[refScaleName];
  
  // get selected and reference scale values
  var refScaleValues = getModeNotesValues(refScaleFamily, refModeValue);
  var scaleValues = getSelectedScaleValues();
  
  // compute differences between selected and reference scale values
  return arraysDiff(scaleValues, refScaleValues);
}


//////////////////////////////// NOTES FUNCTIONS //////////////////////////////

// add interval to note value
function addToNoteValue(noteValue, interval)
{
  return ((noteValue + interval) % 12);
}

// get scale notes values given tonic and scale
function getScaleNotesValues(noteValue, scaleValues)
{
  var scaleNotesValues = [];

  scaleValues.forEach(function (interval, index)
  {
    newNoteValue = addToNoteValue(noteValue, interval);
    scaleNotesValues.push(newNoteValue);
  });

  return scaleNotesValues;
}

// get mode notes values given scale and mode number
function getModeNotesValues(scaleValues, modeNumber)
{
  var modeNotesValues = [];

  var nbNotes = scaleValues.length;
  for (i = 0; i < nbNotes; i++)
  {
    var index = (i + (modeNumber - 1)) % nbNotes;
    var noteValue = scaleValues[index];
    modeNotesValues.push(noteValue);
  }

  var firstInterval = scaleValues[modeNumber - 1];
  for (i = 0; i < nbNotes; i++)
  {
    modeNotesValues[i] = (modeNotesValues[i] - firstInterval + 12) % 12;
  } 

  return modeNotesValues;
}

function getAltIntervalNotation(intervalValue, index)
{
  index += 1;

  // tonic: nop
  if (index == 1)
    return "T";

  var exactInterval = getKeyFromValue(intervalsDict, index.toString());
  var res = index.toString();

  // exact interval: nop
  if (intervalValue == exactInterval)
  {
    return intervalsDict[intervalValue];
  }
  // ♭'s
  else if (intervalValue < exactInterval)
  {
    for (var i = 0; i < exactInterval - intervalValue; i++)
    {
      res = "♭" + res;
    }
    return res;
  }
  // #'s
  else if (intervalValue > exactInterval)
  {
    for (var i = 0; i < intervalValue - exactInterval; i++)
    {
      res = "#" + res;
    }
    return res;
  }

  return "?";
}

function getIntervalString(intervalName, intervalNameAlt)
{
  if (intervalName == intervalNameAlt)
    return intervalName;

  var index =  getIndexFromInterval(intervalName);
  var indexAlt =  getIndexFromInterval(intervalNameAlt);

  if (index <= indexAlt)
    return intervalName + " / " + intervalNameAlt;
  else
    return intervalNameAlt + " / " + intervalName;
}

function getIndexFromInterval(intervalName)
{
  var indexString = intervalName.replace(/♭/gi, "").replace(/#/gi, "");
  return parseInt(indexString);
}


//////////////////////////////// CHORDS FUNCTIONS /////////////////////////////


// get chord position given scale values and number of notes
function getChordNumberInScale(scaleValues, pos, nbNotes)
{
  var chordValues = [];

  var posCur = pos;
  var nbNotesInScale = scaleValues.length;
  var firstNoteValue = -1;
  for (i = 0; i < nbNotes; i++)
  {
    var value = scaleValues[posCur];
    if (i == 0)
      firstNoteValue = value;

    var finalValue = (value - firstNoteValue + 12) % 12;
    chordValues.push(finalValue);

    posCur = (posCur + 2) % nbNotesInScale;
  }

  //alert(chordValues);
  return chordValues;
}

// get chord representation from note and chrod name
function getNoteNameChord(noteName, chordName)
{
  if (chordName == "M")
    return noteName;
  else
    return noteName + chordName;
}

// get roman representation of chord position
function getRomanChord(pos, chordName, nbNotesInChords)
{
  var romanPos = romanDigits[pos + 1];
  
  // write minor chords in lower case
  var chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
  var chordValues = chordsDict[chordName];
  if (chordValues != null && chordValues.length > 1)
  {
    var isMinorChord = (chordValues[1] == 3);
    if (isMinorChord)
      romanPos = romanPos.toLowerCase();
  }

  // do not display 3-notes minor and major chord notation
  if (chordName == "m" || chordName == "M")
    romanPos = romanPos;
  else if (isMinorChord && chordName.startsWith('m'))
    romanPos += chordName.substring(1);
  else
    romanPos += chordName;

  return romanPos;
}


/////////////////////////////// HTML FUNCTIONS ////////////////////////////////

function getScaleNotesTable(noteValue, scaleValues, charIntervals)
{
  var nbNotesInScale = scaleValues.length;

  // build scale notes list
  var notesScaleTablesHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes&nbsp;<button onclick=\"onPlayScale()\" onmouseover=\"\" style=\"cursor: pointer;\">Play ♪</button></div><div id=\"resp-table-body\">";
  var notesScaleRowHTML = "<div class=\"resp-table-row\">";
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    // highlight if characteristic note
    var classString = "table-body-cell-interactive";
    if (index == 0)
      classString = "table-body-cell-tonic-interactive";
    else if (charIntervals != null && charIntervals.includes(index))
      classString = "table-body-cell-char-interactive";

    var callbackString = "onPlayNoteInScale(" + index + ")";

    noteName = notesDict[noteValue];
    notesScaleRowHTML = notesScaleRowHTML.concat("<div class=" + classString + " onclick=" + callbackString + ">");
    notesScaleRowHTML = notesScaleRowHTML.concat(noteName.toString());
    notesScaleRowHTML = notesScaleRowHTML.concat("</div>");
  });
  notesScaleRowHTML = notesScaleRowHTML.concat("</div>");

  // build intervals list
  var intervalsScaleRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  scaleValues.forEach(function (intervalValue, index)
  {
    intervalName = intervalsDict[intervalValue];
    var intervalNameAlt = getAltIntervalNotation(intervalValue, index);

    // highlight if characteristic interval
    var classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (charIntervals != null && charIntervals.includes(index))
      classString = "table-body-cell-char";

    // display alternate notation if 7-notes cale
    var intervalString = (nbNotesInScale == 7) ?
      getIntervalString(intervalName, intervalNameAlt) : intervalName;

    intervalsScaleRowHTML = intervalsScaleRowHTML.concat("<div class=" + classString + ">");
    intervalsScaleRowHTML = intervalsScaleRowHTML.concat(intervalString);
    intervalsScaleRowHTML = intervalsScaleRowHTML.concat("</div>");
  });
  intervalsScaleRowHTML = intervalsScaleRowHTML.concat("</div>");

  notesScaleTablesHTML = notesScaleTablesHTML.concat(notesScaleRowHTML);
  notesScaleTablesHTML = notesScaleTablesHTML.concat(intervalsScaleRowHTML);
  notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");

  return notesScaleTablesHTML;
}

function getChordsTable(scaleValues, scaleNotesValues, nbNotesInChords)
{
  var chordValuesArray = [];
  var chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;

  var chordsTableHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Chords with " + nbNotesInChords + " notes&nbsp;<button onclick=\"onPlayChords(" + nbNotesInChords + ")\" onmouseover=\"\" style=\"cursor: pointer;\">Play ♪</button></div><div id=\"resp-table-body\">";
  scaleValues.forEach(function (noteValue, index)
  {
    var chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
    chordValuesArray.push(chordValues);
  });
  
  // chords
  chordsRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    var noteValue = scaleNotesValues[index];
    var noteName = notesDict[noteValue];

    var chordName = getKeyFromValue(chordsDict, chordValues);
    var chordNoteName = getNoteNameChord(noteName, chordName);

    var callbackString = "onPlayChordInScale(" + nbNotesInChords + "," + index + ")";

    chordsRowHTML = chordsRowHTML.concat("<div class=\"table-body-cell-interactive\" onclick=" + callbackString + ">");
    chordsRowHTML = chordsRowHTML.concat(chordNoteName);
    chordsRowHTML = chordsRowHTML.concat("</div>");
  });
  chordsRowHTML = chordsRowHTML.concat("</div>");

  // roman chord representation
  chordsRomanRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    var chordName = getKeyFromValue(chordsDict, chordValues);
    var romanChord = getRomanChord(index, chordName, nbNotesInChords);

    chordsRomanRowHTML = chordsRomanRowHTML.concat("<div class=\"table-body-cell\">");
    chordsRomanRowHTML = chordsRomanRowHTML.concat(romanChord);
    chordsRomanRowHTML = chordsRomanRowHTML.concat("</div>");
  });
  chordsRomanRowHTML = chordsRomanRowHTML.concat("</div>");
  
  // chords notes
  chordsNotesRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    var noteFondamental = scaleNotesValues[index];

    var chordNotesStr = "";
    chordValues.forEach(function (intervalValue)
    {
      newNoteValue = addToNoteValue(noteFondamental, intervalValue);
      noteName = notesDict[newNoteValue];
      chordNotesStr = chordNotesStr.concat(noteName + ",&nbsp;")
    });
    chordNotesStr = chordNotesStr.slice(0, -7);

    var callbackString = "onPlayChordInScale(" + nbNotesInChords + "," + index + ")";

    chordsNotesRowHTML = chordsNotesRowHTML.concat("<div class=\"table-body-cell-interactive\" onclick=" + callbackString + ">");
    chordsNotesRowHTML = chordsNotesRowHTML.concat(chordNotesStr);
    chordsNotesRowHTML = chordsNotesRowHTML.concat("</div>");
  });
  chordsNotesRowHTML = chordsNotesRowHTML.concat("</div>");

  // chords intervals
  chordsIntervalsRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    var chordIntervalsStr = "";
    chordValues.forEach(function (intervalValue)
    {
      intervalName = intervalsDict[intervalValue];
      if (intervalName == "T")
        intervalName = "F"; // fondamental

      chordIntervalsStr = chordIntervalsStr.concat(intervalName + ",&nbsp;")
    });
    chordIntervalsStr = chordIntervalsStr.slice(0, -7);

    chordsIntervalsRowHTML = chordsIntervalsRowHTML.concat("<div class=\"table-body-cell\">");
    chordsIntervalsRowHTML = chordsIntervalsRowHTML.concat(chordIntervalsStr);
    chordsIntervalsRowHTML = chordsIntervalsRowHTML.concat("</div>");
  });
  chordsIntervalsRowHTML = chordsIntervalsRowHTML.concat("</div>");

  chordsTableHTML = chordsTableHTML.concat(chordsRowHTML);
  chordsTableHTML = chordsTableHTML.concat(chordsRomanRowHTML);
  chordsTableHTML = chordsTableHTML.concat(chordsNotesRowHTML);
  chordsTableHTML = chordsTableHTML.concat(chordsIntervalsRowHTML);
  chordsTableHTML = chordsTableHTML.concat("</div>");

  return chordsTableHTML;
}

/////////////////////////////// GENERIC FUNCTIONS /////////////////////////////

function getKeyFromValue(dict, value)
{
  if (dict == null)
    return null;

    for(var key in dict)
    {
      var valueCur = dict[key];
      if (arraysEqual(valueCur, value))
        return key;
    }
    return "?";
}

function arraysEqual(a, b)
{
  if (a === b)
    return true;
  if (a == null || b == null)
    return false;
  if (a.length !== b.length)
    return false;

  for (var i = 0; i < a.length; ++i)
  {
    if (a[i] !== b[i])
      return false;
  }

  return true;
}

function arraysDiff(a, b)
{
  var diffArray = [];

  if (a == null && b != null)
    return b;
  if (a != null && b == null)
    return a;

  if (a.length == b.length)
  {
    for (var i = 0; i < a.length; i++)
    {
      if (a[i] !== b[i])
        diffArray.push(i);
    }
  }
  else
  {
    // different lengths
    var A = a;
    var B = b;
    if (a.length < b.length)
    {
      // ensure A is the biggest array
      A = b;
      B = a;
    }
    
    // find A elements non included in B
    for (var i = 0; i < A.length; i++)
    {
      if (!B.includes(A[i]))
        diffArray.push(i);
    }
  }

  return diffArray;
}
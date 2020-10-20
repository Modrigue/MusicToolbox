//////////////////////////////// MUSIC FUNCTIONS //////////////////////////////

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
  else
    romanPos += chordName;

  return romanPos;
}


/////////////////////////////// HTML FUNCTIONS ////////////////////////////////

function getScaleNotes(noteValue, scaleValues)
{
  // build scale notes list
  var notesScaleTablesHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes</div><div id=\"resp-table-body\">";
  notesScaleTablesHTML = notesScaleTablesHTML.concat("<div class=\"resp-table-row\">");
  var scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    noteName = notesDict[noteValue];
    notesScaleTablesHTML = notesScaleTablesHTML.concat("<div class=\"table-body-cell\">");
    notesScaleTablesHTML = notesScaleTablesHTML.concat(noteName.toString());
    notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");
  });
  notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");

  // build intervals list
  notesScaleTablesHTML = notesScaleTablesHTML.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  scaleValues.forEach(function (intervalValue, index)
  {
    intervalName = intervalsDict[intervalValue];
    notesScaleTablesHTML = notesScaleTablesHTML.concat("<div class=\"table-body-cell\">");
    notesScaleTablesHTML = notesScaleTablesHTML.concat(intervalName.toString());
    notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");
  });
  notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");

  notesScaleTablesHTML = notesScaleTablesHTML.concat("</div>");
  return notesScaleTablesHTML;
}

function getChordsTable(scaleValues, scaleNotesValues, nbNotesInChords)
{
  var chordValuesArray = [];
  var chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;

  var chordsTableHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Chords with " + nbNotesInChords + " notes</div><div id=\"resp-table-body\">";
  scaleValues.forEach(function (noteValue, index)
  {
    var chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
    chordValuesArray.push(chordValues);
  });
  
  // chords
  chordsTableHTML = chordsTableHTML.concat("<div class=\"resp-table-row\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    var noteValue = scaleNotesValues[index];
    var noteName = notesDict[noteValue];

    var chordName = getKeyFromValue(chordsDict, chordValues);
    var chordNoteName = getNoteNameChord(noteName, chordName);

    chordsTableHTML = chordsTableHTML.concat("<div class=\"table-body-cell\">");
    chordsTableHTML = chordsTableHTML.concat(chordNoteName);
    chordsTableHTML = chordsTableHTML.concat("</div>");
  });
  chordsTableHTML = chordsTableHTML.concat("</div>");

  // roman chord representation
  chordsTableHTML = chordsTableHTML.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
  chordValuesArray.forEach(function (chordValues, index)
  {
    var chordName = getKeyFromValue(chordsDict, chordValues);
    var romanChord = getRomanChord(index, chordName, nbNotesInChords);

    chordsTableHTML = chordsTableHTML.concat("<div class=\"table-body-cell\">");
    chordsTableHTML = chordsTableHTML.concat(romanChord);
    chordsTableHTML = chordsTableHTML.concat("</div>");
  });
  chordsTableHTML = chordsTableHTML.concat("</div>");
  
  // chords notes
  chordsTableHTML = chordsTableHTML.concat("<div class=\"resp-table-row\">");
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

    chordsTableHTML = chordsTableHTML.concat("<div class=\"table-body-cell\">");
    chordsTableHTML = chordsTableHTML.concat(chordNotesStr);
    chordsTableHTML = chordsTableHTML.concat("</div>");
  });
  chordsTableHTML = chordsTableHTML.concat("</div>");

  // chords intervals
  chordsTableHTML = chordsTableHTML.concat("<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">");
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

    chordsTableHTML = chordsTableHTML.concat("<div class=\"table-body-cell\">");
    chordsTableHTML = chordsTableHTML.concat(chordIntervalsStr);
    chordsTableHTML = chordsTableHTML.concat("</div>");
  });
  chordsTableHTML = chordsTableHTML.concat("</div>");

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
////////////////////////////// SELECTORS FUNCTIONS ////////////////////////////

// get selected note
function getSelectedNoteValue()
{
  const noteSelected = document.getElementById("note").value;
  return parseInt(noteSelected);
}

// get selected scale and mode notes values
function getSelectedScaleValues()
{
  scaleSelected = document.getElementById("scale").value;
  const scaleAttributes = scaleSelected.split(",");
  const scaleName = scaleAttributes[0];
  const modeValue = parseInt(scaleAttributes[1]);
  const scaleFamily = scaleFamiliesDict[scaleName];
  
  return getModeNotesValues(scaleFamily, modeValue);
}

// get selected scale and mode characteristic interval(s)
function getSelectedScaleCharIntervals()
{
  scaleSelected = document.getElementById("scale").value;
  let refScaleAttributes = scaleSelected.split(",");

  // no characterisitic notes
  if (refScaleAttributes.length < 3)
    return "";
  
  // parse reference scale attribute
  const diffString = refScaleAttributes[2];
  const diffAttributes = scaleSelected.split(":");
  if (diffAttributes.length < 2)
    return "";
  const refScaleString = diffAttributes[1];
  refScaleAttributes = refScaleString.split(";");
  const refScaleName = refScaleAttributes[0];
  const refModeValue = parseInt(refScaleAttributes[1]);
  const refScaleFamily = scaleFamiliesDict[refScaleName];
  
  // get selected and reference scale values
  const refScaleValues = getModeNotesValues(refScaleFamily, refModeValue);
  const scaleValues = getSelectedScaleValues();
  
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
  let scaleNotesValues = [];

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
  let modeNotesValues = [];

  const nbNotes = scaleValues.length;
  for (i = 0; i < nbNotes; i++)
  {
    const index = (i + (modeNumber - 1)) % nbNotes;
    const noteValue = scaleValues[index];
    modeNotesValues.push(noteValue);
  }

  const firstInterval = scaleValues[modeNumber - 1];
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

  const exactInterval = getKeyFromValue(intervalsDict, index.toString());
  let res = index.toString();

  // exact interval: nop
  if (intervalValue == exactInterval)
  {
    return intervalsDict[intervalValue];
  }
  // ♭'s
  else if (intervalValue < exactInterval)
  {
    for (let i = 0; i < exactInterval - intervalValue; i++)
    {
      res = "♭" + res;
    }
    return res;
  }
  // #'s
  else if (intervalValue > exactInterval)
  {
    for (let i = 0; i < intervalValue - exactInterval; i++)
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

  const index =  getIndexFromInterval(intervalName);
  const indexAlt =  getIndexFromInterval(intervalNameAlt);

  if (index <= indexAlt)
    return intervalName + " / " + intervalNameAlt;
  else
    return intervalNameAlt + " / " + intervalName;
}

function getIndexFromInterval(intervalName)
{
  const indexString = intervalName.replace(/♭/gi, "").replace(/#/gi, "");
  return parseInt(indexString);
}


//////////////////////////////// CHORDS FUNCTIONS /////////////////////////////


// get chord position given scale values and number of notes
function getChordNumberInScale(scaleValues, pos, nbNotes)
{
  let chordValues = [];

  let posCur = pos;
  const nbNotesInScale = scaleValues.length;
  let firstNoteValue = -1;
  for (i = 0; i < nbNotes; i++)
  {
    const value = scaleValues[posCur];
    if (i == 0)
      firstNoteValue = value;

    const finalValue = (value - firstNoteValue + 12) % 12;
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
  let romanPos = romanDigits[pos + 1];
  
  // write minor chords in lower case
  const chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
  const chordValues = chordsDict[chordName];
  let isMinorChord = false;
  if (chordValues != null && chordValues.length > 1)
  {
    isMinorChord = (chordValues[1] == 3);
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

// get scale inner steps values
function getScaleSteps(scaleValues)
{
  if (scaleValues == null)
    return null;

  if (scaleValues.length < 2)
    return scaleValues;

  let stepsValues = [];
  let nbNotes = scaleValues.length;
  for (let i = 0; i < nbNotes - 1; i++)
  {
    let stepValue = scaleValues[i+1] - scaleValues[i];
    stepsValues.push(stepValue);
  }

  stepsValues.push(scaleValues[0] + 12 - scaleValues[nbNotes - 1]); // last step with octave

  return stepsValues;
}

// get scale inner step notation
function getStepNotation(stepValue)
{
  const nbTones = Math.floor(stepValue / 2);
  let nbTonesString = nbTones.toString();
  if (stepValue == 1)
    nbTonesString = "";

  return ((stepValue % 2 == 0) ? nbTonesString : nbTonesString + "½");
}

/////////////////////////////// HTML FUNCTIONS ////////////////////////////////

function getScaleNotesTable(noteValue, scaleValues, charIntervals)
{
  const nbNotesInScale = scaleValues.length;

  // build scale notes list
  let notesScaleTablesHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes&nbsp;<button onclick=\"onPlayScale()\">" + getString("play") + " ♪</button></div><div id=\"resp-table-body\">";
  let notesScaleRowHTML = "<div class=\"resp-table-row\">";
  const scaleNotesValues = getScaleNotesValues(noteValue, scaleValues);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    // highlight if characteristic note
    let classString = "table-body-cell-interactive";
    if (index == 0)
      classString = "table-body-cell-tonic-interactive";
    else if (charIntervals != null && charIntervals.includes(index))
      classString = "table-body-cell-char-interactive";

    const callbackString = "onPlayNoteInScale(" + index + ")";

    noteName = getNoteName(noteValue);
    notesScaleRowHTML += "<div class=" + classString + " onclick=" + callbackString + ">";
    notesScaleRowHTML += noteName.toString();
    notesScaleRowHTML += "</div>";
  });
  notesScaleRowHTML += "</div>";

  // build intervals list
  let intervalsScaleRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  scaleValues.forEach(function (intervalValue, index)
  {
    intervalName = intervalsDict[intervalValue];
    const intervalNameAlt = getAltIntervalNotation(intervalValue, index);

    // highlight if characteristic interval
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (charIntervals != null && charIntervals.includes(index))
      classString = "table-body-cell-char";

    // display alternate notation if 7-notes cale
    const intervalString = (nbNotesInScale == 7) ?
      getIntervalString(intervalName, intervalNameAlt) : intervalName;

    intervalsScaleRowHTML += "<div class=" + classString + ">";
    intervalsScaleRowHTML += intervalString;
    intervalsScaleRowHTML += "</div>";
  });
  intervalsScaleRowHTML += "</div>";

  // build steps list
  const stepsScaleValues = getScaleSteps(scaleValues);
  let stepsScaleRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;\">";
  stepsScaleValues.forEach(function (stepValue, index)
  {
    const stepNotation = getStepNotation(stepValue);

    // highlight semi-tones and big steps
    let classString = "table-body-cell";
    if (stepValue == 1)
       classString = "table-body-cell-step-1";
    else if (stepValue == 3)
       classString = "table-body-cell-step-3";
    else if (stepValue >= 4)
       classString = "table-body-cell-step-4";

    stepsScaleRowHTML += "<div class=" + classString + ">";
    stepsScaleRowHTML += stepNotation;
    stepsScaleRowHTML += "</div>";
  });
  stepsScaleRowHTML += "</div>";

  notesScaleTablesHTML += notesScaleRowHTML;
  notesScaleTablesHTML += intervalsScaleRowHTML;
  notesScaleTablesHTML += stepsScaleRowHTML;
  notesScaleTablesHTML += "</div>";

  return notesScaleTablesHTML;
}

function getChordsTable(scaleValues, scaleNotesValues, nbNotesInChords)
{
  let chordValuesArray = [];
  const chordsDict = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;

  let chordsTableHTML = "<div id=\"resp-table\"><div id=\"resp-table-caption\">" + getString("chords_" + nbNotesInChords + "_notes") + "&nbsp;<button onclick=\"onPlayChords(" + nbNotesInChords + ")\">" + getString("play") + " ♪</button></div><div id=\"resp-table-body\">";
  scaleValues.forEach(function (noteValue, index)
  {
    const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords);
    chordValuesArray.push(chordValues);
  });
  
  // chords
  let chordsRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const noteValue = scaleNotesValues[index];
    const noteName = getNoteName(noteValue);

    const chordName = getKeyFromValue(chordsDict, chordValues);
    const chordNoteName = getNoteNameChord(noteName, chordName);

    const callbackString = "onPlayChordInScale(" + nbNotesInChords + "," + index + ")";

    chordsRowHTML += "<div class=\"table-body-cell-interactive\" onclick=" + callbackString + ">";
    chordsRowHTML += chordNoteName;
    chordsRowHTML += "</div>";
  });
  chordsRowHTML += "</div>";

  // roman chord representation
  let chordsRomanRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const chordName = getKeyFromValue(chordsDict, chordValues);
    const romanChord = getRomanChord(index, chordName, nbNotesInChords);

    chordsRomanRowHTML += "<div class=\"table-body-cell\">";
    chordsRomanRowHTML += romanChord;
    chordsRomanRowHTML += "</div>";
  });
  chordsRomanRowHTML += "</div>";
  
  // chords notes
  let chordsNotesRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const noteFondamental = scaleNotesValues[index];

    let chordNotesStr = "";
    chordValues.forEach(function (intervalValue)
    {
      const newNoteValue = addToNoteValue(noteFondamental, intervalValue);
      const noteName = getNoteName(newNoteValue);
      chordNotesStr += noteName + ",&nbsp;";
    });
    chordNotesStr = chordNotesStr.slice(0, -7);

    const callbackString = "onPlayChordInScale(" + nbNotesInChords + "," + index + ",0.25)";

    chordsNotesRowHTML += "<div class=\"table-body-cell-interactive\" onclick=" + callbackString + ">";
    chordsNotesRowHTML += chordNotesStr;
    chordsNotesRowHTML += "</div>";
  });
  chordsNotesRowHTML += "</div>";

  // chords intervals
  let chordsIntervalsRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    let chordIntervalsStr = "";
    chordValues.forEach(function (intervalValue)
    {
      let intervalName = intervalsDict[intervalValue];
      if (intervalName == "T")
        intervalName = "F"; // fondamental

      chordIntervalsStr += intervalName + ",&nbsp;";
    });
    chordIntervalsStr = chordIntervalsStr.slice(0, -7);

    chordsIntervalsRowHTML += "<div class=\"table-body-cell\">";
    chordsIntervalsRowHTML += chordIntervalsStr;
    chordsIntervalsRowHTML += "</div>";
  });
  chordsIntervalsRowHTML += "</div>";

  chordsTableHTML += chordsRowHTML;
  chordsTableHTML += chordsRomanRowHTML;
  chordsTableHTML += chordsNotesRowHTML;
  chordsTableHTML += chordsIntervalsRowHTML;
  chordsTableHTML += "</div>";

  return chordsTableHTML;
}

/////////////////////////////// GENERIC FUNCTIONS /////////////////////////////

function getKeyFromValue(dict, value)
{
  if (dict == null)
    return null;

    for(const key in dict)
    {
      const valueCur = dict[key];
      if (arraysEqual(valueCur, value))
        return key;
    }
    return "?";
}
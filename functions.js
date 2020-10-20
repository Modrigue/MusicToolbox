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

  //alert(scaleNotesValues);
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
    //alert(index + " " + noteValue);
    modeNotesValues.push(noteValue);
  }

  var firstInterval = scaleValues[modeNumber - 1];
  for (i = 0; i < nbNotes; i++)
  {
    modeNotesValues[i] = (modeNotesValues[i] - firstInterval + 12) % 12;
  } 

  //alert(modeNotesValues);
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
function getRomanChord(pos, chordName)
{
  var romanPos = romanDigits[pos + 1];
  
  // write minor chords in lower case
  var chordValues = chords3Dict[chordName];
  //if (chordName.startsWith("m") || chordName.includes("°"))
  var isMinorChord = (chordValues[1] == 3);
  if (isMinorChord)
    romanPos = romanPos.toLowerCase();

  // do not display 3-notes minor and major chord notation
  if (chordName == "m" || chordName == "M")
    romanPos = romanPos;
  else
    romanPos += chordName;

  return romanPos;
}


/////////////////////////////// GENERIC FUNCTIONS /////////////////////////////

function getKeyFromValue(dict, value)
{
  if (dict == null)
    return null;

    for(var key in dict)
    {
      var valueCur = dict[key];
      //alert(valueCur + value);
      if (arraysEqual(valueCur, value))
        return key;
    }
    return "?";
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
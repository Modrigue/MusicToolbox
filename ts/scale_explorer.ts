////////////////////////////// SELECTORS FUNCTIONS ////////////////////////////

// get selected note
function getSelectedNoteValue(id = "note"): number
{
  const noteSelected: string = (<HTMLSelectElement>document.getElementById(id)).value;
  return /*parseInt*/parseFloat(noteSelected);
}

// get selected scale and mode notes values
function getScaleValues(scaleId: string = ""): Array<number>
{
  if (!scaleId || scaleId == "")
    scaleId = (<HTMLSelectElement>document.getElementById("scale")).value;
  
  const scaleAttributes: Array<string> = scaleId.split(",");
  const scaleName: string = scaleAttributes[0];
  const modeValue: number = parseInt(scaleAttributes[1]);
  const scaleFamily: Array<number> = <Array<number>>scaleFamiliesDict.get(scaleName);
  
  return getModeNotesValues(scaleFamily, modeValue);
}

// get scale characteristic interval(s)
function getScaleCharIntervals(scaleId: string = ""): Array<number>
{
  // if no scale specified, get selected scale
  if (scaleId == null || scaleId == "")
    scaleId = (<HTMLSelectElement>document.getElementById("scale")).value;
  
  let refScaleAttributes: Array<string> = scaleId.split(",");

  // no characterisitic notes
  if (refScaleAttributes.length < 3)
    return new Array<number>();
  
  // parse reference scale attribute
  const diffString: string = refScaleAttributes[2];
  const diffAttributes: Array<string> = scaleId.split(":");
  if (diffAttributes.length < 2)
    return new Array<number>();
  const refScaleString: string = diffAttributes[1];
  refScaleAttributes = refScaleString.split(";");
  const refScaleName: string = refScaleAttributes[0];
  const refModeValue: number = parseInt(refScaleAttributes[1]);
  const refScaleFamily: Array<number> = <Array<number>>scaleFamiliesDict.get(refScaleName);
  
  // get reference scale values
  const refScaleValues: Array<number> = getModeNotesValues(refScaleFamily, refModeValue);
  const scaleValues: Array<number> = getScaleValues(scaleId);
  
  // compute differences between selected and reference scale values
  return arraysDiff(scaleValues, refScaleValues);
}

function getScaleCharValuesFromNotes(scaleId: string, scaleNotesValues: Array<number>): Array<number>
{
  const charNotesValues = new Array<number>();
  const charIntervals = getScaleCharIntervals(scaleId);
  for (const index of charIntervals)
  {
      const charNoteValue = scaleNotesValues[index];
      charNotesValues.push(charNoteValue);
  }

  return charNotesValues;
}


//////////////////////////////// NOTES FUNCTIONS //////////////////////////////

// get mode notes values given scale and mode number
function getModeNotesValues(scaleValues: Array<number>, modeNumber: number): Array<number>
{
  // no mode post-process if no octave
  if (!isOctaveScale(scaleValues) && modeNumber == 1)
    return scaleValues;

  let modeNotesValues: Array<number> = new Array<number>();

  const nbNotes = scaleValues.length;
  for (let i: number = 0; i < nbNotes; i++)
  {
    const index = (i + (modeNumber - 1)) % nbNotes;
    const noteValue = scaleValues[index];
    modeNotesValues.push(noteValue);
  }

  const firstInterval = scaleValues[modeNumber - 1];
  for (let i: number = 0; i < nbNotes; i++)
  {
      modeNotesValues[i] = (modeNotesValues[i] - firstInterval + 12) % 12;
  } 

  return modeNotesValues;
}


//////////////////////////////// CHORDS FUNCTIONS /////////////////////////////


// get chord position given scale values and number of notes
function getChordNumberInScale(scaleValues: Array<number>,
  pos: number, nbNotes: number, step: number = 2): Array<number>
{
  let chordValues: Array<number> = new Array<number>();

  let posCur: number = pos;
  const nbNotesInScale: number = scaleValues.length;
  let firstNoteValue: number = -1;
  for (let i = 0; i < nbNotes; i++)
  {
    const value: number = scaleValues[posCur];
    if (i == 0)
      firstNoteValue = value;

    const finalValue: number = (value - firstNoteValue + 12) % 12;
    chordValues.push(finalValue);

    posCur = (posCur + step) % nbNotesInScale;
  }

  return chordValues;
}

// get roman representation of chord position
function getRomanChord(pos: number, chordId: string, nbNotesInChords: number, scaleValues: Array<number>): string
{
  let romanPos: string = <string>romanDigits.get(pos + 1);
  
  // write minor chords in lower case
  const chordsDict: Map<string, Array<number>> = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;
  const chordValues: Array<number> = <Array<number>>chordsDict.get(chordId);
  let isMinorChord = false;
  if (chordValues != null && chordValues.length > 1)
  {
    isMinorChord = (chordValues[1] == 3);
    if (isMinorChord)
      romanPos = romanPos.toLowerCase();
  }

  // do not display 3-notes minor and major chord notation
  if (chordId == "m" || chordId == "M")
    romanPos = romanPos;
  else if (isMinorChord && chordId.startsWith('m'))
    //romanPos += chordId.substring(1);
    romanPos = getCompactChordNotation(romanPos, chordId.substring(1));
  else
    romanPos = getCompactChordNotation(romanPos, chordId);

  // add prefix if existing
  const nbNotesInScale = scaleValues.length;
  const intervalValue = scaleValues[pos];
  const intervalName: string = <string>intervalsDict.get(intervalValue);
  const intervalNameAlt: string = getAltIntervalNotation(intervalValue, pos);
  const interval = (nbNotesInScale == 7) ? intervalNameAlt : intervalName;
  const prefix = interval.replace(/[0-9T]/g, '');
  romanPos = prefix + romanPos;

  return romanPos;
}

// get scale inner steps values
function getScaleSteps(scaleValues: Array<number>, scaleHasOctave: boolean = true): Array<number>
{
  if (scaleValues == null)
    return new Array<number>();

  if (scaleValues.length < 2)
    return scaleValues;

  let stepsValues: Array<number> = new Array<number>();
  let nbNotes: number = scaleValues.length;
  for (let i = 0; i < nbNotes - 1; i++)
  {
    let stepValue: number = scaleValues[i+1] - scaleValues[i];
    stepsValues.push(stepValue);
  }

  if (scaleHasOctave)
  {
    // last step with octave
    stepsValues.push(scaleValues[0] + 12 - scaleValues[nbNotes - 1]);
  }
  else
    stepsValues.push(stepsValues[0]);

  return stepsValues;
}

// get scale inner step notation
function getStepNotation(stepValue: number): string
{
  if (isXenharmonicInterval(stepValue))
    return stepValue.toFixed(2);
  
  const nbTones: number = Math.floor(stepValue / 2);
  let nbTonesString: string = nbTones.toString();
  if (stepValue < 2)
    nbTonesString = "";

  let fractionString = "";
  if (stepValue % 2 == 1/2)
    fractionString = "¼";
  else if (stepValue % 2 == 3/2)
    fractionString = "¾";
  else if (stepValue % 2 == 1)
    fractionString = "½";

  return (nbTonesString + fractionString);
}

/////////////////////////////// HTML FUNCTIONS ////////////////////////////////

function getScaleNotesTableHTML(noteValue: number, scaleValues: Array<number>,
  charIntervals: Array<number>, scaleName: string): string
{
  const nbNotesInScale = scaleValues.length;
  const scaleHasOctave = isOctaveScale(scaleValues);

  let scaleValuesToDisplay: Array<number> = cloneIntegerArray(scaleValues);
  if (!scaleHasOctave)
    scaleValuesToDisplay.unshift(0);

  // create listen with bass button
  let buttonListen: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
  let playScaleCallback = "onPlayScale";
  if (scaleHasOctave)
    playScaleCallback += "WithBass";
  buttonListen.innerText = `${getString("listen")} ♪`;
  buttonListen.setAttribute("onClick", `${playScaleCallback}()`);
  buttonListen.disabled = !hasAudio;

  // create listen backwards with bass button
  let buttonListenBackwards: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
  let playScaleBackwardsCallback = "onPlayScaleBackwards";
  if (scaleHasOctave)
    playScaleBackwardsCallback += "WithBass";
  buttonListenBackwards.innerText = `${getString("listen_backwards")} ♪`;
  buttonListenBackwards.setAttribute("onClick", `${playScaleBackwardsCallback}()`);
  buttonListenBackwards.disabled = !hasAudio;

  // create export to scala file button
  let buttonExportScala: HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
  buttonExportScala.innerText = `${getString("export_to_scala")}`;
  buttonExportScala.setAttribute("onClick", `onExportToScala(\"${scaleName}\",\"${scaleValues.toString()}\")`);

  // build scale notes list
  let notesScaleTablesHTML = `<div id=\"resp-table\"><div id=\"resp-table-caption\">Notes ${buttonListen.outerHTML} ${buttonListenBackwards.outerHTML} ${buttonExportScala.outerHTML}</div><div id=\"resp-table-body\">`;
  let notesScaleRowHTML = "<div class=\"resp-table-row\">";
  const scaleNotesValues: Array<number> = getScaleNotesValues(noteValue, scaleValuesToDisplay);
  scaleNotesValues.forEach(function (noteValue, index)
  {
    // highlight if tonic / characteristic note
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (charIntervals != null && charIntervals.indexOf(index) >= 0)
      classString = "table-body-cell-char";
    
    //if (notesListened.indexOf(noteValue % 12) >= 0)
    //  classString += "-listened";
    //else
    if (hasAudio)
      classString += "-interactive";

    const callbackString: string = `onPlayNoteInScale(${index})`;

    const noteName: string = getNoteName(noteValue);
    notesScaleRowHTML += `<div class=${classString} onclick=${callbackString}>${noteName}</div>`;
  });
  notesScaleRowHTML += "</div>";

  // build intervals list
  let intervalsScaleRowHTML = /*html*/`<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">`;
  scaleValuesToDisplay.forEach(function (intervalValue, index)
  {
    let intervalName = "?";
    let intervalNameAlt = "?";

    if (!isXenharmonicInterval(intervalValue)) // semi or quarter-tone
    {
      intervalName = <string>intervalsDict.get(intervalValue);
      intervalNameAlt = getAltIntervalNotation(intervalValue, index);
    }
    else
    {
      // get value with cents
      intervalName = intervalValue.toFixed(2);
    }

    // highlight if tonic / characteristic interval
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (charIntervals != null && charIntervals.indexOf(index) >= 0)
      classString = "table-body-cell-char";

    // TODO: no italic if xenharmonic interval?
    
    // display alternate notation if 7-notes cale
    const intervalString = (nbNotesInScale == 7 && !isMicrotonalInterval(intervalValue) && !isXenharmonicInterval(intervalValue)) ?
      getIntervalString(intervalName, intervalNameAlt) : intervalName;

    intervalsScaleRowHTML += `<div class=${classString}>`;
    intervalsScaleRowHTML += intervalString;
    intervalsScaleRowHTML += "</div>";
  });
  intervalsScaleRowHTML += "</div>";

  // build steps list
  const stepsScaleValues = getScaleSteps(scaleValuesToDisplay, scaleHasOctave);
  let stepsScaleRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;\">";
  stepsScaleValues.forEach(function (stepValue, index)
  {
    const stepNotation = getStepNotation(stepValue);

    // highlight half/semi-tones and big steps
    let classString = "table-body-cell";
    if (!isXenharmonicInterval(stepValue))
    {
      if (stepValue <= 1.5)
        classString = "table-body-cell-step-1";
      else if (2 < stepValue && stepValue < 4)
        classString = "table-body-cell-step-3";
      else if (stepValue >= 4)
        classString = "table-body-cell-step-4";
    }

    stepsScaleRowHTML += `<div class=${classString}>${stepNotation}</div>`;
  });
  stepsScaleRowHTML += "</div>";

  notesScaleTablesHTML += notesScaleRowHTML;
  notesScaleTablesHTML += intervalsScaleRowHTML;
  notesScaleTablesHTML += stepsScaleRowHTML;
  notesScaleTablesHTML += "</div>";

  return notesScaleTablesHTML;
}

function getChordsTableHTML(scaleValues: Array<number>, scaleNotesValues: Array<number>,
  charIntervals: Array<number>, nbNotesInChords: number, showChordsDetails: boolean = true,
  step: number = 2 /* 3 for quartal harmonization */): string
{
  let chordValuesArray: Array<Array<number>> = new Array<Array<number>>();
  const chordsDict: Map<string, Array<number>> = (nbNotesInChords == 4) ? chords4Dict : chords3Dict;

  const culture = getSelectedCulture();

  // create play button
  let button = document.createElement('button');
  button.innerText = `${getString("listen")} ♪`;
  button.setAttribute("onClick", `onPlayChords(${nbNotesInChords},${step})`);
  button.disabled = !hasAudio;

  // header
  const legend: string = (step == 3) ? "chords_quartal" : "chords_N_notes";
  let chordsTableHTML = `<div id=\"resp-table\"><div id=\"resp-table-caption\">${getString(legend, nbNotesInChords.toString())} ${button.outerHTML}</div><div id=\"resp-table-body\">`;
  scaleValues.forEach(function (noteValue, index)
  {
    const chordValues = getChordNumberInScale(scaleValues, index, nbNotesInChords, step);
    chordValuesArray.push(chordValues);
  });

  // get tonic and charcteristic notes values
  const tonicValue = scaleNotesValues[0];
  const charNotesValues = new Array<number>();
  for (const index of charIntervals)
  {
    const charNoteValue = scaleNotesValues[index];
    charNotesValues.push(charNoteValue);
  }
  
  
  // chords
  let chordsRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const noteValue = scaleNotesValues[index];
    const noteName = getNoteName(noteValue);

    const chordName = getKeyFromArrayValue(chordsDict, chordValues);
    const chordNoteName = getCompactChordNotation(noteName, chordName);
    const callbackString = `onPlayChordInScale(${nbNotesInChords},${index},${step})`;

    // highlight if tonic note
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (isChordCharacteristic(noteValue, chordValues, charNotesValues))
      classString = "table-body-cell-char";

    if (hasAudio)
      classString += "-interactive";

    chordsRowHTML += /*html*/`<div class=${classString} onclick=${callbackString}>`;
    chordsRowHTML += chordNoteName;
    chordsRowHTML += "</div>";
  });
  chordsRowHTML += "</div>";

  // degree roman chord representation
  let chordsRomanRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const chordName = getKeyFromArrayValue(chordsDict, chordValues);
    const romanChord = getRomanChord(index, chordName, nbNotesInChords, scaleValues);

    const noteValue = scaleNotesValues[index];

    // highlight if tonic degree
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";
    else if (isChordCharacteristic(noteValue, chordValues, charNotesValues))
      classString = "table-body-cell-char";

    chordsRomanRowHTML += /*html*/`<div class=${classString}>`;
    chordsRomanRowHTML += romanChord;
    chordsRomanRowHTML += "</div>";
  });
  chordsRomanRowHTML += "</div>";
  
  // arpeggios notes
  let arpeggiosNotesRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const noteFondamental = scaleNotesValues[index];
    const callbackString = `onPlayChordInScale(${nbNotesInChords},${index},${step},0.25)`;
    let classString = "table-body-cell";
    if (hasAudio)
      classString += "-interactive";

    arpeggiosNotesRowHTML += /*html*/`<div class=\"${classString}\" onclick=${callbackString}>`;
    arpeggiosNotesRowHTML += getArpeggioNotesText(noteFondamental, chordValues, tonicValue, charNotesValues);
    arpeggiosNotesRowHTML += "</div>";
  });
  arpeggiosNotesRowHTML += "</div>";

  // arpeggios intervals
  let arpeggiosIntervalsRowHTML = "<div class=\"resp-table-row\" style=\"color:gray;font-style:italic;\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    // highlight if tonic degree
    let classString = "table-body-cell";
    if (index == 0)
      classString = "table-body-cell-tonic";

    arpeggiosIntervalsRowHTML += /*html*/`<div class=${classString}>`;
    arpeggiosIntervalsRowHTML += getArpeggioIntervals(chordValues);
    arpeggiosIntervalsRowHTML += "</div>";
  });
  arpeggiosIntervalsRowHTML += "</div>";

  // chords details
  const imgMagnifier = new Image();
  imgMagnifier.src = showChordsDetails ? 'img/magnifier_16.png' : 'img/magnifier_grey_16.png';
  imgMagnifier.alt = "MAG";
  let chordsDetailsRowHTML = "<div class=\"resp-table-row\">";
  chordValuesArray.forEach(function (chordValues, index)
  {
    const chordId = getKeyFromArrayValue(chordsDict, chordValues);

    // build URL
    let url = window.location.pathname;
    const noteValue = scaleNotesValues[index];
    url += "?note=" + noteValue.toString();
    url += "&chord=" + chordId;
    url += "&lang=" + culture;
    url += "&guitar_nb_strings=" + getSelectedGuitarNbStrings("scale_explorer_guitar_nb_strings");
    url += "&guitar_tuning=" + getSelectedGuitarTuningId("scale_explorer_guitar_tuning");
    
    const callbackString = `openNewTab(\"${url}\")`;

    chordsDetailsRowHTML += showChordsDetails ?
      /*html*/`<div class=\"table-body-cell-interactive\" onclick=${callbackString}>` :
      /*html*/`<div class=\"table-body-cell\">`;
    //chordsDetailsRowHTML += "&#x1f50d";
    chordsDetailsRowHTML += imgMagnifier.outerHTML;
    chordsDetailsRowHTML += "</div>";
  });
  chordsDetailsRowHTML += "</div>";

  chordsTableHTML += chordsRowHTML;
  chordsTableHTML += chordsRomanRowHTML;
  chordsTableHTML += arpeggiosNotesRowHTML;
  chordsTableHTML += arpeggiosIntervalsRowHTML;
  chordsTableHTML += chordsDetailsRowHTML;
  chordsTableHTML += "</div>";

  return chordsTableHTML;
}

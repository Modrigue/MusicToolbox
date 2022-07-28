// intervals dictionnary
const intervalsDict :Map<number, string> = new Map<number, string>();
intervalsDict.set(0,   "T");
intervalsDict.set(0.5, "T‡");
intervalsDict.set(1,   "♭2");
intervalsDict.set(1.5, "d2");
intervalsDict.set(2,   "2");
intervalsDict.set(2.5, "‡2");
intervalsDict.set(3,   "♭3");
intervalsDict.set(3.5, "d3");
intervalsDict.set(4,   "3");
intervalsDict.set(4.5, "‡3");
intervalsDict.set(5,   "4");
intervalsDict.set(5.5, "‡4");
intervalsDict.set(6,   "♭5");
intervalsDict.set(6.5, "d5");
intervalsDict.set(7,   "5");
intervalsDict.set(7.5, "‡5");
intervalsDict.set(8,   "♭6");
intervalsDict.set(8.5, "d6");
intervalsDict.set(9,   "6");
intervalsDict.set(9.5, "‡6");
intervalsDict.set(10,  "♭7");
intervalsDict.set(10.5, "d7");
intervalsDict.set(11  , "7");
intervalsDict.set(11.5, "⧥7");

// >= 1 octave
intervalsDict.set(13  , "♭9");
intervalsDict.set(13.5, "d9");
intervalsDict.set(14  , "9");
intervalsDict.set(14.5, "‡9");
intervalsDict.set(15  , "#9");
intervalsDict.set(16.5, "d11");
intervalsDict.set(17  , "11");
intervalsDict.set(17.5, "‡11");
intervalsDict.set(18  , "#11");
intervalsDict.set(20  , "b13");
intervalsDict.set(21  , "13");
intervalsDict.set(21.5, "‡13");

function getAltIntervalNotation(intervalValue: number, index: number): string
{
  index += 1;

  // tonic: nop
  if (index == 1)
    return "T";

  const exactInterval = getIntervalKeyFromValue(index.toString());
  let res = index.toString();

  // exact interval: nop
  if (intervalValue == exactInterval)
  {
    return intervalsDict.get(intervalValue) as string;
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

function getIntervalChordNotation(intervalValue: number): string
{
  let intervalName = "";

  if (intervalsDict.has(intervalValue))
    intervalName = <string>intervalsDict.get(intervalValue);
  else
  {
    intervalName = <string>intervalsDict.get((intervalValue + 12) % 12);

    const octave = Math.floor(intervalValue / 12);
    intervalName += `(${octave}ve)`
  }

  intervalName = intervalName.replace("T", "F");
  return intervalName;
}

function getIntervalString(intervalName: string, intervalNameAlt: string): string
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

function getIndexFromInterval(intervalName: string): number
{
  const indexString = intervalName.replace(/♭/gi, "").replace(/#/gi, "");
  return parseInt(indexString);
}

function getIntervalKeyFromValue(value: string): number
{
    for (const [key, valueCur] of intervalsDict)
    {
      if (valueCur == value)
        return key;
    }

    return -1;
}

function isMicrotonalInterval(interval: number): boolean
{
    return (interval - Math.floor(interval) != 0);  
}
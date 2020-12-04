// intervals dictionnary
const intervalsDict :Map<number, string> = new Map<number, string>();
intervalsDict.set(0,  "T");
intervalsDict.set(1,  "♭2");
intervalsDict.set(2,  "2");
intervalsDict.set(3,  "♭3");
intervalsDict.set(4,  "3");
intervalsDict.set(5,  "4");
intervalsDict.set(6,  "♭5");
intervalsDict.set(7,  "5");
intervalsDict.set(8,  "♭6");
intervalsDict.set(9,  "6");
intervalsDict.set(10, "♭7");
intervalsDict.set(11, "7");

// >= 1 octave
intervalsDict.set(12, "8");
intervalsDict.set(13, "♭9");
intervalsDict.set(14, "9");
intervalsDict.set(17, "11");

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
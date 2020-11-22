// format: "?note=X&scale=Y"
function parseParameters()
{
  const paramsString = window.location.search;
  if (paramsString == null || paramsString == "")
    return null;

  const params = paramsString.slice(1).split('&');
  let paramsDict = {};
  for (let param of params)
  {
    const keyValue = param.split('=');
    const key = keyValue[0];
    const value = keyValue[1];
    paramsDict[key] = value;
  }

  return paramsDict;
}

// get note parameter
function parseNoteParameter()
{
  const paramsDict = parseParameters();

  if (paramsDict == null || !paramsDict.hasOwnProperty("note"))
    return -1;

  const note = paramsDict["note"];
  const noteValue = parseInt(note) % 12;
  
  return noteValue;
}

// get parameter by id
function parseParameterById(id)
{
  const paramsDict = parseParameters();

  if (paramsDict == null || !paramsDict.hasOwnProperty(id))
    return "";

  const value = paramsDict[id];
  return value;
}

// get culture parameter
function parseCultureParameter()
{
  const paramsDict = parseParameters();

  if (paramsDict == null || !paramsDict.hasOwnProperty("lang"))
    return "";

  const value = paramsDict["lang"];
  return value;
}

// open URL in new tab
function openNewTab(url)
{ 
    window.open(url, "_blank"); 
}
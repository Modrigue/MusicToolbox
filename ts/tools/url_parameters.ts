// format: "?note=X&scale=Y"
function parseParameters(): Map<string, string>
{
  const paramsString = window.location.search;
  if (paramsString == null || paramsString == "")
    return new Map<string, string>();

  const params = paramsString.slice(1).split('&');
  let paramsDict: Map<string, string> = new Map<string, string>();
  for (let param of params)
  {
    const keyValue: Array<string> = param.split('=');
    const key: string = keyValue[0];
    const value: string = keyValue[1];
    paramsDict.set(key, value);
  }

  return paramsDict;
}

// get note parameter
function parseNoteParameter(): number
{
  const paramsDict: Map<string, string> = parseParameters();

  if (paramsDict == null || !paramsDict.has("note"))
    return -1;

  const note: string = <string>paramsDict.get("note");
  const noteValue: number = /*parseInt*/parseFloat(note) % 12;
  
  return noteValue;
}

// get bass parameter
function parseBassParameter(): number
{
  const paramsDict: Map<string, string> = parseParameters();

  if (paramsDict == null || !paramsDict.has("bass"))
    return -1;

  const note: string = <string>paramsDict.get("bass");
  const noteValue: number = /*parseInt*/parseFloat(note) % 12;
  
  return noteValue;
}

// get parameter by id
function parseParameterById(id: string): string
{
  const paramsDict: Map<string, string> = <Map<string, string>>parseParameters();

  if (paramsDict == null || !paramsDict.has(id))
    return "";

  const value: string = <string>paramsDict.get(id);
  return value;
}

// get culture parameter
function parseCultureParameter()
{
  const paramsDict: Map<string, string> = <Map<string, string>>parseParameters();

  if (paramsDict == null || !paramsDict.has("lang"))
    return "";

  const value = paramsDict.get("lang");
  return value;
}

// open URL in new tab
function openNewTab(url: string): void
{ 
  window.open(url, "_blank"); 
}
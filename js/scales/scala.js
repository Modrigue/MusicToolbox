"use strict";
function onExportToScala(scaleName, scaleValuesStr) {
    //console.log(scaleValuesStr);
    if (scaleValuesStr == null || scaleValuesStr == "")
        return;
    let scaleValues = scaleValuesStr.split(",");
    const nbNotesInScale = scaleValues.length;
    // build contents
    let contents = "";
    // header
    contents += `! ${scaleName}.scl\n`;
    contents += `!\n`;
    contents += `${scaleName}\n`;
    contents += ` ${nbNotesInScale}\n`;
    contents += `!\n`;
    // values in cents
    let hasOctave = false;
    for (const intervalStr of scaleValues) {
        const cents = 100 * parseFloat(intervalStr);
        if (cents == 0) {
            hasOctave = true;
            continue;
        }
        let centsStr = cents.toString();
        // ensure decimal if integer
        if (cents == Math.floor(cents))
            centsStr += ".";
        contents += ` ${centsStr}\n`;
    }
    if (hasOctave)
        contents += ` 1200.\n`;
    //console.log(contents);
    // save file directly
    var scalaFile = document.createElement("a");
    scalaFile.href = window.URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
    scalaFile.download = `${scaleName}.scl`;
    scalaFile.click();
}
//# sourceMappingURL=scala.js.map
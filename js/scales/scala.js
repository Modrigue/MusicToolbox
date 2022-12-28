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
        if (cents == 0 && !hasOctave) {
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
    // save white keys / black keys mapping aux. file when pertinent
    if (hasOctave) {
        let scalesValuesAux = [];
        let suffixAux = "";
        switch (nbNotesInScale) {
            case 5: // black keys
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[1]); // E
                    scalesValuesAux.push(scaleValues[2]); // F
                    scalesValuesAux.push(scaleValues[2]); // F#
                    scalesValuesAux.push(scaleValues[3]); // G
                    scalesValuesAux.push(scaleValues[3]); // G#
                    scalesValuesAux.push(scaleValues[4]); // A
                    scalesValuesAux.push(scaleValues[4]); // A#
                    scalesValuesAux.push(scaleValues[4]); // B
                    suffixAux = "(BK)";
                    break;
                }
            case 6: // black keys + C
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[1]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[2]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[3]); // F#
                    scalesValuesAux.push(scaleValues[4]); // G
                    scalesValuesAux.push(scaleValues[4]); // G#
                    scalesValuesAux.push(scaleValues[5]); // A
                    scalesValuesAux.push(scaleValues[5]); // A#
                    scalesValuesAux.push(scaleValues[5]); // B
                    suffixAux = "(BK + C)";
                    break;
                }
            case 7: // white keys
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[3]); // F#
                    scalesValuesAux.push(scaleValues[4]); // G
                    scalesValuesAux.push(scaleValues[4]); // G#
                    scalesValuesAux.push(scaleValues[5]); // A
                    scalesValuesAux.push(scaleValues[5]); // A#
                    scalesValuesAux.push(scaleValues[6]); // B
                    suffixAux = "(WK)";
                    break;
                }
            case 8: // white keys + G#
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[3]); // F#
                    scalesValuesAux.push(scaleValues[4]); // G
                    scalesValuesAux.push(scaleValues[5]); // G#
                    scalesValuesAux.push(scaleValues[6]); // A
                    scalesValuesAux.push(scaleValues[6]); // A#
                    scalesValuesAux.push(scaleValues[7]); // B
                    suffixAux = "(WK + G#)";
                    break;
                }
            case 9: // white keys + C#, D#
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[1]); // C#
                    scalesValuesAux.push(scaleValues[2]); // D
                    scalesValuesAux.push(scaleValues[3]); // D#
                    scalesValuesAux.push(scaleValues[4]); // E
                    scalesValuesAux.push(scaleValues[5]); // F
                    scalesValuesAux.push(scaleValues[5]); // F#
                    scalesValuesAux.push(scaleValues[6]); // G
                    scalesValuesAux.push(scaleValues[6]); // G#
                    scalesValuesAux.push(scaleValues[7]); // A
                    scalesValuesAux.push(scaleValues[7]); // A#
                    scalesValuesAux.push(scaleValues[8]); // B
                    suffixAux = "(WK + C#, D#)";
                    break;
                }
            case 10: // white keys + F#, G#, A#
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[4]); // F#
                    scalesValuesAux.push(scaleValues[5]); // G
                    scalesValuesAux.push(scaleValues[6]); // G#
                    scalesValuesAux.push(scaleValues[7]); // A
                    scalesValuesAux.push(scaleValues[8]); // A#
                    scalesValuesAux.push(scaleValues[9]); // B
                    suffixAux = "(WK + F#, G#, A#)";
                    break;
                }
            case 11: // white keys + C#, D#, F#, G#
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[1]); // C#
                    scalesValuesAux.push(scaleValues[2]); // D
                    scalesValuesAux.push(scaleValues[3]); // D#
                    scalesValuesAux.push(scaleValues[4]); // E
                    scalesValuesAux.push(scaleValues[5]); // F
                    scalesValuesAux.push(scaleValues[6]); // F#
                    scalesValuesAux.push(scaleValues[7]); // G
                    scalesValuesAux.push(scaleValues[8]); // G#
                    scalesValuesAux.push(scaleValues[9]); // A
                    scalesValuesAux.push(scaleValues[9]); // A#
                    scalesValuesAux.push(scaleValues[10]); // B
                    suffixAux = "(WK + C#, D#, F#, G#)";
                    break;
                }
            case 14: // white keys on 2 octaves
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[3]); // F#
                    scalesValuesAux.push(scaleValues[4]); // G
                    scalesValuesAux.push(scaleValues[4]); // G#
                    scalesValuesAux.push(scaleValues[5]); // A
                    scalesValuesAux.push(scaleValues[5]); // A#
                    scalesValuesAux.push(scaleValues[6]); // B
                    scalesValuesAux.push(scaleValues[7]); // C
                    scalesValuesAux.push(scaleValues[7]); // C#
                    scalesValuesAux.push(scaleValues[8]); // D
                    scalesValuesAux.push(scaleValues[8]); // D#
                    scalesValuesAux.push(scaleValues[9]); // E
                    scalesValuesAux.push(scaleValues[10]); // F
                    scalesValuesAux.push(scaleValues[10]); // F#
                    scalesValuesAux.push(scaleValues[11]); // G
                    scalesValuesAux.push(scaleValues[11]); // G#
                    scalesValuesAux.push(scaleValues[12]); // A
                    scalesValuesAux.push(scaleValues[12]); // A#
                    scalesValuesAux.push(scaleValues[13]); // B
                    suffixAux = "(WK)";
                    break;
                }
            case 16: // white keys + G# on 2 octaves
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[0]); // C#
                    scalesValuesAux.push(scaleValues[1]); // D
                    scalesValuesAux.push(scaleValues[1]); // D#
                    scalesValuesAux.push(scaleValues[2]); // E
                    scalesValuesAux.push(scaleValues[3]); // F
                    scalesValuesAux.push(scaleValues[3]); // F#
                    scalesValuesAux.push(scaleValues[4]); // G
                    scalesValuesAux.push(scaleValues[5]); // G#
                    scalesValuesAux.push(scaleValues[6]); // A
                    scalesValuesAux.push(scaleValues[6]); // A#
                    scalesValuesAux.push(scaleValues[7]); // B
                    scalesValuesAux.push(scaleValues[8]); // C
                    scalesValuesAux.push(scaleValues[8]); // C#
                    scalesValuesAux.push(scaleValues[9]); // D
                    scalesValuesAux.push(scaleValues[9]); // D#
                    scalesValuesAux.push(scaleValues[10]); // E
                    scalesValuesAux.push(scaleValues[11]); // F
                    scalesValuesAux.push(scaleValues[11]); // F#
                    scalesValuesAux.push(scaleValues[12]); // G
                    scalesValuesAux.push(scaleValues[13]); // G#
                    scalesValuesAux.push(scaleValues[14]); // A
                    scalesValuesAux.push(scaleValues[14]); // A#
                    scalesValuesAux.push(scaleValues[15]); // B
                    suffixAux = "(WK + G#)";
                    break;
                }
            case 22: // white keys + C#, D#, F#, G# on octaves
                {
                    scalesValuesAux.push(scaleValues[0]); // C
                    scalesValuesAux.push(scaleValues[1]); // C#
                    scalesValuesAux.push(scaleValues[2]); // D
                    scalesValuesAux.push(scaleValues[3]); // D#
                    scalesValuesAux.push(scaleValues[4]); // E
                    scalesValuesAux.push(scaleValues[5]); // F
                    scalesValuesAux.push(scaleValues[6]); // F#
                    scalesValuesAux.push(scaleValues[7]); // G
                    scalesValuesAux.push(scaleValues[8]); // G#
                    scalesValuesAux.push(scaleValues[9]); // A
                    scalesValuesAux.push(scaleValues[9]); // A#
                    scalesValuesAux.push(scaleValues[10]); // B
                    scalesValuesAux.push(scaleValues[11]); // C
                    scalesValuesAux.push(scaleValues[12]); // C#
                    scalesValuesAux.push(scaleValues[13]); // D
                    scalesValuesAux.push(scaleValues[14]); // D#
                    scalesValuesAux.push(scaleValues[15]); // E
                    scalesValuesAux.push(scaleValues[16]); // F
                    scalesValuesAux.push(scaleValues[17]); // F#
                    scalesValuesAux.push(scaleValues[18]); // G
                    scalesValuesAux.push(scaleValues[19]); // G#
                    scalesValuesAux.push(scaleValues[20]); // A
                    scalesValuesAux.push(scaleValues[20]); // A#
                    scalesValuesAux.push(scaleValues[21]); // B
                    suffixAux = "(WK + C#, D#, F#, G#)";
                    break;
                }
        }
        onExportToScala(scaleName + " " + suffixAux, scalesValuesAux.toString());
    }
}
//# sourceMappingURL=scala.js.map
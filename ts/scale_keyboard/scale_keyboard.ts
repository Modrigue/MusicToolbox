function getPositionFromInputKey(e: KeyboardEvent, nbNotesInScale: number): number
{
    let position = -999;
    switch (e.code)
    {
        // 1st row
        case "IntlBackslash":
            position = 0;
            break;
        case "KeyZ":
            position = 1;
            break;
        case "KeyX":
            position = 2;
            break;
        case "KeyC":
            position = 3;
            break;
        case "KeyV":
            position = 4;
            break;
        case "KeyB":
            position = 5;
            break;
        case "KeyN":
            position = 6;
            break;
        case "KeyM":
            position = 7;
            break;
        case "Comma":
            position = 8;
            break;
        case "Period":
            position = 9;
            break;
        case "Slash":
            position = 10;
            break;

        // 2nd row
        case "KeyA":
            position = 11;
            break;
        case "KeyS":
            position = 12;
            break;
        case "KeyD":
            position = 13;
            break;
        case "KeyF":
            position = 14;
            break;
        case "KeyG":
            position = 15;
            break;
        case "KeyH":
            position = 16;
            break;
        case "KeyJ":
            position = 17;
            break;
        case "KeyK":
            position = 18;
            break;
        case "KeyL":
            position = 19;
            break;
        case "Semicolon":
            position = 20;
            break;
        case "Quote":
            position = 21;
            break;
        case "Backslash":
            position = 22;
            break;      

        // 3rd row
        case "KeyQ":
            position = 23;
            break;
        case "KeyW":
            position = 24;
            break;
        case "KeyE":
            position = 25;
            break;
        case "KeyR":
            position = 26;
            break;
        case "KeyT":
            position = 27;
            break;
        case "KeyY":
            position = 28;
            break;
        case "KeyU":
            position = 29;
            break;
        case "KeyI":
            position = 30;
            break;
        case "KeyO":
            position = 31;
            break;
        case "KeyP":
            position = 32;
            break;
        case "BracketLeft":
            position = 33;
            break;
        case "BracketRight":
            position = 34;
            break;
    
        // 4th row
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
            for (let i = 1; i <= 9; i++)
            {
                if (e.code == `Digit${i}`)
                {
                    position = 34 + i;
                    break;
                }
            }
            break;
        case "Digit0":
            position = 44;
            break;
        case "Minus":
            position = 45;
            break;
        case "Equal":
            position = 46;
            break;
    }

    return position;
}
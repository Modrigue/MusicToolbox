"use strict";
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
function arraysDiff(a, b) {
    let diffArray = new Array();
    if (a == null && b != null)
        return b;
    if (a != null && b == null)
        return a;
    if (a.length == b.length) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                diffArray.push(i);
        }
    }
    else {
        // different lengths
        let A = a;
        let B = b;
        if (a.length < b.length) {
            // ensure A is the biggest array
            A = b;
            B = a;
        }
        // find A elements non included in B
        for (let i = 0; i < A.length; i++) {
            if (B.indexOf(A[i]) < 0)
                diffArray.push(i);
        }
    }
    return diffArray;
}
function getArrayItemIndex(array, value) {
    if (array == null)
        return -1;
    const length = array.length;
    for (let i = 0; i < length; i++)
        if (array[i] === value)
            return i;
    return -1;
}
function getArrayArrayItemIndex(arrayOfArrays, arrayValue) {
    if (arrayOfArrays == null)
        return -1;
    const length = arrayOfArrays.length;
    for (let i = 0; i < length; i++)
        if (arraysDiff(arrayOfArrays[i], arrayValue).length == 0)
            return i;
    return -1;
}
function arrayRemoveValue(array, value) {
    if (array == null || array.length == 0)
        return array;
    return array.filter(function (element) { return element != value; });
}
function arrayArrayFilterWithItemLength(array, lengthMin) {
    for (let j = array.length - 1; j >= 0; j--) {
        if (array[j].length < lengthMin)
            array.splice(j, 1);
    }
}
function cloneArrayArrayWithItemLength(array, length) {
    let arrayCloned = new Array();
    for (let item of array) {
        if (item.length == length)
            arrayCloned.push(item);
    }
    return arrayCloned;
}
function cloneIntegerArray(array) {
    //if (array == null || array.length == 0)
    //  return []; 
    let arrayCloned = [];
    for (let value of array)
        arrayCloned.push(value);
    return arrayCloned;
}
function getArrayIntersection(array1, array2) {
    if (array1 == null || array1.length == 0)
        return [];
    if (array2 == null || array2.length == 0)
        return [];
    let arrayInter = [];
    for (let item1 of array1)
        if (array2.indexOf(item1) >= 0)
            arrayInter.push(item1);
    return arrayInter;
}
function getKeyFromArrayValue(dict, value) {
    if (dict == null)
        return "?";
    for (const [key, valueCur] of dict) {
        if (arraysEqual(valueCur, value))
            return key;
    }
    // not found
    return "?";
}
//# sourceMappingURL=array_tools.js.map
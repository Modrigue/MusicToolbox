function arraysEqual<T>(a: Array<T>, b: Array<T>): boolean {
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

function arraysDiff(a: Array<number>, b: Array<number>): Array<number> {
  let diffArray: Array<number> = new Array<number>();

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

function getArrayItemIndex<T>(array: Array<T>, value: T): number {
  if (array == null)
    return -1;

  const length = array.length;
  for (let i = 0; i < length; i++)
    if (array[i] === value)
      return i;

  return -1;
}

function getArrayArrayItemIndex(arrayOfArrays: Array<Array<number>>, arrayValue: Array<number>): number {
  if (arrayOfArrays == null)
    return -1;

  const length: number = arrayOfArrays.length;
  for (let i = 0; i < length; i++)
    if (arraysDiff(arrayOfArrays[i], arrayValue).length == 0)
      return i;

  return -1;
}


function arrayRemoveValue<T>(array: Array<T>, value: T): Array<T> {
  if (array == null || array.length == 0)
    return array;

  return array.filter(function (element) { return element != value; });
}

function arrayArrayFilterWithItemLength<T>(array: Array<Array<T>>, lengthMin: number): void {
  for (let j = array.length - 1; j >= 0; j--) {
    if (array[j].length < lengthMin)
      array.splice(j, 1);
  }
}

function cloneArrayArrayWithItemLength<T>(array: Array<Array<T>>, length: number): Array<Array<T>> {
  let arrayCloned: Array<Array<T>> = new Array<Array<T>>();
  for (let item of array) {
    if (item.length == length)
      arrayCloned.push(item)
        ;
  }

  return arrayCloned;
}

function cloneIntegerArray(array: Array<number>): Array<number> {
  //if (array == null || array.length == 0)
  //  return []; 

  let arrayCloned: Array<number> = [];

  for (let value of array)
    arrayCloned.push(value);

  return arrayCloned;
}

function getArrayIntersection<T>(array1: Array<T>, array2: Array<T>): Array<T> {
  if (array1 == null || array1.length == 0)
    return [];
  if (array2 == null || array2.length == 0)
    return [];

  let arrayInter: Array<T> = [];

  for (let item1 of array1)
    if (array2.indexOf(item1) >= 0)
      arrayInter.push(item1);

  return arrayInter;
}

function getKeyFromArrayValue(dict: Map<string, Array<number>>, value: Array<number>): string {
  if (dict == null)
    return "?";

  for (const [key, valueCur] of dict) {
    if (arraysEqual(valueCur, value))
      return key;
  }

  // not found
  return "?";
}

function containsArray<T>(twoDArray: Array<Array<T>>, candidate: Array<T>): boolean {
  if (twoDArray == null)
    return false;

  if (twoDArray.length == 0)
    return false;

  for (const array of twoDArray) {
    if (arraysEqual(array, candidate))
      return true;
  }

  return false;
}

// from: https://bobbyhadz.com/blog/javascript-check-if-array-contains-duplicates
function containsDuplicates<T>(array: Array<T>): boolean {
  if (array.length !== new Set(array).size)
    return true;

  return false;
}
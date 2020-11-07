function arraysEqual(a, b)
{
  if (a === b)
    return true;
  if (a == null || b == null)
    return false;
  if (a.length !== b.length)
    return false;

  for (let i = 0; i < a.length; ++i)
  {
    if (a[i] !== b[i])
      return false;
  }

  return true;
}

function arraysDiff(a, b)
{
  let diffArray = [];

  if (a == null && b != null)
    return b;
  if (a != null && b == null)
    return a;

  if (a.length == b.length)
  {
    for (let i = 0; i < a.length; i++)
    {
      if (a[i] !== b[i])
        diffArray.push(i);
    }
  }
  else
  {
    // different lengths
    let A = a;
    let B = b;
    if (a.length < b.length)
    {
      // ensure A is the biggest array
      A = b;
      B = a;
    }
    
    // find A elements non included in B
    for (let i = 0; i < A.length; i++)
    {
      if (!B.includes(A[i]))
        diffArray.push(i);
    }
  }

  return diffArray;
}
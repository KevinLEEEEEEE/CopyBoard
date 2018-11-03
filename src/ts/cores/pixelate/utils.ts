const isArrayEqual = (array1: any[], array2: any[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0, j = array1.length; i < j; i += 1) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!array1[i].equals(array2[i])) {
        return false;
      }
    }

    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

const computeArrayAverage = (array: number[]): number[] => {
  const combinedArray = array.reduce((prev, current) => {
    return prev.map((prevValue, index) => prevValue + current[index]);
  }, [0, 0, 0]);

  const averageArray = combinedArray.map((data) => data / array.length);

  return averageArray;
};

export {
  isArrayEqual,
  computeArrayAverage,
};

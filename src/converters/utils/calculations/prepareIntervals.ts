export const prepareIntervals = (numbers: number[]): [number, number][] => {
  return numbers.length > 0
    ? numbers
        .slice()
        .concat(Infinity)
        .sort((a, b) => a - b)
        .map((point, index, arr) => {
          if (index === 0) {
            return [0, point];
          }
          return [arr[index - 1], point];
        })
    : [];
};

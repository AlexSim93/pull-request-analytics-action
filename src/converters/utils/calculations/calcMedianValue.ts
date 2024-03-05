export const calcMedianValue = (values?: number[]) => {
  if (!values?.length) return 0;
  const sortedValues = values.slice().sort((a, b) => a - b);
  const medianIndex = Math.floor(sortedValues.length / 2);
  if (sortedValues.length % 2 === 0) {
    return Math.floor(
      (sortedValues[medianIndex] + sortedValues[medianIndex - 1]) / 2
    );
  }
  return sortedValues[medianIndex];
};

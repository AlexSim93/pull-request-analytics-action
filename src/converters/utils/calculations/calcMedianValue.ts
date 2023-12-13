export const calcMedianValue = (values?: number[]) => {
  if (!values?.length) return 0;
  const medianIndex = Math.floor(values.length / 2);
  return values.slice().sort((a, b) => a - b)[medianIndex];
};

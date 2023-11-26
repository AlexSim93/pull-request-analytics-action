export const calcAvgValue = (values?: number[]) => {
  if (!values?.length) return 0;
  const sum = values?.reduce((acc, value) => acc + value, 0);
  return Math.ceil(sum / values.length);
};

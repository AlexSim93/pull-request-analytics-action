export const calcP80Value = (values?: number[]) => {
  if (!values?.length) return 0;
  const sortedValues = values.slice().sort((a, b) => a - b);
  const partToRid = Math.floor(sortedValues.length / 10);
  const sum = sortedValues
    .slice(partToRid, sortedValues.length - partToRid)
    ?.reduce((acc, value) => acc + value, 0);
  return Math.ceil(sum / values.length);
};

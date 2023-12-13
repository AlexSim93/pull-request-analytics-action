import { percentile } from "../../constants";

export const calcPercentileValue = (values?: number[]) => {
  if (!values?.length) return 0;
  const sortedValues = values.slice().sort((a, b) => a - b);
  const percentilePart = Math.ceil(sortedValues.length * (percentile / 100));
  const percentileValues = sortedValues.slice(0, percentilePart);
  return percentileValues[percentileValues.length - 1];
};

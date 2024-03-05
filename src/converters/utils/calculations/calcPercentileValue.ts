import { getValueAsIs } from "../../../common/utils";

export const calcPercentileValue = (values?: number[]) => {
  if (!values?.length) return 0;
  const sortedValues = values.slice().sort((a, b) => a - b);
  const percentileIndex =
    sortedValues.length * (parseInt(getValueAsIs("PERCENTILE")) / 100) - 1;
  const lowerIndex = Math.floor(percentileIndex);
  const upperIndex = lowerIndex + 1;
  const weight = percentileIndex - lowerIndex;

  return Math.floor(
    sortedValues[lowerIndex] * (1 - weight) + sortedValues[upperIndex] * weight
  );
};

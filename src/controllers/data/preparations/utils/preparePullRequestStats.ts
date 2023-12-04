import { Collection } from "../types";
import {
  calcAverageValue,
  calcMedianValue,
  calcPercentileValue,
} from "./calculations";

export const preparePullRequestStats = (collection: Collection) => {
  return {
    ...collection,
    median: {
      timeToReview: calcMedianValue(collection.timeToReview),
      timeToApprove: calcMedianValue(collection.timeToApprove),
      timeToMerge: calcMedianValue(collection.timeToMerge),
    },
    percentile: {
      timeToReview: calcPercentileValue(collection.timeToReview),
      timeToApprove: calcPercentileValue(collection.timeToApprove),
      timeToMerge: calcPercentileValue(collection.timeToMerge),
    },
    average: {
      timeToReview: calcAverageValue(collection.timeToReview),
      timeToApprove: calcAverageValue(collection.timeToApprove),
      timeToMerge: calcAverageValue(collection.timeToMerge),
    },
  };
};

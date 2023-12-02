import { Collection } from "../types";
import {
  calcAvgValue,
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
    avg: {
      timeToReview: calcAvgValue(collection.timeToReview),
      timeToApprove: calcAvgValue(collection.timeToApprove),
      timeToMerge: calcAvgValue(collection.timeToMerge),
    },
  };
};

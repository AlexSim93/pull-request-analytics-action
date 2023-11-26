import { Collection } from "../types";
import { calcAvgValue, calcMedianValue, calcP80Value } from "./calculations";

export const preparePullRequestStats = (collection: Collection) => {
  return {
    ...collection,
    median: {
      timeToReview: calcMedianValue(collection.timeToReview),
      timeToApprove: calcMedianValue(collection.timeToApprove),
      timeToMerge: calcMedianValue(collection.timeToMerge),
    },
    p80: {
      timeToReview: calcP80Value(collection.timeToReview),
      timeToApprove: calcP80Value(collection.timeToApprove),
      timeToMerge: calcP80Value(collection.timeToMerge),
    },
    avg: {
      timeToReview: calcAvgValue(collection.timeToReview),
      timeToApprove: calcAvgValue(collection.timeToApprove),
      timeToMerge: calcAvgValue(collection.timeToMerge),
    },
  };
};

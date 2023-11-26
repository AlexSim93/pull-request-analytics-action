import { Collection } from "../types";
import { calcAvgValue, calcMedianValue, calcP80Value } from "./calculations";

export const preparePullRequestStats = (collection: Collection) => {
  return {
    ...collection,
    timeToReviewAvg: calcAvgValue(collection.timeToReview),
    timeToApproveAvg: calcAvgValue(collection.timeToApprove),
    timeToMergeAvg: calcAvgValue(collection.timeToMerge),
    timeToReviewMedian: calcMedianValue(collection.timeToReview),
    timeToApproveMedian: calcMedianValue(collection.timeToApprove),
    timeToMergeMedian: calcMedianValue(collection.timeToMerge),
    timeToReviewP80: calcP80Value(collection.timeToReview),
    timeToApproveP80: calcP80Value(collection.timeToApprove),
    timeToMergeP80: calcP80Value(collection.timeToMerge),
  };
};

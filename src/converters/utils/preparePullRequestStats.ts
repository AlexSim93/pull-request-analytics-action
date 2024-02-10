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
      timeToReviewRequest: calcMedianValue(collection.timeToReviewRequest),
      timeInDraft: calcMedianValue(collection.timeInDraft),
    },
    percentile: {
      timeToReview: calcPercentileValue(collection.timeToReview),
      timeToApprove: calcPercentileValue(collection.timeToApprove),
      timeToMerge: calcPercentileValue(collection.timeToMerge),
      timeToReviewRequest: calcPercentileValue(collection.timeToReviewRequest),
      timeInDraft: calcPercentileValue(collection.timeInDraft),
    },
    average: {
      timeToReview: calcAverageValue(collection.timeToReview),
      timeToApprove: calcAverageValue(collection.timeToApprove),
      timeToMerge: calcAverageValue(collection.timeToMerge),
      timeToReviewRequest: calcAverageValue(collection.timeToReviewRequest),
      timeInDraft: calcAverageValue(collection.timeInDraft),
    },
  };
};

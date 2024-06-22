import { getMultipleValuesInput } from "../../common/utils";
import { Collection } from "../types";
import {
  calcAverageValue,
  calcIntervals,
  calcMedianValue,
  calcPercentileValue,
  prepareIntervals,
} from "./calculations";

export const preparePullRequestStats = (collection: Collection) => {
  const reviewIntervals = prepareIntervals(
    getMultipleValuesInput("REVIEW_TIME_INTERVALS").map((el) => parseFloat(el))
  );
  const approvalIntervals = prepareIntervals(
    getMultipleValuesInput("APPROVAL_TIME_INTERVALS").map((el) =>
      parseFloat(el)
    )
  );
  const mergeIntervals = prepareIntervals(
    getMultipleValuesInput("MERGE_TIME_INTERVALS").map((el) => parseFloat(el))
  );
  return {
    ...collection,
    reviewTimeIntervals: calcIntervals(
      collection.timeToReview?.map((el) => el / 60),
      reviewIntervals
    ),
    approvalTimeIntervals: calcIntervals(
      collection.timeToApprove?.map((el) => el / 60),
      approvalIntervals
    ),
    mergeTimeIntervals: calcIntervals(
      collection.timeToMerge?.map((el) => el / 60),
      mergeIntervals
    ),
    median: {
      timeToReview: calcMedianValue(collection.timeToReview),
      timeToApprove: calcMedianValue(collection.timeToApprove),
      timeToMerge: calcMedianValue(collection.timeToMerge),
      timeToReviewRequest: calcMedianValue(collection.timeToReviewRequest),
      timeInDraft: calcMedianValue(collection.timeInDraft),
      timeFromInitialRequestToResponse: calcMedianValue(
        collection.timeFromInitialRequestToResponse
      ),
      timeFromOpenToResponse: calcMedianValue(
        collection.timeFromOpenToResponse
      ),
      timeFromRepeatedRequestToResponse: calcMedianValue(
        collection.timeFromRepeatedRequestToResponse
      ),
    },
    percentile: {
      timeToReview: calcPercentileValue(collection.timeToReview),
      timeToApprove: calcPercentileValue(collection.timeToApprove),
      timeToMerge: calcPercentileValue(collection.timeToMerge),
      timeToReviewRequest: calcPercentileValue(collection.timeToReviewRequest),
      timeInDraft: calcPercentileValue(collection.timeInDraft),
      timeFromInitialRequestToResponse: calcPercentileValue(
        collection.timeFromInitialRequestToResponse
      ),
      timeFromOpenToResponse: calcPercentileValue(
        collection.timeFromOpenToResponse
      ),
      timeFromRepeatedRequestToResponse: calcPercentileValue(
        collection.timeFromRepeatedRequestToResponse
      ),
    },
    average: {
      timeToReview: calcAverageValue(collection.timeToReview),
      timeToApprove: calcAverageValue(collection.timeToApprove),
      timeToMerge: calcAverageValue(collection.timeToMerge),
      timeToReviewRequest: calcAverageValue(collection.timeToReviewRequest),
      timeInDraft: calcAverageValue(collection.timeInDraft),
      timeFromInitialRequestToResponse: calcAverageValue(
        collection.timeFromInitialRequestToResponse
      ),
      timeFromOpenToResponse: calcAverageValue(
        collection.timeFromOpenToResponse
      ),
      timeFromRepeatedRequestToResponse: calcAverageValue(
        collection.timeFromRepeatedRequestToResponse
      ),
    },
  };
};

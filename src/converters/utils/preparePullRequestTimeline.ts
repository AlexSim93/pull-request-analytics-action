import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";
import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { calcDraftTime, getApproveTime } from "./calculations";
import { calcDifferenceInMinutes } from "./calculations/calcDifferenceInMinutes";

export const preparePullRequestTimeline = (
  pullRequestInfo: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  pullRequestReviews: any[] = [],
  reviewRequest: any | undefined,
  statuses: any[] | undefined = [],
  collection: Collection
) => {
  const firstReview = pullRequestReviews?.find(
    (review) => review.user?.login !== pullRequestInfo?.user?.login
  );
  const approveTime = getApproveTime(pullRequestReviews);

  const timeToReviewRequest = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    reviewRequest?.created_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  const timeInDraft = calcDraftTime(
    pullRequestInfo?.created_at,
    pullRequestInfo?.closed_at,
    statuses
  ).reduce(
    (acc, period) =>
      acc +
      (calcDifferenceInMinutes(
        period[0],
        period[1],
        {
          endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
          startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
        },
        getMultipleValuesInput("HOLIDAYS")
      ) || 0),
    0
  );

  const timeToReview = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    firstReview?.submitted_at || pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  const timeToApprove = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    approveTime || pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  const timeToMerge = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  const timeToClose = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    pullRequestInfo?.closed_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  return {
    ...collection,
    timeToReview:
      typeof timeToReview === "number"
        ? [...(collection?.timeToReview || []), timeToReview]
        : collection.timeToReview,
    timeToApprove:
      typeof timeToApprove === "number"
        ? [...(collection?.timeToApprove || []), timeToApprove]
        : collection.timeToApprove,
    timeToMerge:
      typeof timeToMerge === "number"
        ? [...(collection?.timeToMerge || []), timeToMerge]
        : collection.timeToMerge,
    timeToReviewRequest:
      typeof timeToReviewRequest === "number"
        ? [...(collection?.timeToReviewRequest || []), timeToReviewRequest]
        : collection.timeToReviewRequest,
    timeInDraft:
      typeof timeInDraft === "number"
        ? [...(collection?.timeInDraft || []), timeInDraft]
        : collection.timeInDraft,
    pullRequestsInfo: [
      ...(collection?.pullRequestsInfo || []),
      {
        number: pullRequestInfo?.number,
        link: pullRequestInfo?._links?.html?.href,
        title: pullRequestInfo?.title,
        comments: pullRequestInfo?.review_comments,
        sizePoints:
          (pullRequestInfo?.additions || 0) +
          (pullRequestInfo?.deletions || 0) * 0.5,
        additions: pullRequestInfo?.additions || 0,
        deletions: pullRequestInfo?.deletions || 0,
        timeToReview: timeToReview === null ? timeToMerge || 0 : timeToReview,
        timeToApprove:
          (timeToApprove === null ? timeToMerge || 0 : timeToApprove) -
          (timeToReview === null ? timeToMerge || 0 : timeToReview),
        timeToMerge:
          (timeToMerge === null ? timeToClose || 0 : timeToMerge) -
          (timeToApprove === null ? timeToMerge || 0 : timeToApprove),
      },
    ],
  };
};

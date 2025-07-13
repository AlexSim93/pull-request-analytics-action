import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";
import { makeComplexRequest } from "../../requests";
import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import {
  calcDraftTime,
  checkUserInclusive,
  getApproveTime,
  getPullRequestSize,
} from "./calculations";
import { calcDifferenceInMinutes } from "./calculations/calcDifferenceInMinutes";
import { calcPRsize } from "./calculations/calcPRsize";

export const preparePullRequestTimeline = (
  pullRequestInfo: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  pullRequestReviews: any[] = [],
  reviewRequest: any | undefined,
  statuses: any[] | undefined = [],
  collection: Collection
) => {
  if (!checkUserInclusive(pullRequestInfo?.user?.login || invalidUserLogin)) {
    return collection;
  }
  const firstReview = pullRequestReviews?.find(
    (review) =>
      review.user?.login !== pullRequestInfo?.user?.login &&
      checkUserInclusive(review.user?.login || invalidUserLogin)
  );
  const approveTime = getApproveTime(
    pullRequestReviews,
    parseInt(getValueAsIs("REQUIRED_APPROVALS"))
  );

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
    firstReview?.submitted_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    },
    getMultipleValuesInput("HOLIDAYS")
  );

  const timeToApprove = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    approveTime,
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

  const pullRequestSize = getPullRequestSize(
    pullRequestInfo?.additions,
    pullRequestInfo?.deletions
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
    unreviewed:
      timeToReview !== null
        ? collection?.unreviewed || 0
        : (collection?.unreviewed || 0) + 1,
    unapproved:
      timeToApprove !== null
        ? collection?.unapproved || 0
        : (collection?.unapproved || 0) + 1,
    sizes: {
      ...(collection.sizes || {}),
      [pullRequestSize]: {
        ...(collection.sizes?.[pullRequestSize] || {}),
        timeToReview: timeToReview
          ? [
              ...(collection?.sizes?.[pullRequestSize]?.timeToReview || []),
              timeToReview,
            ]
          : collection?.sizes?.[pullRequestSize]?.timeToReview,
        timeToApprove: timeToApprove
          ? [
              ...(collection?.sizes?.[pullRequestSize]?.timeToApprove || []),
              timeToApprove,
            ]
          : collection?.sizes?.[pullRequestSize]?.timeToApprove,
        timeToMerge: timeToMerge
          ? [
              ...(collection?.sizes?.[pullRequestSize]?.timeToMerge || []),
              timeToMerge,
            ]
          : collection?.sizes?.[pullRequestSize]?.timeToMerge,
      },
    },
    pullRequestsInfo: [
      ...(collection?.pullRequestsInfo || []),
      {
        number: pullRequestInfo?.number,
        link: pullRequestInfo?._links?.html?.href,
        title: pullRequestInfo?.title,
        comments: pullRequestInfo?.review_comments,
        sizePoints: calcPRsize(
          pullRequestInfo?.additions,
          pullRequestInfo?.deletions
        ),
        additions: pullRequestInfo?.additions || 0,
        author: pullRequestInfo?.user?.login || invalidUserLogin,
        deletions: pullRequestInfo?.deletions || 0,
        timeToReview: timeToReview || 0,
        timeToApprove: timeToApprove ? timeToApprove - (timeToReview || 0) : 0,
        timeToMerge: timeToMerge ? timeToMerge - (timeToApprove || 0) : 0,
      },
    ],
  };
};

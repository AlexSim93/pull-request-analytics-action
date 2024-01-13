import { getValueAsIs } from "../../common/utils";
import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { getApproveTime } from "./calculations";
import { calcDifferenceInMinutes } from "./calculations/calcDifferenceInMinutes";

export const preparePullRequestTimeline = (
  pullRequestInfo: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  pullRequestReviews: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["reviews"][number],
  collection: Collection
) => {
  const firstReview = pullRequestReviews?.find(
    (review) => review.user?.login !== pullRequestInfo?.user?.login
  );
  const approveTime = getApproveTime(pullRequestReviews);

  const timeToReview = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    firstReview?.submitted_at || pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    }
  );

  const timeToApprove = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    approveTime || pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    }
  );

  const timeToMerge = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    pullRequestInfo?.merged_at,
    {
      endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
      startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
    }
  );

  return {
    ...collection,
    timeToReview: timeToReview
      ? [...(collection?.timeToReview || []), timeToReview]
      : collection.timeToReview,
    timeToApprove: timeToApprove
      ? [...(collection?.timeToApprove || []), timeToApprove]
      : collection.timeToApprove,
    timeToMerge: timeToMerge
      ? [...(collection?.timeToMerge || []), timeToMerge]
      : collection.timeToMerge,
    pullRequestsInfo: [
      ...(collection?.pullRequestsInfo || []),
      {
        number: pullRequestInfo?.number,
        link: pullRequestInfo?._links?.html?.href,
        title: pullRequestInfo?.title,
        comments: pullRequestInfo?.review_comments,
        timeToReview: timeToReview || timeToMerge || 0,
        timeToApprove:
          (timeToApprove || timeToMerge || 0) -
          (timeToReview || timeToMerge || 0),
        timeToMerge: (timeToMerge || 0) - (timeToApprove || timeToMerge || 0),
      },
    ],
  };
};

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
    (review) => review.user?.login !== pullRequestInfo?.user.login
  );
  const approveTime = getApproveTime(pullRequestReviews);

  const timeToReview = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    firstReview?.submitted_at
  );

  const timeToMerge = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    pullRequestInfo?.merged_at
  );

  const timeToApprove = calcDifferenceInMinutes(
    pullRequestInfo?.created_at,
    approveTime
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
  };
};

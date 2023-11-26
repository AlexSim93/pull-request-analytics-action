import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";

export const preparePullRequestInfo = (
  pullRequest: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  collection?: Collection
) => {
  const previousComments =
    typeof collection?.comments === "number" ? collection?.comments : 0;
  const comments = previousComments + (pullRequest?.comments || 0);

  const previousReviewComments =
    typeof collection?.reviewComments === "number"
      ? collection?.reviewComments
      : 0;

  const reviewComments =
    previousReviewComments + (pullRequest?.review_comments || 0);
  return {
    ...collection,
    opened: (collection?.opened || 0) + 1,
    closed: pullRequest?.closed_at
      ? (collection?.closed || 0) + 1
      : collection?.closed || 0,
    merged: pullRequest?.merged
      ? (collection?.merged || 0) + 1
      : collection?.merged || 0,
    comments,
    reviewComments,
    additions: (collection?.additions || 0) + (pullRequest?.additions || 0),
    deletions: (collection?.deletions || 0) + (pullRequest?.deletions || 0),
  };
};

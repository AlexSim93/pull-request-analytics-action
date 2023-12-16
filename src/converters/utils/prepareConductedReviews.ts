import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { PullRequestSize } from "./calculations/getPullRequestSize";

export const prepareConductedReviews = (
  pullRequestLogin: string,
  pullRequestReviews:
    | Awaited<ReturnType<typeof makeComplexRequest>>["reviews"][number]
    | undefined,
  collection: Collection,
  pullRequestSize: PullRequestSize
) => {
  const reviewsConducted: Collection["reviewsConducted"] = {
    ...(collection?.reviewsConducted || {}),
  };
  const statuses = Object.keys(
    pullRequestReviews?.reduce((acc, review) => {
      return { ...acc, [review.state]: 1, total: 1 };
    }, {}) || {}
  );

  [pullRequestLogin, "total"].forEach((key) => {
    const statusesReviewsStats = statuses.reduce((acc, status) => {
      return {
        ...acc,
        [status]: (reviewsConducted[key]?.[status] || 0) + 1,
      };
    }, {});
    reviewsConducted[key] = {
      ...reviewsConducted[key],
      ...statusesReviewsStats,
    };
  });

  return {
    ...collection,
    reviewsConducted,
    reviewsConductedSize: [
      ...(collection?.reviewsConductedSize || []),
      pullRequestSize,
    ],
  };
};

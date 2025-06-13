import { Collection } from "../types";
import { checkUserInclusive } from "./calculations";
import { PullRequestSize } from "./calculations/getPullRequestSize";

export const prepareConductedReviews = (
  pullRequestLogin: string,
  pullRequestReviews: any[] = [],
  collection: Collection,
  pullRequestSize: PullRequestSize,
  teams: Record<string, string[]>
) => {
  const reviewsConducted: Collection["reviewsConducted"] = {
    ...(collection?.reviewsConducted || {}),
  };
  const statuses = Object.keys(
    pullRequestReviews?.reduce((acc, review) => {
      return { ...acc, [review.state]: 1, total: 1 };
    }, {}) || {}
  );

  [pullRequestLogin, "total", ...(teams[pullRequestLogin] || [])].forEach(
    (key) => {
      if(!checkUserInclusive(key)) return;
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
    }
  );

  return {
    ...collection,
    reviewsConducted,
    reviewsConductedSize: [
      ...(collection?.reviewsConductedSize || []),
      pullRequestSize,
    ],
  };
};

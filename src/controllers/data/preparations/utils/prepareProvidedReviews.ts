import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";

export const prepareProvidedReviews = (
  pullRequestLogin: string | undefined,
  pullRequestReviews:
    | Awaited<ReturnType<typeof makeComplexRequest>>["reviews"][number]
    | undefined,
  collection: Collection
) => {
  const reviewsConducted: Collection["reviewsConducted"] = {
    ...(collection?.reviewsConducted || {}),
  };
  const statuses = Object.keys(
    pullRequestReviews?.reduce((acc, review) => {
      return { ...acc, [review.state]: 1, total: 1 };
    }, {}) || {}
  );

  if (pullRequestLogin) {
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
  }

  return {
    ...collection,
    reviewsConducted,
  };
};

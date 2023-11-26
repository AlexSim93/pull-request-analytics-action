import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";

export const prepareProvidedReviews = (
  pullRequestInfo: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  pullRequestReviews:
    | Awaited<ReturnType<typeof makeComplexRequest>>["reviews"][number]
    | undefined,
  collection: Collection
) => {
  const providedReviews: Collection["providedReviews"] = {
    ...(collection?.providedReviews || {}),
  };
  const statuses = Object.keys(
    pullRequestReviews?.reduce((acc, review) => {
      return { ...acc, [review.state]: 1, total: 1 };
    }, {}) || {}
  );

  if (pullRequestInfo?.user.login) {
    [pullRequestInfo.user.login, "total"].forEach((key) => {
      const statusesReviewsStats = statuses.reduce((acc, status) => {
        return {
          ...acc,
          [status]: (providedReviews[key]?.[status] || 0) + 1,
        };
      }, {});
      providedReviews[key] = {
        ...providedReviews[key],
        ...statusesReviewsStats,
      };
    });
  }

  return {
    ...collection,
    providedReviews,
  };
};

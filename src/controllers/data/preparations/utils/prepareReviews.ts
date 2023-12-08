import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { prepareProvidedReviews } from "./prepareProvidedReviews";

export const prepareReviews = (
  data: Awaited<ReturnType<typeof makeComplexRequest>>,
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string | undefined
) => {
  const users = Object.keys(
    data.reviews[index]?.reduce((acc, review) => {
      if (review.user?.login && review.user.login !== pullRequestLogin) {
        return { ...acc, [review.user?.login]: 1 };
      }
      return acc;
    }, {}) || {}
  ).concat("total");

  users.forEach((user) => {
    if (!collection[user]) {
      collection[user] = {};
    }
    const userReviews =
      Array.isArray(data.reviews[index]) && user !== "total"
        ? data.reviews[index]?.filter((review) => review.user?.login === user)
        : data.reviews[index];
    [dateKey, "total"].forEach((key) => {
      collection[user][key] = prepareProvidedReviews(
        pullRequestLogin,
        userReviews,
        collection[user][key]
      );
    });
  });
};

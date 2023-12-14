import { makeComplexRequest } from "../../requests";
import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { prepareConductedReviews } from "./prepareConductedReviews";

export const prepareReviews = (
  data: Awaited<ReturnType<typeof makeComplexRequest>>,
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string
) => {
  const users = Object.keys(
    data.reviews[index]?.reduce((acc, review) => {
      const userLogin = review.user?.login || invalidUserLogin;
      if (userLogin !== pullRequestLogin) {
        return { ...acc, [userLogin]: 1 };
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
        ? data.reviews[index]?.filter((review) => {
            const userLogin = review.user?.login || invalidUserLogin;
            return userLogin === user;
          })
        : data.reviews[index];
    [dateKey, "total"].forEach((key) => {
      collection[user][key] = prepareConductedReviews(
        pullRequestLogin,
        userReviews,
        collection[user][key]
      );
    });
  });
};

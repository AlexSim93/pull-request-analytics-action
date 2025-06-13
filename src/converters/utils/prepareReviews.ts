import set from "lodash/set";
import get from "lodash/get";

import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { PullRequestSize } from "./calculations/getPullRequestSize";
import { prepareConductedReviews } from "./prepareConductedReviews";
import { checkUserInclusive } from "./calculations";

export const prepareReviews = (
  reviews: any[] = [],
  collection: Record<string, Record<string, Collection>>,
  dateKey: string,
  pullRequestLogin: string,
  pullRequestSize: PullRequestSize,
  teams: Record<string, string[]>
) => {
  let teamNames: string[] = [];
  const users = Object.keys(
    reviews?.reduce((acc, review) => {
      const userLogin = review.user?.login || invalidUserLogin;
      if (userLogin !== pullRequestLogin && checkUserInclusive(userLogin)) {
        const teamsNames = (teams[userLogin] || []).reduce(
          (acc, team) => ({ ...acc, [team]: 1 }),
          {}
        );
        teamNames = Object.keys(teamsNames);
        return { ...acc, [userLogin]: 1, ...teamsNames, total: 1 };
      }
      return acc;
    }, {}) || {}
  );

  users.forEach((user) => {
    const userReviews =
      Array.isArray(reviews) && user !== "total" && !teamNames.includes(user)
        ? reviews?.filter((review) => {
            const userLogin = review.user?.login || invalidUserLogin;
            return userLogin === user && checkUserInclusive(userLogin);
          })
        : reviews?.filter((review) => {
            const userLogin = review.user?.login || invalidUserLogin;
            return checkUserInclusive(userLogin);
          });
    [dateKey, "total"].forEach((key) => {
      set(
        collection,
        [user, key],
        prepareConductedReviews(
          pullRequestLogin,
          userReviews,
          get(collection, [user, key], {}),
          pullRequestSize,
          teams
        )
      );
    });
  });
};

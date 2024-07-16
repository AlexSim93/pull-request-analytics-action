import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { PullRequestSize } from "./calculations/getPullRequestSize";
import { prepareConductedReviews } from "./prepareConductedReviews";

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
      if (userLogin !== pullRequestLogin) {
        const teamsNames = (teams[userLogin] || []).reduce(
          (acc, team) => ({ ...acc, [team]: 1 }),
          {}
        );
        teamNames = Object.keys(teamsNames);
        return { ...acc, [userLogin]: 1, ...teamsNames };
      }
      return acc;
    }, {}) || {}
  ).concat("total");

  users.forEach((user) => {
    if (!collection[user]) {
      collection[user] = {};
    }
    const userReviews =
      Array.isArray(reviews) && user !== "total" && !teamNames.includes(user)
        ? reviews?.filter((review) => {
            const userLogin = review.user?.login || invalidUserLogin;
            return userLogin === user;
          })
        : reviews;
    [dateKey, "total"].forEach((key) => {
      collection[user][key] = prepareConductedReviews(
        pullRequestLogin,
        userReviews,
        collection[user][key],
        pullRequestSize,
        teams
      );
    });
  });
};

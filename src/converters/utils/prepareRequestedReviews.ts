import { invalidUserLogin } from "../constants";
import { Collection } from "../types";

export const prepareRequestedReviews = (
  requests: any[] = [],
  collection: Record<string, Record<string, Collection>>,
  dateKey: string,
  teams: Record<string, string[]>
) => {
  const requestedReviewers = requests.reduce((acc, request) => {
    const user = request.requested_reviewer?.login || invalidUserLogin;
    return { ...acc, [user]: 1 };
  }, {});

  requestedReviewers["total"] = Object.keys(requestedReviewers).length;

  Object.keys(requestedReviewers).forEach((user) => {
    teams[user]?.forEach((team) => {
      requestedReviewers[team] = (requestedReviewers[team] || 0) + 1;
    });
  });

  [dateKey, "total"].forEach((date) => {
    Object.entries({ ...requestedReviewers }).forEach(([user, value]) => {
      if (!collection[user]) {
        collection[user] = {};
      }

      collection[user][date] = {
        ...collection[user][date],
        reviewRequestsConducted:
          (collection[user][date]?.reviewRequestsConducted || 0) +
          (value as number),
      };
    });
  });
};

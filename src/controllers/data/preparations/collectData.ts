import { format, parseISO } from "date-fns";
import { makeComplexRequest } from "../requests";
import { Collection } from "./types";
import {
  prepareProvidedReviews,
  preparePullRequestInfo,
  preparePullRequestStats,
  preparePullRequestTimeline,
} from "./utils";

export const collectData = (
  data: Awaited<ReturnType<typeof makeComplexRequest>>
) => {
  const collection: Record<string, Record<string, Collection>> = { total: {} };

  data.pullRequestInfo.forEach((pullRequest, index) => {
    const closedDate = pullRequest?.closed_at
      ? parseISO(pullRequest?.created_at)
      : null;

    const dateKey = closedDate ? format(closedDate, "M/y") : "invalidDate";

    const userKey = pullRequest?.user.login || "invalidUser";
    if (!collection[userKey]) {
      collection[userKey] = {};
    }

    ["total", userKey].forEach((key) => {
      ["total", dateKey].forEach((innerKey) => {
        collection[key][innerKey] = preparePullRequestInfo(
          pullRequest,
          collection[key][innerKey]
        );
        collection[key][innerKey] = preparePullRequestTimeline(
          pullRequest,
          data.reviews[index],
          collection[key][innerKey]
        );
      });
    });
    const users = Object.keys(
      data.reviews[index]?.reduce((acc, review) => {
        if (
          review.user?.login &&
          review.user.login !== pullRequest?.user.login
        ) {
          return { ...acc, [review.user?.login]: 1 };
        }
        return acc;
      }, {}) || {}
    );

    users.forEach((user) => {
      if (!collection[user]) {
        collection[user] = {};
      }
      const userReviews = Array.isArray(data.reviews[index])
        ? data.reviews[index]?.filter((review) => review.user?.login === user)
        : data.reviews[index];
      [dateKey, "total"].forEach((key) => {
        collection[user][key] = prepareProvidedReviews(
          pullRequest,
          userReviews,
          collection[user][key]
        );
      });
    });
  });

  Object.entries(collection).map(([key, value]) => {
    Object.entries(value).forEach(([innerKey, innerValue]) => {
      collection[key][innerKey] = preparePullRequestStats(innerValue);
    });
  });
  return collection;
};

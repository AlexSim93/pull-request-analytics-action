import { format, parseISO } from "date-fns";
import { makeComplexRequest } from "../requests";
import { Collection } from "./types";
import {
  prepareReviews,
  prepareDiscussions,
  preparePullRequestInfo,
  preparePullRequestStats,
  preparePullRequestTimeline,
  prepareResponseTime,
  prepareRequestedReviews,
} from "./utils";
import {
  invalidUserLogin,
  invalidDate,
  reviewRequestedTimelineEvent,
  reviewedTimelineEvent,
  readyForReviewTimelineEvent,
  convertToDraftTimelineEvent,
} from "./constants";
import { getPullRequestSize } from "./utils/calculations";
import { getDateFormat } from "../common/utils";

export const collectData = (
  data: Awaited<ReturnType<typeof makeComplexRequest>>
) => {
  const collection: Record<string, Record<string, Collection>> = { total: {} };

  data.pullRequestInfo.forEach((pullRequest, index) => {
    if (pullRequest === undefined || pullRequest === null) {
      return;
    }
    const reviews = data.events[index]?.filter(
      (el) => el.event === reviewedTimelineEvent
    );
    const reviewRequests = data.events[index]?.filter(
      (el) => el.event === reviewRequestedTimelineEvent
    );

    const statuses = data.events[index]?.filter((el) =>
      [readyForReviewTimelineEvent, convertToDraftTimelineEvent].includes(
        el.event as string
      )
    );

    const closedDate = pullRequest.closed_at
      ? parseISO(pullRequest.closed_at)
      : null;

    const dateKey =
      closedDate && getDateFormat()
        ? format(closedDate, getDateFormat())
        : invalidDate;

    const userKey = pullRequest.user?.login || invalidUserLogin;
    if (!collection[userKey]) {
      collection[userKey] = {};
    }
    prepareRequestedReviews(reviewRequests, collection, dateKey);

    ["total", userKey].forEach((key) => {
      ["total", dateKey].forEach((innerKey) => {
        collection[key][innerKey] = preparePullRequestInfo(
          pullRequest,
          collection[key][innerKey]
        );
        collection[key][innerKey] = preparePullRequestTimeline(
          pullRequest,
          reviews,
          reviewRequests?.[0],
          statuses,
          collection[key][innerKey]
        );
      });
    });

    prepareReviews(
      reviews,
      collection,
      dateKey,
      userKey,
      getPullRequestSize(pullRequest?.additions, pullRequest?.deletions)
    );
    prepareResponseTime(
      data.events[index],
      pullRequest,
      collection,
      dateKey
    );
    prepareDiscussions(data.comments, collection, index, dateKey, userKey);
  });

  Object.entries(collection).map(([key, value]) => {
    Object.entries(value).forEach(([innerKey, innerValue]) => {
      collection[key][innerKey] = preparePullRequestStats(innerValue);
    });
  });

  return collection;
};

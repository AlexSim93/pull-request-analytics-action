import * as core from "@actions/core";

import { Collection } from "../data/preparations/types";
import {
  StatsType,
  createConfigParamsCode,
  createPullRequestQualityTable,
  createReviewTable,
  createTimelineGanttBar,
  createTimelineTable,
  createTotalTable,
  sortCollectionsByDate,
} from "./utils";
import { getMultipleValuesInput } from "../utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const usersToHide = getMultipleValuesInput("HIDE_USERS") || [];
  const usersToShow = getMultipleValuesInput("SHOW_USERS") || [];

  const users = Object.keys(data)
    .filter((key) => key !== "total")
    .concat("total")
    .filter((key) => {
      return (
        !usersToHide.includes(key) &&
        (usersToShow.length > 0 ? usersToShow.includes(key) : true)
      );
    });

  const dates = sortCollectionsByDate(data.total);

  const content = dates.map((date) => {
    if (!data.total[date]?.merged) return "";

    const timelineContent = getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
      .filter((method) => ["average", "median", "percentile"].includes(method))
      .map((type) => {
        const pullRequestTimelineTable = createTimelineTable(
          data,
          type as StatsType,
          users,
          date
        );
        const pullRequestTimelineBar = createTimelineGanttBar(
          data,
          type as StatsType,
          users,
          date
        );

        return `
      ${pullRequestTimelineTable}
      ${pullRequestTimelineBar}
      `;
      });

    const pullRequestTotal = createTotalTable(data, users, date);

    const pullRequestReviews = createReviewTable(data, users, date);

    const pullRequestQuality = createPullRequestQualityTable(data, users, date);

    return `
    ${timelineContent.join("\n")}
    ${pullRequestTotal}
    ${pullRequestReviews}
    ${pullRequestQuality}
    `;
  });

  return `
## Pull Request report
This report based on ${
    data.total?.total?.closed || 0
  } last updated PRs. To learn more about the project and its configuration, please visit [Pull request analytics action](https://github.com/AlexSim93/pull-request-analytics-action).
  ${createConfigParamsCode()}
    ${content.join("\n")}
  `;
};

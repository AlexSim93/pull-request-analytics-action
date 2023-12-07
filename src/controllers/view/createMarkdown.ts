import * as core from "@actions/core";

import { Collection } from "../data/preparations/types";
import {
  StatsType,
  createConfigParamsCode,
  createReviewTable,
  createTimelineGanttBar,
  createTimelineTable,
  createTotalTable,
  sortCollectionsByDate,
} from "./utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const hideUsers = process.env.HIDE_USERS || core.getInput("HIDE_USERS");
  const usersToHide =
    hideUsers
      ?.split(",")
      .map((user) => user.trim())
      .filter((user) => user) || [];
  const showUsers = process.env.SHOW_USERS || core.getInput("SHOW_USERS");
  const usersToShow =
    showUsers
      ?.split(",")
      .map((user) => user.trim())
      .filter((user) => user) || [];
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
    const methods =
      process.env.AGGREGATE_VALUE_METHODS ||
      core.getInput("AGGREGATE_VALUE_METHODS");
    const timelineContent = methods
      .split(",")
      .map((el) => el.trim())
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

    return `
    ${timelineContent.join("\n")}
    ${pullRequestTotal}
    ${pullRequestReviews}
    `;
  });

  return `
## Pull Request report
This report based on ${
    data.total?.total?.closed || 0
  } last updated PRs. To learn more about the project and its configuration, please visit [PR Full report action](https://github.com/AlexSim93/pr-full-report-action).
  ${createConfigParamsCode()}
    ${content.join("\n")}
  `;
};

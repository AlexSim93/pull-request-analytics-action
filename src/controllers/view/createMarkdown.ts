import * as core from "@actions/core";

import { Collection } from "../data/preparations/types";
import {
  StatsType,
  createConfigParamsCode,
  createTimelineGanttBar,
  createTimelineTable,
  createTotalTable,
  sortCollectionsByDate,
} from "./utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const users = Object.keys(data)
    .filter((key) => key !== "total")
    .concat("total");

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

    return `
    ${timelineContent.join("\n")}
    ${pullRequestTotal}
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

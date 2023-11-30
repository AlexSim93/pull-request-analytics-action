import { Collection } from "../data/preparations/types";
import {
  StatsType,
  createConfigParamsCode,
  createReferences,
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
    const timelineContent = ["avg", "median"].map((type) => {
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
### Pull Request stats(${date})
This section contains stats about pull requests closed during this period.
    ${timelineContent.join("\n")}
    ${pullRequestTotal}
    `;
  });

  return `
## Pull Request report
    ${createReferences()}
The total amount is ${
    data.total?.total?.closed || 0
  }. To find out more about project and configuration check [PR Full report action](https://github.com/AlexSim93/pr-full-report-action).
  ${createConfigParamsCode()}
    ${content.join("\n")}
  `;
};

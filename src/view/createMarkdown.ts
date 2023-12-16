import { Collection } from "../converters/types";
import {
  StatsType,
  createConfigParamsCode,
  createPullRequestQualityTable,
  createReviewTable,
  createTimelineContent,
  createTimelineMonthsGanttBar,
  createTotalTable,
  getDisplayUserList,
  sortCollectionsByDate,
} from "./utils";
import { getMultipleValuesInput } from "../common/utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const users = getDisplayUserList(data);

  const dates = sortCollectionsByDate(data.total);

  const contentTypes = getMultipleValuesInput("SHOW_STATS_TYPES");

  const content = dates.map((date) => {
    if (!data.total[date]?.merged) return "";

    const contentMap: Record<string, string> = {
      timeline: createTimelineContent(data, users, date).join("\n"),
      workload: createTotalTable(data, users, date),
      "code-review-engagement": createReviewTable(data, users, date),
      "pr-quality": createPullRequestQualityTable(data, users, date),
    };

    return `
    ${contentTypes
      .map((type) => contentMap[type])
      .filter((content) => content)
      .join("\n")}
    `;
  });

  return `
## Pull Request report
This report based on ${
    data.total?.total?.closed || 0
  } last updated PRs. To learn more about the project and its configuration, please visit [Pull request analytics action](https://github.com/AlexSim93/pull-request-analytics-action).
  ${createConfigParamsCode()}
    ${content.join("\n")}
  ${getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
    .filter((method) => ["average", "median", "percentile"].includes(method))
    .map((type) =>
      createTimelineMonthsGanttBar(
        data,
        type as StatsType,
        dates.filter((date) => date !== "total"),
        "total"
      )
    )
    .join("\n")}
  `;
};

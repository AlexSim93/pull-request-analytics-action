import { Collection } from "../converters/types";
import {
  createConfigParamsCode,
  createDiscussionsPieChart,
  createPullRequestQualityTable,
  createReviewTable,
  createTimelineContent,
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

    const timelineContent = contentTypes.includes("timeline")
      ? createTimelineContent(data, users, date)
      : [];

    const pullRequestTotal = contentTypes.includes("workload")
      ? createTotalTable(data, users, date)
      : "";

    const pullRequestReviews = contentTypes.includes("code-review-engagement")
      ? createReviewTable(data, users, date)
      : "";

    const pullRequestQuality = contentTypes.includes("pr-quality")
      ? createPullRequestQualityTable(data, users, date)
      : "";
    const pieChart = contentTypes.includes("pr-quality")
      ? createDiscussionsPieChart(data, users, date)
      : "";
    return `
    ${timelineContent.join("\n")}
    ${[pullRequestTotal, pullRequestReviews, pullRequestQuality, pieChart].join(
      "\n"
    )}
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

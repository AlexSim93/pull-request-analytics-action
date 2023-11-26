import { isBefore, parse } from "date-fns";
import { Collection } from "../data/preparations/types";
import { createGanttBar, formatMinutesDuration } from "./utils";
import { createBlock } from "./utils/createBlock";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const users = Object.keys(data)
    .filter((key) => key !== "total")
    .concat("total");

  const dates = Object.keys(data.total)
    .slice()
    .sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return isBefore(parse(a, "M/y", new Date()), parse(b, "M/y", new Date()))
        ? 1
        : -1;
    });

  const content = dates.map((date) => {
    const tableRows = users
      .filter((user) => data[user]?.total?.merged)
      .map((user) => {
        return [
          `**${user}**`,
          formatMinutesDuration(data[user]?.[date]?.timeToReviewAvg || 0),
          formatMinutesDuration(data[user]?.[date]?.timeToApproveAvg || 0),
          formatMinutesDuration(data[user]?.[date]?.timeToMergeAvg || 0),
          data[user]?.[date]?.merged?.toString() || "0",
        ];
      });

    const pullRequestTimeLine = createBlock({
      title: `Pull requests timeline avg ${date}`,
      description: "Stats for last 20 closed PRs",
      table: {
        headers: [
          "user",
          "time to review",
          "time to approve",
          "time to merge",
          "total merged PRs",
        ],
        rows: tableRows,
      },
    });

    const ganttPullRequestBar = createGanttBar({
      title: `Pull requests timeline avg ${date}`,
      sections: users
        .filter(
          (user) =>
            data[user]?.[date]?.timeToReviewAvg &&
            data[user]?.[date]?.timeToApproveAvg &&
            data[user]?.[date]?.timeToMergeAvg
        )
        .map((user) => ({
          name: user,
          bars: [
            {
              name: "time to review",
              start: 0,
              end: data[user]?.[date]?.timeToReviewAvg || 0,
            },
            {
              name: "time to approve",
              start: 0,
              end: data[user]?.[date]?.timeToApproveAvg || 0,
            },
            {
              name: "time to merge",
              start: 0,
              end: data[user]?.[date]?.timeToMergeAvg || 0,
            },
          ],
        })),
    });

    const tableRowsMedian = users
      .filter((user) => data[user]?.[date]?.merged)
      .map((user) => {
        return [
          `**${user}**`,
          formatMinutesDuration(data[user]?.[date]?.timeToReviewMedian || 0),
          formatMinutesDuration(data[user]?.[date]?.timeToApproveMedian || 0),
          formatMinutesDuration(data[user]?.[date]?.timeToMergeMedian || 0),
          data[user]?.[date]?.merged?.toString() || "0",
        ];
      });

    const pullRequestTimeLineMedian = createBlock({
      title: `Pull requests timeline median ${date}`,
      description: "Stats for last 20 closed PRs",
      table: {
        headers: [
          "user",
          "time to review",
          "time to approve",
          "time to merge",
          "total merged PRs",
        ],
        rows: tableRowsMedian,
      },
    });

    const ganttPullRequestBarMedian = createGanttBar({
      title: `Pull requests timeline median ${date}`,
      sections: users
        .filter(
          (user) =>
            data[user]?.[date]?.timeToReviewMedian &&
            data[user]?.[date]?.timeToApproveP80 &&
            data[user]?.[date]?.timeToMergeP80
        )
        .map((user) => ({
          name: user,
          bars: [
            {
              name: "time to review",
              start: 0,
              end: data[user]?.[date]?.timeToReviewMedian || 0,
            },
            {
              name: "time to approve",
              start: 0,
              end: data[user]?.[date]?.timeToApproveMedian || 0,
            },
            {
              name: "time to merge",
              start: 0,
              end: data[user]?.[date]?.timeToMergeMedian || 0,
            },
          ],
        })),
    });
    const tableRowsTotal = users
      .filter((user) => data[user]?.[date]?.merged)
      .map((user) => {
        return [
          `**${user}**`,
          data[user]?.[date]?.merged?.toString() || "0",
          `+${data[user]?.[date].additions || 0}/-${
            data[user]?.[date].deletions || 0
          }`,
          data[user]?.[date]?.reviewComments?.toString() || "0",
          data[user]?.[date]?.providedReviews?.total?.total?.toString() || "0",
        ];
      });
    const pullRequestTotal = createBlock({
      title: `Pull requests stats ${date}`,
      description: "Stats for last 20 closed PRs",
      table: {
        headers: [
          "user",
          "merged PRs",
          "Add/delete",
          "Review comments",
          "Review provided",
        ],
        rows: tableRowsTotal,
      },
    });

    return `
## Pull Request stats(${date})
This stats includes last 100 PRs since 10 may 2023 18-35.  
    ${pullRequestTimeLine}
    ${ganttPullRequestBar}
    ${pullRequestTimeLineMedian}
    ${ganttPullRequestBarMedian}
    ${pullRequestTotal}
    `;
  });

  return `
## Pull Request report
References  
    ${content.join("\n")}
  `;
};

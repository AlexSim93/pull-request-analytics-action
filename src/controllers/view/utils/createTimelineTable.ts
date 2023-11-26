import { Collection } from "../../data/preparations/types";
import {
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";
import { formatMinutesDuration } from "./formatMinutesDuration";
import { StatsType } from "./types";

export const createTimelineTable = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  users: string[],
  date: string
) => {
  const tableRows = users
    .filter((user) => data[user]?.[date]?.merged)
    .map((user) => {
      return [
        `**${user}**`,
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToReview || 0),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToApprove || 0),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToMerge || 0),
        data[user]?.[date]?.merged?.toString() || "0",
      ];
    });

  const pullRequestTimeLine = createBlock({
    title: `Pull requests timeline(${type}) ${date}`,
    description: "Stats for last 20 closed PRs",
    table: {
      headers: [
        "user",
        timeToReviewHeader,
        timeToApproveHeader,
        timeToMergeHeader,
        totalMergedPrsHeader,
      ],
      rows: tableRows,
    },
  });

  return pullRequestTimeLine;
};

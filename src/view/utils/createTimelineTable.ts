import { Collection } from "../../converters/types";
import {
  timeAwaitingRepeatedReviewHeader,
  timeInDraftHeader,
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
  timeToReviewRequestHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createTable } from "./common";
import { formatMinutesDuration } from "./formatMinutesDuration";
import { StatsType } from "./types";
import { getValueAsIs } from "../../common/utils";

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
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeInDraft || 0),
        formatMinutesDuration(
          data[user]?.[date]?.[type]?.timeToReviewRequest || 0
        ),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToReview || 0),
        formatMinutesDuration(
          data[user]?.[date]?.[type]?.timeWaitingForRepeatedReview || 0
        ),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToApprove || 0),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToMerge || 0),
        data[user]?.[date]?.merged?.toString() || "0",
      ];
    });

  const pullRequestTimeLine = createTable({
    title: `Pull requests timeline(${
      type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
    }${type === "percentile" ? "th " : ""}${type}) ${date}`,
    description:
      "**Time to review** - time from PR creation to first review. \n**Time to approve** - time from PR creation to first approval without requested changes. \n**Time to merge** - time from PR creation to merge.",
    table: {
      headers: [
        "user",
        timeInDraftHeader,
        timeToReviewRequestHeader,
        timeToReviewHeader,
        timeAwaitingRepeatedReviewHeader,
        timeToApproveHeader,
        timeToMergeHeader,
        totalMergedPrsHeader,
      ].filter((header, index) => tableRows.some((row) => row[index])),
      rows: tableRows.map((row) =>
        row.filter((cell, index) => tableRows.some((row) => row[index]))
      ),
    },
  });

  return pullRequestTimeLine;
};

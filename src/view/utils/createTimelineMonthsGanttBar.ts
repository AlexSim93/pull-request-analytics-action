import { percentile } from "../../converters/constants";
import { Collection } from "../../converters/types";
import { timeToApproveHeader, timeToMergeHeader, timeToReviewHeader } from "./constants";
import { createGanttBar } from "./createGanttBar";
import { StatsType } from "./types";

export const createTimelineMonthsGanttBar = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  dates: string[],
  user: string
) => {
  return createGanttBar({
    title: `Pull request's retrospective timeline(${type}${
      type === "percentile" ? percentile : ""
    }) ${user} / minutes`,
    sections: dates
      .filter(
        (date) =>
          data[user]?.[date]?.[type]?.timeToReview &&
          data[user]?.[date]?.[type]?.timeToApprove &&
          data[user]?.[date]?.[type]?.timeToMerge
      )
      .map((date) => ({
        name: date,
        bars: [
          {
            name: timeToReviewHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToReview || 0,
          },
          {
            name: timeToApproveHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToApprove || 0,
          },
          {
            name: timeToMergeHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToMerge || 0,
          },
        ],
      })),
  });
};

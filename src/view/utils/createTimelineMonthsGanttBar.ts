import { Collection } from "../../converters/types";
import {
  timeInDraftHeader,
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
  timeToReviewRequestHeader,
} from "./constants";
import { createGanttBar } from "./common";
import { StatsType } from "./types";
import { formatMinutesDuration } from ".";
import { getValueAsIs } from "../../common/utils";

export const createTimelineMonthsGanttBar = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  dates: string[],
  user: string
) => {
  return createGanttBar({
    title: `Pull request's retrospective timeline(${type}${
      type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
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
            name: timeInDraftHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeInDraft || 0,
          },
          {
            name: timeToReviewRequestHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToReviewRequest || 0,
          },
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
    formatValue: (value) => formatMinutesDuration(value),
  });
};

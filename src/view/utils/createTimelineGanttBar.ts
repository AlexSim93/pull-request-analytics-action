import { Collection } from "../../converters/types";
import {
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
} from "./constants";
import { createGanttBar } from "./common";
import { StatsType } from "./types";
import { formatMinutesDuration } from "./formatMinutesDuration";
import { getValueAsIs } from "../../common/utils";

export const createTimelineGanttBar = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  users: string[],
  date: string
) => {
  if (
    !users.some(
      (user) =>
        data[user]?.[date]?.[type]?.timeToReview &&
        data[user]?.[date]?.[type]?.timeToApprove &&
        data[user]?.[date]?.[type]?.timeToMerge
    )
  ) {
    return "";
  }
  return createGanttBar({
    title: `Pull requests timeline(${type}${
      type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
    }) ${date} / minutes`,
    sections: users
      .filter(
        (user) =>
          data[user]?.[date]?.[type]?.timeToReview &&
          data[user]?.[date]?.[type]?.timeToApprove &&
          data[user]?.[date]?.[type]?.timeToMerge
      )
      .map((user) => ({
        name: user,
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
    formatValue: (value) => formatMinutesDuration(value),
  });
};

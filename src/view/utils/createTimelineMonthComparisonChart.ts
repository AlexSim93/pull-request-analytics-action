import { getMultipleValuesInput } from "../../common/utils";
import { Collection } from "../../converters/types";
import { createTimelineMonthsGanttBar } from "./createTimelineMonthsGanttBar";
import { StatsType } from "./types";

export const createTimelineMonthComparisonChart = (
  data: Record<string, Record<string, Collection>>,
  dates: string[],
  users: string[]
) => {
  return getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
    .filter((method) => ["average", "median", "percentile"].includes(method))
    .map((type) =>
      users
        .filter(
          (user) =>
            Object.values(data[user]).filter(
              (value) =>
                value.timeToReview && value.timeToApprove && value.timeToMerge
            ).length > 2
        )
        .map((user) =>
          createTimelineMonthsGanttBar(
            data,
            type as StatsType,
            dates.filter((date) => date !== "total"),
            user
          )
        )
        .join("\n")
    )
    .join("\n")
    .trim();
};

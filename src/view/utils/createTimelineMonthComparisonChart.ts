import { createReferences } from ".";
import { getMultipleValuesInput } from "../../common/utils";
import { Collection } from "../../converters/types";
import { createContributionMonthsXYChart } from "./createContributionMonthXYChart";
import { createTimelineMonthsXYChart } from "./createTimelineMonthXYChart";
import { StatsType } from "./types";

export const createTimelineMonthComparisonChart = (
  data: Record<string, Record<string, Collection>>,
  dates: string[],
  users: string[],
  references: { title: string; link: string }[] = []
) => {
  const charts = users.map((user) => {
    const timelines = getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
      .filter(
        (type) =>
          ["average", "median", "percentile"].includes(type) &&
          Object.values(data[user]).filter(
            (value) =>
              value[type as StatsType]?.timeToReview &&
              value[type as StatsType]?.timeToApprove &&
              value[type as StatsType]?.timeToMerge
          ).length > 2
      )
      .map((type) =>
        createTimelineMonthsXYChart(
          data,
          type as StatsType,
          dates.filter(
            (date) =>
              date !== "total" &&
              (data[user][date]?.timeToReview ||
                data[user][date]?.timeToApprove ||
                data[user][date]?.timeToMerge)
          ),
          user
        )
      )
      .join("\n");
    const contribution =
      Object.values(data[user]).filter(
        (value) =>
          value.merged ||
          value.discussions?.conducted?.total ||
          value.discussions?.received?.total ||
          value?.reviewsConducted?.total?.total
      ).length > 2
        ? createContributionMonthsXYChart(
            data,
            dates.filter((date) => date !== "total"),
            user
          )
        : "";

    return [timelines, contribution].join("\n");
  });

  if (charts.every((el) => !el.trim())) return "";
  return [createReferences(references)].concat(charts).join("\n").trim();
};

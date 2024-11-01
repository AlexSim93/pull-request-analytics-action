import { createReferences } from ".";
import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";
import { Collection } from "../../converters/types";
import { createContributionMonthsXYChart } from "./createContributionMonthXYChart";
import { createTimelineMonthsGanttBar } from "./createTimelineMonthsGanttBar";
import { createTimelineMonthsXYChart } from "./createTimelineMonthXYChart";
import { StatsType } from "./types";

export const createTimelineMonthComparisonChart = (
  data: Record<string, Record<string, Collection>>,
  dates: string[],
  users: string[],
  references: { title: string; link: string }[] = []
) => {
  const charts = users.map((user) => {
    if (getValueAsIs("USE_XY_CHART") === "true") {
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
            dates.filter((date) => date !== "total"),
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
    }
    if (
      getMultipleValuesInput("AGGREGATE_VALUE_METHODS").some(
        (type) =>
          ["average", "median", "percentile"].includes(type) &&
          Object.values(data[user]).filter(
            (value) =>
              value[type as StatsType]?.timeToReview ||
              value[type as StatsType]?.timeToApprove ||
              value[type as StatsType]?.timeToMerge
          ).length > 2
      )
    ) {
      return getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
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
          createTimelineMonthsGanttBar(
            data,
            type as StatsType,
            dates.filter((date) => date !== "total"),
            user
          )
        )
        .join("\n");
    }
    return '';
  });

  if (charts.every((el) => !el.trim())) return "";
  return [createReferences(references)].concat(charts).join("\n").trim();
};

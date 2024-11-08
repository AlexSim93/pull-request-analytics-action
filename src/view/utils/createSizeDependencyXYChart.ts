import { Collection } from "../../converters/types";
import { StatsType } from "./types";
import { getValueAsIs } from "../../common/utils";
import { createXYChart } from "./common/createXYChart";
const sizes = ["xs", "s", "m", "l", "xl"];

export const createSizeDependencyXYChart = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  user: string
) => {
  return createXYChart({
    title: `Pull request's size dependency timeline(${
      type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
    }${type === "percentile" ? "th " : ""}${type}) ${user}`,
    xAxis: sizes,
    yAxis: {
      min: 0,
      max: Math.ceil(
        Math.max(
          ...sizes.map((size) =>
            Math.max(
              ...["timeToReview", "timeToApprove", "timeToMerge"].map(
                (key) =>
                  data[user]?.total?.sizes?.[size]?.[type]?.[
                    key as "timeToReview" | "timeToApprove" | "timeToMerge"
                  ] || 0
              )
            )
          ),
          1
        ) / 60
      ),
      title: "hours",
    },
    lines: [
      {
        color: "gold",
        name: "Time\\ To\\ Review",
        values: sizes.map(
          (size) =>
            Math.round(
              ((data[user]?.total?.sizes?.[size]?.[type]?.timeToReview || 0) /
                60) *
                100
            ) / 100
        ),
      },
      {
        color: "chartreuse",
        name: "Time\\ To\\ Approve",
        values: sizes.map(
          (size) =>
            Math.round(
              ((data[user]?.total?.sizes?.[size]?.[type]?.timeToApprove || 0) /
                60) *
                100
            ) / 100
        ),
      },
      {
        color: "blueviolet",
        name: "Time\\ To\\ Merge",
        values: sizes.map(
          (size) =>
            Math.round(
              ((data[user]?.total?.sizes?.[size]?.[type]?.timeToMerge || 0) /
                60) *
                100
            ) / 100
        ),
      },
    ],
  });
};

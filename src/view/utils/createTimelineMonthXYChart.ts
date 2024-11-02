import { Collection } from "../../converters/types";
import { StatsType } from "./types";
import { getValueAsIs } from "../../common/utils";
import { createXYChart } from "./common/createXYChart";

export const createTimelineMonthsXYChart = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  dates: string[],
  user: string
) => {
  return createXYChart({
    title: `Pull request's retrospective timeline(${
      type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
    }${type === "percentile" ? "th " : ""}${type}) ${user}`,
    xAxis: dates.map((date) =>
      date.replace(/\/(\d{4})$/, (match, year) => `/${year.slice(-2)}`)
    ).reverse(),
    yAxis: {
      min: 0,
      max: Math.ceil(
        Math.max(
          ...dates.map((date) =>
            Math.max(
              ...[
                "timeInDraft",
                "timeToReviewRequest",
                "timeToReview",
                "timeToApprove",
                "timeToMerge",
                "timeFromInitialRequestToResponse",
                "timeFromOpenToResponse",
                "timeFromRepeatedRequestToResponse",
              ].map(
                (key) =>
                  data[user]?.[date]?.[type]?.[
                    key as
                      | "timeInDraft"
                      | "timeToReviewRequest"
                      | "timeToReview"
                      | "timeToApprove"
                      | "timeToMerge"
                      | "timeFromInitialRequestToResponse"
                      | "timeFromOpenToResponse"
                      | "timeFromRepeatedRequestToResponse"
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
        color: "orange",
        name: "Time\\ From\\ Initial\\ Request\\ To\\ Response",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeFromInitialRequestToResponse ||
                0) /
                60) *
                100
            ) / 100
        ),
      },
      {
        color: "violet",
        name: "Time\\ From\\ Opening\\ To\\ Response",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeFromOpenToResponse || 0) / 60) *
                100
            ) / 100
        ),
      },
      {
        color: "mediumblue",
        name: "Time\\ From\\ Rerequest\\ To\\ Response",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeFromRepeatedRequestToResponse ||
                0) /
                60) *
                100
            ) / 100
        ),
      },
      {
        color: "dimgrey",
        name: "Time\\ In\\ Draft",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeInDraft || 0) / 60) * 100
            ) / 100
        ),
      },
      {
        color: "firebrick",
        name: "Time\\ To\\ Review\\ Request",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeToReviewRequest || 0) / 60) *
                100
            ) / 100
        ),
      },
      {
        color: "gold",
        name: "Time\\ To\\ Review",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeToReview || 0) / 60) * 100
            ) / 100
        ),
      },
      {
        color: "chartreuse",
        name: "Time\\ To\\ Approve",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeToApprove || 0) / 60) * 100
            ) / 100
        ),
      },
      {
        color: "blueviolet",
        name: "Time\\ To\\ Merge",
        values: dates.map(
          (date) =>
            Math.round(
              ((data[user]?.[date]?.[type]?.timeToMerge || 0) / 60) * 100
            ) / 100
        ),
      },
    ],
  });
};

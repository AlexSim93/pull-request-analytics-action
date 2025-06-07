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
    xAxis: dates
      .map((date) =>
        date.replace(/\/(\d{4})$/, (match, year) => `/${year.slice(-2)}`)
      )
      .reverse(),
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
                "timeWaitingForRepeatedReview",
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
                      | "timeWaitingForRepeatedReview"
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
        color: "#FFA500",
        name: "Time From Initial Request To Response",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]
                  ?.timeFromInitialRequestToResponse || 0) /
                  60) *
                  100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#EE82EE",
        name: "Time From Opening To Response",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeFromOpenToResponse || 0) /
                  60) *
                  100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#0000CD",
        name: "Time From Rerequest To Response",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]
                  ?.timeFromRepeatedRequestToResponse || 0) /
                  60) *
                  100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#696969",
        name: "Time In Draft",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeInDraft || 0) / 60) * 100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#B22222",
        name: "Time To Review Request",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeToReviewRequest || 0) / 60) *
                  100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#FFD700",
        name: "Time To Review",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeToReview || 0) / 60) * 100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#40E0D0",
        name: "Time To Review After Rerequest",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeWaitingForRepeatedReview ||
                  0) /
                  60) *
                  100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#7FFF00",
        name: "Time To Approve",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeToApprove || 0) / 60) * 100
              ) / 100
          )
          .reverse(),
      },
      {
        color: "#8A2BE2",
        name: "Time To Merge",
        values: dates
          .map(
            (date) =>
              Math.round(
                ((data[user]?.[date]?.[type]?.timeToMerge || 0) / 60) * 100
              ) / 100
          )
          .reverse(),
      },
    ],
  });
};

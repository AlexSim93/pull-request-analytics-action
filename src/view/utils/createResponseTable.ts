import { Collection } from "../../converters/types";
import {
  reviewConductedHeader,
  reviewRequestConductedHeader,
  timeFromOpenToResponseHeader,
  timeFromRepeatedRequestToResponseHeader,
  timeFromRequestToResponseHeader,
} from "./constants";
import { createTable } from "./common";
import { formatMinutesDuration } from "./formatMinutesDuration";
import { StatsType } from "./types";
import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";

export const createResponseTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  return getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
    .filter((method) => ["average", "median", "percentile"].includes(method))
    .map((type) => {
      const tableRows = users
        .filter(
          (user) =>
            data[user]?.[date]?.[type as StatsType]
              ?.timeFromInitialRequestToResponse ||
            data[user]?.[date]?.reviewsConducted?.total?.total ||
            data[user]?.[date]?.[type as StatsType]?.timeFromOpenToResponse ||
            data[user]?.[date]?.[type as StatsType]
              ?.timeFromRepeatedRequestToResponse ||
            data[user]?.[date]?.reviewRequestsConducted
        )
        .map((user) => {
          return [
            `**${user}**`,
            data[user]?.[date]?.reviewRequestsConducted?.toString() || "0",
            data[user]?.[date]?.reviewsConducted?.total?.total?.toString() ||
              "0",
            formatMinutesDuration(
              data[user]?.[date]?.[type as StatsType]?.timeFromOpenToResponse ||
                0
            ),
            formatMinutesDuration(
              data[user]?.[date]?.[type as StatsType]
                ?.timeFromInitialRequestToResponse || 0
            ),
            formatMinutesDuration(
              data[user]?.[date]?.[type as StatsType]
                ?.timeFromRepeatedRequestToResponse || 0
            ),
          ];
        });
      return createTable({
        title: `Review Response Time(${
          type === "percentile" ? parseInt(getValueAsIs("PERCENTILE")) : ""
        }${type === "percentile" ? "th " : ""}${type}) ${date}`,
        description:
          "**Time from re-request to response** - time from a review re-request to the response. Multiple re-requests and responses can occur in a single pull request",
        table: {
          headers: [
            "user",
            reviewRequestConductedHeader,
            reviewConductedHeader,
            timeFromOpenToResponseHeader,
            timeFromRequestToResponseHeader,
            timeFromRepeatedRequestToResponseHeader,
          ].filter((header, index) => tableRows.some((row) => row[index])),
          rows: tableRows.map((row) =>
            row.filter((cell, index) => tableRows.some((row) => row[index]))
          ),
        },
      });
    })
    .join("\n");
};

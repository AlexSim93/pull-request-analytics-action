import { getMultipleValuesInput } from "../../common/utils";
import { Collection } from "../../converters/types";
import { createTimelineGanttBar } from "./createTimelineGanttBar";
import { createTimelineTable } from "./createTimelineTable";
import { StatsType } from "./types";

export const createTimelineContent = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) =>
  getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
    .filter((method) => ["average", "median", "percentile"].includes(method))
    .map((type) => {
      const pullRequestTimelineTable = createTimelineTable(
        data,
        type as StatsType,
        users,
        date
      );
      const pullRequestTimelineBar = createTimelineGanttBar(
        data,
        type as StatsType,
        users,
        date
      );

      return `
${pullRequestTimelineTable}
${pullRequestTimelineBar}
`;
    });

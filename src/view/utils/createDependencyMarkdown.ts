import { getMultipleValuesInput } from "../../common/utils";
import { Collection } from "../../converters";
import { createReferences } from "./createReferences";
import { createSizeDependencyXYChart } from "./createSizeDependencyXYChart";
import { StatsType } from "./types";

export const createDependencyMarkdown = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  references: { title: string; link: string }[] = []
) => {
  const charts = users
    .filter((user) => Object.keys(data[user]?.total?.sizes || {}).length > 1)
    .map((user) => {
      return getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
        .map((type) =>
          createSizeDependencyXYChart(data, type as StatsType, user)
        )
        .join("\n");
    })
    .join("\n");

  return [createReferences(references)].concat(charts).join("\n").trim();
};

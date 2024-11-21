import { Collection } from "../../converters";
import { createActivityXYChart } from "./createActivityXYChart";
import { createReferences } from "./createReferences";

export const createActivityTimeMarkdown = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  references: { title: string; link: string }[] = []
) => {
  const activity = users
    .filter(
      (user) => Object.keys(data[user]?.total?.actionsTime || {}).length > 1
    )
    .map((user) => createActivityXYChart(data, user))
    .join("\n");

  return [createReferences(references)].concat(activity).join("\n").trim();
};

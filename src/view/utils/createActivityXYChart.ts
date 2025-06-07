import { Collection } from "../../converters";
import { createXYChart } from "./common/createXYChart";

export const createActivityXYChart = (
  data: Record<string, Record<string, Collection>>,
  user: string
) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  return createXYChart({
    title: `Activity ${user}`,
    xAxis: hours,
    yAxis: {
      min: 0,
      max: Math.max(
        ...Object.values(data[user]?.total?.actionsTime || {}).map((value) =>
          Math.max(...Object.values(value), 0)
        ),
        1
      ),
      title: "Amount",
    },
    lines: [
      {
        name: "Opened",
        color: "#000000",
        values: hours.map(
          (el) => data[user]?.total?.actionsTime?.[el]?.opened || 0
        ),
      },
      {
        name: "Merged",
        color: "#800080",
        values: hours.map(
          (el) => data[user]?.total?.actionsTime?.[el]?.merged || 0
        ),
      },
      {
        name: "Approved",
        color: "#008000",
        values: hours.map(
          (el) => data[user]?.total?.actionsTime?.[el]?.approved || 0
        ),
      },
      {
        name: "Changes Requested",
        color: "#ff0000",
        values: hours.map(
          (el) => data[user]?.total?.actionsTime?.[el]?.changes_requested || 0
        ),
      },
      {
        name: "Commented",
        color: "#0000ff",
        values: hours.map(
          (el) => data[user]?.total?.actionsTime?.[el]?.commented || 0
        ),
      },
    ],
  });
};

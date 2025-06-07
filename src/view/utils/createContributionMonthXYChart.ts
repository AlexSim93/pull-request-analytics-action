import { Collection } from "../../converters/types";
import { createXYChart } from "./common/createXYChart";

export const createContributionMonthsXYChart = (
  data: Record<string, Record<string, Collection>>,
  dates: string[],
  user: string
) => {
  return createXYChart({
    title: `Pull request's retrospective contribution ${user}`,
    xAxis: dates
      .map((date) =>
        date.replace(/\/(\d{4})$/, (match, year) => `/${year.slice(-2)}`)
      )
      .reverse(),
    yAxis: {
      min: 0,
      max: Math.max(
        ...dates.map((date) =>
          Math.max(
            1,
            data[user]?.[date]?.merged || 0,
            data["total"]?.[date]?.reviewsConducted?.[user]?.[
              "changes_requested"
            ] || 0,
            data[user]?.[date]?.reviewsConducted?.total?.total || 0,
            data[user]?.[date]?.discussions?.received?.total || 0,
            data[user]?.[date]?.discussions?.conducted?.total || 0,
            data[user]?.[date]?.reviewsConducted?.total?.changes_requested || 0
          )
        ),
        1
      ),
      title: "amount",
    },
    lines: [
      {
        color: "#8A2BE2",
        name: "Discussions Conducted",
        values: dates.map(
          (date) => data[user]?.[date]?.discussions?.conducted?.total || 0
        ).reverse(),
      },
      {
        color: "#00008B",
        name: "Discussions Received",
        values: dates.map(
          (date) => data[user]?.[date]?.discussions?.received?.total || 0
        ).reverse(),
      },
      {
        color: "#DC143C",
        name: "Changes Requested Conducted",
        values: dates.map(
          (date) =>
            data[user]?.[date]?.reviewsConducted?.total?.changes_requested || 0
        ).reverse(),
      },
      {
        color: "#B22222",
        name: "Changes Requested Received",
        values: dates.map(
          (date) =>
            data["total"]?.[date]?.reviewsConducted?.[user]?.[
              "changes_requested"
            ] || 0
        ).reverse(),
      },
      {
        color: "#FFD700",
        name: "Reviews Conducted",
        values: dates.map(
          (date) => data[user]?.[date]?.reviewsConducted?.total?.total || 0
        ).reverse(),
      },
      {
        color: "#7FFF00",
        name: "Merged PRs",
        values: dates.map((date) => data[user]?.[date]?.merged || 0).reverse(),
      },
    ],
  });
};

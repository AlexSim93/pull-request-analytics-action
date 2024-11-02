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
        color: "blueviolet",
        name: "Discussions\\ Conducted",
        values: dates.map(
          (date) => data[user]?.[date]?.discussions?.conducted?.total || 0
        ).reverse(),
      },
      {
        color: "darkblue",
        name: "Discussions\\ Received",
        values: dates.map(
          (date) => data[user]?.[date]?.discussions?.received?.total || 0
        ).reverse(),
      },
      {
        color: "crimson",
        name: "Changes\\ Requested\\ Conducted",
        values: dates.map(
          (date) =>
            data[user]?.[date]?.reviewsConducted?.total?.changes_requested || 0
        ).reverse(),
      },
      {
        color: "firebrick",
        name: "Changes\\ Requested\\ Received",
        values: dates.map(
          (date) =>
            data["total"]?.[date]?.reviewsConducted?.[user]?.[
              "changes_requested"
            ] || 0
        ).reverse(),
      },
      {
        color: "gold",
        name: "Reviews\\ Conducted",
        values: dates.map(
          (date) => data[user]?.[date]?.reviewsConducted?.total?.total || 0
        ).reverse(),
      },
      {
        color: "chartreuse",
        name: "Merged\\ PRs",
        values: dates.map((date) => data[user]?.[date]?.merged || 0).reverse(),
      },
    ],
  });
};

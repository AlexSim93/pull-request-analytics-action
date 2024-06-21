import { Collection } from "../../converters/types";
import {
  additionsDeletionsHeader,
  prSizesHeader,
  reviewCommentsHeader,
  reviewConductedHeader,
  totalMergedPrsHeader,
  totalOpenedPrsHeader,
} from "./constants";
import { createTable } from "./common";

export const createTotalTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const sizes = ["xs", "s", "m", "l", "xl"];
  const tableRowsTotal = users
    .filter(
      (user) =>
        data[user]?.[date]?.opened ||
        data[user]?.[date]?.reviewsConducted?.total?.total
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.opened?.toString() || "0",
        data[user]?.[date]?.merged?.toString() || "0",
        `+${data[user]?.[date].additions || 0}/-${
          data[user]?.[date].deletions || 0
        }`,
        `${sizes
          .map(
            (size) =>
              data[user]?.[date]?.prSizes?.filter((prSize) => prSize === size)
                .length || 0
          )
          .join("/")}`,
        data[user]?.[date]?.totalReviewComments?.toString() || "0",
        data[user]?.[date]?.reviewsConducted?.total?.total?.toString() || "0",
      ];
    });

  return createTable({
    title: `Contribution stats ${date}`,
    description:
      "**Reviews conducted** - number of reviews conducted. 1 PR may have only single review.\n**PR Size** - determined using the formula: `additions + deletions * 0.5`. Based on this calculation: 0-50: xs, 51-200: s, 201-400: m, 401-700: l, 701+: xl",
    table: {
      headers: [
        "user",
        totalOpenedPrsHeader,
        totalMergedPrsHeader,
        additionsDeletionsHeader,
        prSizesHeader,
        reviewCommentsHeader,
        reviewConductedHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};

import { Collection } from "../../data/preparations/types";
import {
  additionsDeletionsHeader,
  reviewCommentsHeader,
  reviewProvidedHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createTotalTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .filter((user) => data[user]?.[date]?.merged)
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        `+${data[user]?.[date].additions || 0}/-${
          data[user]?.[date].deletions || 0
        }`,
        data[user]?.[date]?.reviewComments?.toString() || "0",
        data[user]?.[date]?.providedReviews?.total?.total?.toString() || "0",
      ];
    });

  return createBlock({
    title: `Pull requests stats ${date}`,
    description:
      "**Reviews provided** - number of reviews provided. 1 PR may have only single review.",
    table: {
      headers: [
        "user",
        totalMergedPrsHeader,
        additionsDeletionsHeader,
        reviewCommentsHeader,
        reviewProvidedHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};
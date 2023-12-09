import { Collection } from "../../data/preparations/types";
import {
  additionsDeletionsHeader,
  reviewCommentsHeader,
  reviewProvidedHeader,
  totalMergedPrsHeader,
  totalOpenedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createTotalTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
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
        data[user]?.[date]?.totalReviewComments?.toString() || "0",
        data[user]?.[date]?.reviewsConducted?.total?.total?.toString() || "0",
      ];
    });

  return createBlock({
    title: `Workload stats ${date}`,
    description:
      "**Reviews conducted** - number of Reviews conducted. 1 PR may have only single review.",
    table: {
      headers: [
        "user",
        totalOpenedPrsHeader,
        totalMergedPrsHeader,
        additionsDeletionsHeader,
        reviewCommentsHeader,
        reviewProvidedHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};

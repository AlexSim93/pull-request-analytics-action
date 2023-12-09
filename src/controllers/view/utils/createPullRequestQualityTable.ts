import { Collection } from "../../data/preparations/types";
import {
  commentsReceivedHeader,
  discussionsHeader,
  requestChangesReceived,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createPullRequestQualityTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .filter((user) => data[user]?.[date]?.opened)
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data["total"]?.[date]?.reviewsConducted?.[user]?.[
          "CHANGES_REQUESTED"
        ]?.toString() || "0",
        data[user]?.[date]?.discussions?.toString() || "0",
        data[user]?.[date]?.reviewComments?.toString() || "0",
      ];
    });

  return createBlock({
    title: `Pull requests quality stats ${date}`,
    description: "The table includes discussions and comments on closed pull requests.",
    table: {
      headers: [
        "user",
        totalMergedPrsHeader,
        requestChangesReceived,
        discussionsHeader,
        commentsReceivedHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};

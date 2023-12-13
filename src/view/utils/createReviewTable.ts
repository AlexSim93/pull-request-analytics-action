import { Collection } from "../../converters/types";
import {
  commentsConductedHeader,
  discussionsConductedHeader,
  reviewTypesHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createReviewTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .filter(
      (user) =>
        data[user]?.[date]?.merged ||
        data[user]?.[date]?.reviewsConducted?.total?.total
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data[user]?.[date]?.discussionsConducted?.toString() || "0",
        data[user]?.[date]?.commentsConducted?.toString() || "0",
        `${
          data[user]?.[
            date
          ]?.reviewsConducted?.total?.CHANGES_REQUESTED?.toString() || 0
        } / ${
          data[user]?.[date]?.reviewsConducted?.total?.COMMENTED?.toString() ||
          0
        } / ${
          data[user]?.[date]?.reviewsConducted?.total?.APPROVED?.toString() || 0
        }`,
      ];
    });

  return createBlock({
    title: `Code review engagement ${date}`,
    description:
      "**Changes requested / Comments / Approvals** - number of Reviews conducted by user. For a single pull request, only one review of each status will be counted for a user.",
    table: {
      headers: [
        "user",
        totalMergedPrsHeader,
        discussionsConductedHeader,
        commentsConductedHeader,
        reviewTypesHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};

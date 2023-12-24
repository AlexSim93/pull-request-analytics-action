import { Collection } from "../../converters/types";
import {
  commentsConductedHeader,
  discussionsConductedHeader,
  prSizesHeader,
  reviewTypesHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createTable } from "./common";

export const createReviewTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const sizes = ["xs", "s", "m", "l", "xl"];
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
        `${sizes
          .map(
            (size) =>
              data[user]?.[date]?.reviewsConductedSize?.filter(
                (prSize) => prSize === size
              ).length || 0
          )
          .join(" / ")}`,
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

  return createTable({
    title: `Code review engagement ${date}`,
    description:
      "**PR Size** - determined using the formula: `additions + deletions * 0.5`. Based on this calculation: 0-50: xs, 51-200: s, 201-400: m, 401-700: l, 701+: xl\n**Changes requested / Comments / Approvals** - number of Reviews conducted by user. For a single pull request, only one review of each status will be counted for a user.",
    table: {
      headers: [
        "user",
        totalMergedPrsHeader,
        discussionsConductedHeader,
        commentsConductedHeader,
        prSizesHeader,
        reviewTypesHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};

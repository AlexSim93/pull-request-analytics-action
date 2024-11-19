import { Collection } from "../../converters/types";
import {
  commentsConductedHeader,
  discussionsConductedHeader,
  prSizesHeader,
  reviewConductedHeader,
  reviewTypesHeader,
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
        data[user]?.[date]?.reviewsConducted?.total?.total ||
        data[user]?.[date]?.commentsConducted ||
        data[user]?.[date]?.discussions?.conducted?.total
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.reviewsConducted?.total?.total?.toString() || "0",
        `${
          data[user]?.[date]?.discussions?.conducted?.agreed?.toString() || "0"
        } / ${
          data[user]?.[date]?.discussions?.conducted?.disagreed?.toString() ||
          "0"
        } / ${
          data[user]?.[date]?.discussions?.conducted?.total?.toString() || "0"
        }`,
        data[user]?.[date]?.commentsConducted?.toString() || "0",
        `${sizes
          .map(
            (size) =>
              data[user]?.[date]?.reviewsConductedSize?.filter(
                (prSize) => prSize === size
              ).length || 0
          )
          .join("/")}`,
        `${
          data[user]?.[
            date
          ]?.reviewsConducted?.total?.changes_requested?.toString() || 0
        } / ${
          data[user]?.[date]?.reviewsConducted?.total?.commented?.toString() ||
          0
        } / ${
          data[user]?.[date]?.reviewsConducted?.total?.approved?.toString() || 0
        }`,
      ];
    });

  return createTable({
    title: `Code review engagement ${date}`,
    description:
      "**PR Size** - determined using the formula: `additions + deletions * 0.2`. Based on this calculation: 0-50: xs, 51-200: s, 201-400: m, 401-700: l, 701+: xl\n**Changes requested / Comments / Approvals** - number of reviews conducted by user. For a single pull request, only one review of each status will be counted for a user.\n**Agreed** - discussions with at least 1 reaction :+1:.\n**Disagreed** - discussions with at least 1 reaction :-1:.",
    table: {
      headers: [
        "user",
        reviewConductedHeader,
        discussionsConductedHeader,
        commentsConductedHeader,
        prSizesHeader,
        reviewTypesHeader,
      ].filter((header, index) =>
        tableRowsTotal.some((row) => row[index] !== "0")
      ),
      rows: tableRowsTotal.map((row) =>
        row.filter((cell, index) =>
          tableRowsTotal.some((row) => row[index] !== "0")
        )
      ),
    },
  });
};

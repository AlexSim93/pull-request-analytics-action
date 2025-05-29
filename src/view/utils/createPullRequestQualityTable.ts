import { Collection } from "../../converters/types";
import {
  commentsReceivedHeader,
  discussionsHeader,
  requestChangesReceived,
  totalMergedPrsHeader,
} from "./constants";
import { createTable, createList } from "./common";
import { createDiscussionsPieChart } from "./createDiscussionsPieChart";
import { getValueAsIs } from "../../common/utils";

export const createPullRequestQualityTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .filter(
      (user) =>
        data[user]?.[date]?.merged ||
        data[user]?.[date]?.discussions?.received?.total ||
        data[user]?.[date]?.reviewComments ||
        data["total"]?.[date]?.reviewsConducted?.[user]?.["changes_requested"]
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data["total"]?.[date]?.reviewsConducted?.[user]?.[
          "changes_requested"
        ]?.toString() || "0",
        `${
          data[user]?.[date]?.discussions?.received?.agreed?.toString() || "0"
        } / ${
          data[user]?.[date]?.discussions?.received?.disagreed?.toString() ||
          "0"
        } / ${
          data[user]?.[date]?.discussions?.received?.total?.toString() || "0"
        }`,
        data[user]?.[date]?.reviewComments?.toString() || "0",
      ];
    });

  const items =
    data.total?.[date]?.pullRequestsInfo
      ?.slice()
      ?.sort((a, b) => (b.comments || 0) - (a.comments || 0))
      .slice(0, parseInt(getValueAsIs("TOP_LIST_AMOUNT")))
      .map((item) => ({
        text: `${item.title}(${item.comments || 0})(Author: ${item.author})`,
        link: item.link || "",
      })) || [];

  return [
    createTable({
      title: `Pull request quality ${date}`,
      description:
        "**Agreed** - discussions with at least 1 reaction :+1:.\n**Disagreed** - discussions with at least 1 reaction :-1:.",
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
    }),
    createDiscussionsPieChart(data, users, date),
    createList("The most commented PRs", items),
  ].join("\n");
};

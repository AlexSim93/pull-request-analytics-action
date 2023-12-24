import * as core from "@actions/core";
import { Collection } from "../../converters/types";
import {
  commentsReceivedHeader,
  discussionsHeader,
  requestChangesReceived,
  totalMergedPrsHeader,
} from "./constants";
import { createTable, createList } from "./common";
import { createDiscussionsPieChart } from "./createDiscussionsPieChart";

export const createPullRequestQualityTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .filter(
      (user) =>
        data[user]?.[date]?.merged ||
        data[user]?.[date]?.discussions ||
        data[user]?.[date]?.reviewComments ||
        data["total"]?.[date]?.reviewsConducted?.[user]?.["CHANGES_REQUESTED"]
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data["total"]?.[date]?.reviewsConducted?.[user]?.[
          "CHANGES_REQUESTED"
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
      .slice(
        0,
        parseInt(
          process.env.TOP_LIST_AMOUNT || core.getInput("TOP_LIST_AMOUNT")
        )
      )
      .map((item) => ({
        text: `${item.title}(${item.comments || 0})`,
        link: item.link || "",
      })) || [];

  return [
    createTable({
      title: `Pull request quality ${date}`,
      description:
        "The table includes discussions and comments on closed pull requests.",
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

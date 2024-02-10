import * as core from "@actions/core";
import { getMultipleValuesInput, getValueAsIs } from "./common/utils";
import { Collection } from "./converters";
import { createMarkdown } from "./view/";
import { clearComments, createComment, createIssue } from "./requests";
import {
  createTimelineMonthComparisonChart,
  getDisplayUserList,
  sortCollectionsByDate,
} from "./view/utils";
import { octokit } from "./octokit";
import { showStatsTypes } from "./common/constants";

export const createOutput = async (
  data: Record<string, Record<string, Collection>>
) => {
  const outcomes = getMultipleValuesInput("EXECUTION_OUTCOME");
  for (let outcome of outcomes) {
    const users = getDisplayUserList(data);
    const dates = sortCollectionsByDate(data.total);

    if (outcome === "new-issue" || outcome === "existing-issue") {
      const issueNumber =
        outcome === "existing-issue" ? getValueAsIs("ISSUE_NUMBER") : undefined;
      const markdown = createMarkdown(
        data,
        users,
        ["total"],
        "Pull Request report total"
      );
      if (outcome.includes("existing-issue")) {
        await clearComments(issueNumber);
      }
      const issue = await createIssue(markdown, issueNumber);
      const monthComparison = getMultipleValuesInput(
        "SHOW_STATS_TYPES"
      ).includes(showStatsTypes.timeline)
        ? createTimelineMonthComparisonChart(data, dates, users, [
            {
              title: "Pull Request report total",
              link: `${issue.data.html_url}#`,
            },
          ])
        : null;
      const comments = [];
      if (monthComparison) {
        const comparisonComment = await octokit.rest.issues.createComment({
          repo: getValueAsIs("GITHUB_REPO_FOR_ISSUE"),
          owner: getValueAsIs("GITHUB_OWNER_FOR_ISSUE"),
          issue_number: issue.data.number,
          body: monthComparison,
        });
        comments.push({
          comment: comparisonComment,
          title: "retrospective timeline",
        });
      }
      console.log("Issue successfully created.");
      for (let date of dates) {
        if (date === "total") continue;
        const commentMarkdown = createMarkdown(
          data,
          users,
          [date],
          `Pull Request report ${date}`,
          [
            {
              title: "Pull Request report total",
              link: `${issue.data.html_url}#`,
            },
          ]
        );
        if (commentMarkdown === "") continue;
        const comment = await createComment(issue.data.number, commentMarkdown);
        comments.push({ comment, title: date });
      }
      await createIssue(
        createMarkdown(
          data,
          users,
          ["total"],
          "Pull Request report total",
          comments.map((comment) => ({
            title: `Pull Request report ${comment.title}`,
            link: comment.comment.data.html_url,
          }))
        ),
        issue.data.number
      );
    }

    if (outcome === "markdown") {
      const monthComparison = getMultipleValuesInput(
        "SHOW_STATS_TYPES"
      ).includes(showStatsTypes.timeline)
        ? createTimelineMonthComparisonChart(data, dates, users)
        : "";
      const markdown = createMarkdown(data, users, dates).concat(
        `\n${monthComparison}`
      );
      console.log("Markdown successfully generated.");
      core.setOutput("MARKDOWN", markdown);
    }
    if (outcome === "collection") {
      core.setOutput("JSON_COLLECTION", JSON.stringify(data));
    }
  }
};

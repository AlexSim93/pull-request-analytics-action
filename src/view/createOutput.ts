import * as core from "@actions/core";
import { getMultipleValuesInput, getValueAsIs } from "../common/utils";
import { Collection } from "../converters/types";
import { createMarkdown } from "./createMarkdown";
import { clearComments, createIssue } from "../requests";
import {
  createTimelineMonthComparisonChart,
  getDisplayUserList,
  sortCollectionsByDate,
} from "./utils";
import { octokit } from "../octokit/octokit";

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
      const monthComparison = createTimelineMonthComparisonChart(
        data,
        dates,
        users,
        [
          {
            title: "Pull Request report total",
            link: `${issue.data.html_url}#`,
          },
        ]
      );
      const comments = [];
      if (monthComparison) {
        const comparisonComment = await octokit.rest.issues.createComment({
          repo:
            core.getInput("GITHUB_REPO_FOR_ISSUE") ||
            process.env.GITHUB_REPO_FOR_ISSUE!,
          owner:
            core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
            process.env.GITHUB_OWNER_FOR_ISSUE!,
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
        const comment = await octokit.rest.issues.createComment({
          repo:
            core.getInput("GITHUB_REPO_FOR_ISSUE") ||
            process.env.GITHUB_REPO_FOR_ISSUE!,
          owner:
            core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
            process.env.GITHUB_OWNER_FOR_ISSUE!,
          issue_number: issue.data.number,
          body: commentMarkdown,
        });
        comments.push({ comment, title: date });
      }
      await octokit.rest.issues.update({
        repo:
          core.getInput("GITHUB_REPO_FOR_ISSUE") ||
          process.env.GITHUB_REPO_FOR_ISSUE!,
        owner:
          core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
          process.env.GITHUB_OWNER_FOR_ISSUE!,
        issue_number: issue.data.number,
        body: createMarkdown(
          data,
          users,
          ["total"],
          "Pull Request report total",
          comments.map((comment) => ({
            title: `Pull Request report ${comment.title}`,
            link: comment.comment.data.html_url,
          }))
        ),
      });
    }

    if (outcome === "markdown" || outcome === "output") {
      const monthComparison = createTimelineMonthComparisonChart(
        data,
        dates,
        users
      );
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

import * as core from "@actions/core";
import { octokit } from "../../octokit";
import { format } from "date-fns";

export const createIssue = (markdown: string) => {
  const issueTitle =
    core.getInput("ISSUE_TITLE") ||
    process.env.ISSUE_TITLE ||
    `Pull requests report(${format(new Date(), "d/MM/yyyy HH:mm")})`;
  const labels =
    (core.getInput("LABELS") || process.env.LABELS)
      ?.split(",")
      .map((label) => label.trim())
      .filter((label) => label && typeof label === "string") || [];
  const assignees =
    (core.getInput("ASSIGNEES") || process.env.ASSIGNEES)
      ?.split(",")
      .map((assignee) => assignee.trim())
      .filter((assignee) => assignee && typeof assignee === "string") || [];

  octokit.rest.issues.create({
    repo:
      core.getInput("GITHUB_REPO_FOR_ISSUE") ||
      process.env.GITHUB_REPO_FOR_ISSUE!,
    owner:
      core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
      process.env.GITHUB_OWNER_FOR_ISSUE!,
    title: issueTitle,
    body: markdown,
    labels,
    assignees,
  });
};

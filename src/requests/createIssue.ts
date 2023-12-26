import * as core from "@actions/core";
import { octokit } from "../octokit/octokit";
import { format } from "date-fns";
import { getMultipleValuesInput } from "../common/utils";

export const createIssue = async (markdown: string, issueNumber?: string) => {
  const issueTitle =
    core.getInput("ISSUE_TITLE") ||
    process.env.ISSUE_TITLE ||
    `Pull requests report(${format(new Date(), "d/MM/yyyy HH:mm")})`;
  const labels =
    getMultipleValuesInput("LABELS").filter(
      (label) => label && typeof label === "string"
    ) || [];
  const assignees =
    getMultipleValuesInput("ASSIGNEES").filter(
      (assignee) => assignee && typeof assignee === "string"
    ) || [];

  let result;
  if (issueNumber) {
    result = await octokit.rest.issues.update({
      labels,
      title: issueTitle,
      assignees,
      repo:
        core.getInput("GITHUB_REPO_FOR_ISSUE") ||
        process.env.GITHUB_REPO_FOR_ISSUE!,
      owner:
        core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
        process.env.GITHUB_OWNER_FOR_ISSUE!,
      body: markdown,
      issue_number: parseInt(issueNumber),
    });
  } else {
    result = await octokit.rest.issues.create({
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
  }

  return result;
};

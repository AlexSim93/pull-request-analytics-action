import { commonHeaders } from "./constants";
import { octokit } from "../octokit";
import { format } from "date-fns";
import { getMultipleValuesInput, getValueAsIs } from "../common/utils";

export const createIssue = async (
  markdown: string,
  issueNumber?: string | number
) => {
  const issueTitle =
    getValueAsIs("ISSUE_TITLE") ||
    `Pull requests report (${format(new Date(), "d/MM/yyyy HH:mm")})`;
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
      repo: getValueAsIs("GITHUB_REPO_FOR_ISSUE"),
      owner: getValueAsIs("GITHUB_OWNER_FOR_ISSUE"),
      body: markdown,
      issue_number:
        typeof issueNumber === "number" ? issueNumber : parseInt(issueNumber),
      headers: commonHeaders,
    });
  } else {
    result = await octokit.rest.issues.create({
      repo: getValueAsIs("GITHUB_REPO_FOR_ISSUE"),
      owner: getValueAsIs("GITHUB_OWNER_FOR_ISSUE"),
      title: issueTitle,
      body: markdown,
      labels,
      assignees,
      headers: commonHeaders,
    });
  }

  return result;
};

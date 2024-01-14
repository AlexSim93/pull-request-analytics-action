import { getValueAsIs } from "../common/utils";
import { octokit } from "../octokit";
import { commonHeaders } from "./constants";

export const createComment = async (
  issueNumber: number,
  commentMarkdown: string
) =>
  octokit.rest.issues.createComment({
    repo: getValueAsIs("GITHUB_REPO_FOR_ISSUE"),
    owner: getValueAsIs("GITHUB_OWNER_FOR_ISSUE"),
    issue_number: issueNumber,
    body: commentMarkdown,
    headers: commonHeaders,
  });

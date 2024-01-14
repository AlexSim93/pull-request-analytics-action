import { commonHeaders } from "./constants";
import { octokit } from "../octokit/octokit";
import { Repository } from "./types";

export const getPullRequestComments = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options?: { skip: boolean }
) => {
  const { owner, repo } = repository;
  return !options?.skip
    ? pullRequestNumbers.map(async (number) => {
        const comments = await octokit.paginate(
          octokit.rest.pulls.listReviewComments,
          { owner, repo, pull_number: number, headers: commonHeaders }
        );

        return { data: comments };
      })
    : [];
};

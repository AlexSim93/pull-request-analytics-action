import { commonHeaders } from './constants';
import { octokit } from "../octokit/octokit";
import { Repository } from "./types";

export const getPullRequestReviews = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options?: { skip: boolean }
) => {
  const { owner, repo } = repository;
  return !options?.skip
    ? pullRequestNumbers.map(async (number) => {
        const reviews = await octokit.paginate(octokit.rest.pulls.listReviews, {
          owner,
          repo,
          pull_number: number,
          headers: commonHeaders,
        });
        return { data: reviews };
      })
    : [];
};

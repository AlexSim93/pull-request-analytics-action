import { octokit } from "../../octokit";
import { Repository } from "./types";

export const getPullRequestReviews = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options?: { skip: boolean }
) => {
  const { owner, repo } = repository;
  return !options?.skip
    ? pullRequestNumbers.map((number) =>
        octokit.rest.pulls.listReviews({
          owner,
          repo,
          pull_number: number,
          per_page: 100,
          page: 1,
        })
      )
    : [];
};

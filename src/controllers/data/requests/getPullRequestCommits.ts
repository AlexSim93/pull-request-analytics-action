import { octokit } from "../../octokit";
import { Repository } from "./types";

export const getPullRequestCommits = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options?: { skip: boolean }
) => {
  const { repo, owner } = repository;
  return !options?.skip
    ? pullRequestNumbers.map((number) =>
        octokit.rest.pulls.listCommits({
          owner,
          repo,
          pull_number: number,
          per_page: 100,
          page: 1,
        })
      )
    : [];
};

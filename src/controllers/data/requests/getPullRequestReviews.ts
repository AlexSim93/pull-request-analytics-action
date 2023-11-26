import { octokit } from "../../octokit";

export const getPullRequestReviews = async (
  pullRequestNumbers: number[],
  options?: { skip: boolean }
) =>
  !options?.skip
    ? pullRequestNumbers.map((number) =>
        octokit.rest.pulls.listReviews({
          owner: process.env.GITHUB_OWNER!,
          repo: process.env.GITHUB_REPO!,
          pull_number: number,
          per_page: 100,
          page: 1,
        })
      )
    : [];

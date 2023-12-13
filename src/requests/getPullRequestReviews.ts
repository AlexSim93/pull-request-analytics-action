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
        const data = [];
        for (let i = 1, shouldStop = false; shouldStop === false; i++) {
          const reviews = await octokit.rest.pulls.listReviews({
            owner,
            repo,
            pull_number: number,
            per_page: 100,
            page: i,
          });
          if (reviews.data.length < 100) {
            shouldStop = true;
          }
          data.push(...reviews.data);
        }
        return { data };
      })
    : [];
};

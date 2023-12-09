import { octokit } from "../../octokit";
import { Repository } from "./types";

export const getPullRequestComments = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options?: { skip: boolean }
) => {
  const { owner, repo } = repository;
  return !options?.skip
    ? pullRequestNumbers.map(async (number) => {
        const data = [];
        for (let i = 1, shouldStop = false; shouldStop === false; i++) {
          const comments = await octokit.rest.pulls.listReviewComments({
            owner,
            repo,
            pull_number: number,
            per_page: 100,
            page: i,
          });
          if (comments.data.length < 100) {
            shouldStop = true;
          }
          data.push(...comments.data);
        }
        return { data };
      })
    : [];
};

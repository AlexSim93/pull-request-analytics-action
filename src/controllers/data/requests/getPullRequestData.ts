import { octokit } from "../../octokit";

export const getPullRequestDatas = async (pullRequestNumbers: number[]) =>
  pullRequestNumbers.map((number) =>
    octokit.rest.pulls.get({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      pull_number: number,
    })
  );

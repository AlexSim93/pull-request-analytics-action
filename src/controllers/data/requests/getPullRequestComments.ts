import * as core from "@actions/core";

import { octokit } from "../../octokit";

export const getPullRequestComments = async (
  pullRequestNumbers: number[],
  options?: { skip: boolean }
) =>
  !options?.skip
    ? pullRequestNumbers.map((number) =>
        octokit.rest.pulls.listReviewComments({
          owner: core.getInput("GITHUB_OWNER") || process.env.GITHUB_OWNER!,
          repo: core.getInput("GITHUB_REPO") || process.env.GITHUB_REPO!,
          pull_number: number,
          per_page: 100,
          page: 1,
        })
      )
    : [];

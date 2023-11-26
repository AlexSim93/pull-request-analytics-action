import * as core from "@actions/core";

import { octokit } from "../../octokit";

export const getPullRequestDatas = async (pullRequestNumbers: number[]) =>
  pullRequestNumbers.map((number) =>
    octokit.rest.pulls.get({
      owner: core.getInput('GITHUB_OWNER') || process.env.GITHUB_OWNER!,
      repo: core.getInput('GITHUB_REPO') || process.env.GITHUB_REPO!,
      pull_number: number,
    })
  );

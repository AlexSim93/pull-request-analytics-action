import * as core from "@actions/core";

import { octokit } from "../../octokit";

export const getPullRequests = async (amount: number = 10) => {
  const data = [];
  for (let i = 0; i < Math.ceil(amount / 100); i++) {
    const pulls = await octokit.rest.pulls.list({
      owner: core.getInput("GITHUB_OWNER") || process.env.GITHUB_OWNER!,
      repo: core.getInput("GITHUB_REPO") || process.env.GITHUB_REPO!,
      per_page: amount > 100 ? 100 : amount,
      page: i + 1,
      state: "closed",
    });
    data.push(...pulls.data);
  }
  return data;
};

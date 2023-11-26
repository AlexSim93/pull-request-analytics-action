import * as core from "@actions/core";

import { octokit } from "../../octokit";

export const getPullRequestChecks = async (
  commits: string[],
  options?: { skip: boolean }
) =>
  !options?.skip
    ? Promise.allSettled(
        commits.map((item) =>
          octokit.rest.checks.listForRef({
            owner: core.getInput("GITHUB_OWNER") || process.env.GITHUB_OWNER!,
            repo: core.getInput("GITHUB_REPO") || process.env.GITHUB_REPO!,
            per_page: 100,
            page: 1,
            ref: item,
          })
        )
      )
    : [];

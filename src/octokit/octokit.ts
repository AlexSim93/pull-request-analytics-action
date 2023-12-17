import { Octokit } from "octokit";
import * as core from "@actions/core";
import { throttling } from "@octokit/plugin-throttling";

Octokit.plugin(throttling);

export const octokit = new Octokit({
  baseUrl: process.env['GITHUB_API_URL'] || 'https://api.github.com',
  auth: core.getInput("GITHUB_TOKEN") || process.env.GITHUB_TOKEN,
  throttle: {
    onSecondaryRateLimit: (_, options) => {
      octokit.log.error(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
      core.setFailed(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
      throw `SecondaryRateLimit detected for request ${options.method} ${options.url}`;
    },
    onRateLimit: (_, options) => {
      octokit.log.error(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );
      core.setFailed(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );
      throw `Request quota exhausted for request ${options.method} ${options.url}`;
    },
    enabled: true,
  },
});

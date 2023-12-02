import { Octokit } from "octokit";
import * as core from "@actions/core";

export const octokit = new Octokit({
  auth: core.getInput("GITHUB_TOKEN") || process.env.GITHUB_TOKEN,
});

import { Repository } from "./types";

import { octokit } from "../octokit";
import { commonHeaders } from "./constants";

export const getPullRequestDatas = async (
  pullRequestNumbers: number[],
  repository: Repository
) => {
  const { repo, owner } = repository;
  return pullRequestNumbers.map((number) =>
    octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: number,
      headers: commonHeaders,
    })
  );
};

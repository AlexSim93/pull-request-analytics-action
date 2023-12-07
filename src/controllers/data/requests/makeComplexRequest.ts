import { octokit } from "../../octokit";
import { getDataWithThrottle } from "./getDataWithThrottle";
import { getPullRequestChecks } from "./getPullRequestChecks";
import { getPullRequests } from "./getPullRequests";
import { Options, Repository } from "./types";

export const makeComplexRequest = async (
  amount: number = 100,
  repository: Repository,
  options: Options = {
    skipChecks: true,
    skipComments: true,
    skipCommits: true,
    skipReviews: true,
  }
) => {
  const rateLimitAtBeginning = await octokit.rest.rateLimit.get();
  console.log(
    "RATE LIMIT REMAINING BEFORE REQUESTS: ",
    rateLimitAtBeginning.data.rate.remaining
  );
  const pullRequests = await getPullRequests(amount, repository);
  const { skipChecks = true } = options;

  const pullRequestNumbers = pullRequests.map((item) => item.number);

  const { PRs, PREvents, PRComments, PRCommits } = await getDataWithThrottle(
    pullRequestNumbers,
    repository,
    options
  );

  const rateLimitAtEnd = await octokit.rest.rateLimit.get();
  console.log(
    "RATE LIMIT REMAINING AFTER REQUESTS: ",
    rateLimitAtEnd.data.rate.remaining
  );

  const reviews = PREvents.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const pullRequestInfo = PRs.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const comments = PRComments.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const commits = PRCommits.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const commitRefs = PRCommits.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const shas = commitRefs?.flat().map((element) => element?.sha);
  const pullRequestChecks = await getPullRequestChecks(
    shas.filter((element) => typeof element === "string") as string[],
    {
      skip: skipChecks,
    }
  );
  const PRChecks = await Promise.allSettled(pullRequestChecks);
  const checks = PRChecks.map((element) =>
    element.status === "fulfilled"
      ? element.value.status === "fulfilled"
        ? element.value.value.data
        : null
      : null
  );

  return {
    ownerRepo: `${repository.owner}/${repository.repo}`,
    reviews,
    pullRequestInfo,
    commits,
    comments,
    checks,
  };
};

import { octokit } from "../../octokit";
import { getMultipleValuesInput } from "../../utils";
import { getDataWithThrottle } from "./getDataWithThrottle";
import { getPullRequests } from "./getPullRequests";
import { Options, Repository } from "./types";

export const makeComplexRequest = async (
  amount: number = 100,
  repository: Repository,
  options: Options = {
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

  const pullRequestNumbers = pullRequests
    .filter((pr) => {
      const excludeLabels = getMultipleValuesInput("EXCLUDE_LABELS");
      const includeLabels = getMultipleValuesInput("INCLUDE_LABELS");
      const isIncludeLabelsCorrect = includeLabels.length > 0 ? pr.labels.some((label) => includeLabels.includes(label.name)) : true;
      const isExcludeLabelsCorrect = excludeLabels.length > 0 ? !pr.labels.some((label) => excludeLabels.includes(label.name)) : true;
      return isIncludeLabelsCorrect && isExcludeLabelsCorrect;
    })
    .map((item) => item.number);

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

  return {
    ownerRepo: `${repository.owner}/${repository.repo}`,
    reviews,
    pullRequestInfo,
    commits,
    comments,
  };
};

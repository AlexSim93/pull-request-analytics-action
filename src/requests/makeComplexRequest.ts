import { getMultipleValuesInput, getValueAsIs } from "../common/utils";
import { getDataWithThrottle } from "./getDataWithThrottle";
import { getPullRequests } from "./getPullRequests";
import { Options, Repository } from "./types";
import { filterPRs } from "./utils";

export const makeComplexRequest = async (
  amount: number = 100,
  repository: Repository,
  options: Options = {
    skipComments: true,
  }
) => {
  const pullRequests = await getPullRequests(amount, repository);

  const pullRequestNumbers = filterPRs(pullRequests, {
    excludeLabels: getMultipleValuesInput("EXCLUDE_LABELS"),
    includeLabels: getMultipleValuesInput("INCLUDE_LABELS"),
    filterHeadBranchesPattern: getValueAsIs("FILTER_HEAD_BRANCHES"),
    filterBaseBranchesPattern: getValueAsIs("FILTER_BASE_BRANCHES"),
  });

  const { PRs, PREvents, PRComments } = await getDataWithThrottle(
    pullRequestNumbers,
    repository,
    options
  );

  const events = PREvents.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const pullRequestInfo = PRs.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  const comments = PRComments.map((element) =>
    element.status === "fulfilled" ? element.value.data : null
  );

  return {
    ownerRepo: `${repository.owner}/${repository.repo}`,
    events,
    pullRequestInfo,
    comments,
  };
};

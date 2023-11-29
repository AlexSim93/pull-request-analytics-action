import { concurrentLimit } from "./constants";
import { delay } from "./delay";
import { getPullRequestChecks } from "./getPullRequestChecks";
import { getPullRequestComments } from "./getPullRequestComments";
import { getPullRequestCommits } from "./getPullRequestCommits";
import { getPullRequestDatas } from "./getPullRequestData";
import { getPullRequestReviews } from "./getPullRequestReviews";
import { getPullRequests } from "./getPullRequests";

type Options = {
  skipChecks?: boolean;
  skipComments?: boolean;
  skipCommits?: boolean;
  skipReviews?: boolean;
};

export const makeComplexRequest = async (
  amount: number = 10,
  options: Options = {
    skipChecks: true,
    skipComments: true,
    skipCommits: true,
    skipReviews: true,
  }
) => {
  const pullRequests = await getPullRequests(amount);

  const {
    skipChecks = true,
    skipComments = true,
    skipCommits = true,
    skipReviews = true,
  } = options;

  const pullRequestNumbers = pullRequests.map((item) => item.number);

  const PRs = [];
  const PREvents = [];
  let counter = 0;

  while (pullRequestNumbers.length > PRs.length) {
    const startIndex = counter * concurrentLimit;
    const endIndex = (counter + 1) * concurrentLimit;
    const pullRequestNumbersChunks = pullRequestNumbers.slice(
      startIndex,
      endIndex
    );
    const pullRequestDatas = await getPullRequestDatas(
      pullRequestNumbersChunks
    );
    const prs = await Promise.allSettled(pullRequestDatas);

    const pullRequestReviews = await getPullRequestReviews(
      pullRequestNumbersChunks,
      {
        skip: skipReviews,
      }
    );
    const reviews = await Promise.allSettled(pullRequestReviews);
    await delay(5000);
    counter++;
    PRs.push(...prs);
    PREvents.push(...reviews);
  }

  const pullRequestCommits = await getPullRequestCommits(pullRequestNumbers, {
    skip: skipCommits,
  });

  const pullRequestComments = await getPullRequestComments(pullRequestNumbers, {
    skip: skipComments,
  });

  const PRCommits = await Promise.allSettled(pullRequestCommits);
  const PRComments = await Promise.allSettled(pullRequestComments);

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
    reviews,
    pullRequestInfo,
    commits,
    comments,
    checks,
  };
};

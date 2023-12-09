import { concurrentLimit } from "./constants";
import { delay } from "./delay";
import { getPullRequestComments } from "./getPullRequestComments";
import { getPullRequestCommits } from "./getPullRequestCommits";
import { getPullRequestDatas } from "./getPullRequestData";
import { getPullRequestReviews } from "./getPullRequestReviews";
import { Options, Repository } from "./types";

export const getDataWithThrottle = async (
  pullRequestNumbers: number[],
  repository: Repository,
  options: Options
) => {
  const PRs = [];
  const PREvents = [];
  const PRCommits = [];
  const PRComments = [];
  let counter = 0;
  const {
    skipComments = true,
    skipCommits = true,
    skipReviews = true,
  } = options;
  while (pullRequestNumbers.length > PRs.length) {
    const startIndex = counter * concurrentLimit;
    const endIndex = (counter + 1) * concurrentLimit;
    const pullRequestNumbersChunks = pullRequestNumbers.slice(
      startIndex,
      endIndex
    );
    const pullRequestDatas = await getPullRequestDatas(
      pullRequestNumbersChunks,
      repository
    );
    console.log(
      `Batch request #${counter + 1} out of ${Math.ceil(
        pullRequestNumbers.length / concurrentLimit
      )}`
    );
    const prs = await Promise.allSettled(pullRequestDatas);
    await delay(15000);

    const pullRequestReviews = await getPullRequestReviews(
      pullRequestNumbersChunks,
      repository,
      {
        skip: skipReviews,
      }
    );

    const reviews = await Promise.allSettled(pullRequestReviews);
    await delay(15000);
    const pullRequestCommits = await getPullRequestCommits(
      pullRequestNumbers,
      repository,
      {
        skip: skipCommits,
      }
    );
    const commits = await Promise.allSettled(pullRequestCommits);

    const pullRequestComments = await getPullRequestComments(
      pullRequestNumbers,
      repository,
      {
        skip: skipComments,
      }
    );

    const comments = await Promise.allSettled(pullRequestComments);
    await delay(15000);
    counter++;
    PRs.push(...prs);
    PREvents.push(...reviews);
    PRComments.push(...comments);
    PRCommits.push(...commits);
  }
  return { PRs, PREvents, PRCommits, PRComments };
};

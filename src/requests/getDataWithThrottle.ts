import { concurrentLimit } from "./constants";
import { delay } from "./delay";
import { getPullRequestComments } from "./getPullRequestComments";
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
  const PRComments = [];
  let counter = 0;
  const { skipComments = true, skipReviews = true } = options;
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
      )}(${repository.owner}/${repository.repo})`
    );
    const prs = await Promise.allSettled(pullRequestDatas);
    await delay(4000);

    const pullRequestReviews = await getPullRequestReviews(
      pullRequestNumbersChunks,
      repository,
      {
        skip: skipReviews,
      }
    );

    const reviews = await Promise.allSettled(pullRequestReviews);
    await delay(4000);

    const pullRequestComments = await getPullRequestComments(
      pullRequestNumbersChunks,
      repository,
      {
        skip: skipComments,
      }
    );

    const comments = await Promise.allSettled(pullRequestComments);
    await delay(4000);
    counter++;
    PRs.push(...prs);
    PREvents.push(...reviews);
    PRComments.push(...comments);
  }
  return { PRs, PREvents, PRComments };
};

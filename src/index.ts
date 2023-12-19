import "dotenv/config";
import * as core from "@actions/core";

import { createOutput } from "./view";
import { getOwnersRepositories, makeComplexRequest } from "./requests";
import { collectData } from "./converters";
import { octokit } from "./octokit/octokit";
import { checkCommentSkip, setTimezone, validate } from "./common/utils";

async function main() {
  setTimezone();
  const errors = validate();
  if (Object.entries(errors).length > 0) {
    core.setFailed(
      "Inputs are invalid. Action is failed with validation error"
    );
    return;
  }
  const rateLimitAtBeginning = await octokit.rest.rateLimit.get();
  console.log(
    "RATE LIMIT REMAINING BEFORE REQUESTS: ",
    rateLimitAtBeginning.data.rate.remaining
  );

  const ownersRepos = getOwnersRepositories();
  console.log("Initiating data request.");
  const data = [];
  for (let i = 0; i < ownersRepos.length; i++) {
    const result = await makeComplexRequest(
      parseInt(core.getInput("AMOUNT")) || +process.env.AMOUNT!,
      {
        owner: ownersRepos[i][0],
        repo: ownersRepos[i][1],
      },
      {
        skipReviews: false,
        skipComments: checkCommentSkip(),
      }
    );
    data.push(result);
  }

  console.log("Data successfully retrieved. Starting report calculations.");

  const mergedData = data.reduce<
    Awaited<ReturnType<typeof makeComplexRequest>>
  >(
    (acc, element) => ({
      ownerRepo: acc.ownerRepo
        ? acc.ownerRepo.concat(",", element!.ownerRepo)
        : element!.ownerRepo,
      reviews: [...acc.reviews, ...element!.reviews],
      pullRequestInfo: [...acc?.pullRequestInfo, ...element!.pullRequestInfo],
      comments: [...acc?.comments, ...element!.comments],
    }),
    {
      ownerRepo: "",
      reviews: [],
      pullRequestInfo: [],
      comments: [],
    }
  );
  const preparedData = collectData(mergedData);
  console.log("Calculation complete. Generating markdown.");
  await createOutput(preparedData);

  const rateLimitAtEnd = await octokit.rest.rateLimit.get();
  console.log(
    "RATE LIMIT REMAINING AFTER REQUESTS: ",
    rateLimitAtEnd.data.rate.remaining
  );
}

main();

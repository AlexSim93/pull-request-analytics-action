import "dotenv/config";
import * as core from "@actions/core";

import { createOutput } from "./createOutput";
import {
  getOrganizationsRepositories,
  getOwnersRepositories,
  makeComplexRequest,
} from "./requests";
import { collectData } from "./converters";
import {
  checkCommentSkip,
  getValueAsIs,
  setTimezone,
  validate,
} from "./common/utils";
import { getRateLimit } from "./requests/getRateLimit";

async function main() {
  setTimezone();
  core.info("Version 2 has been released. Upgrade to v2 for new features!");
  const errors = validate();
  if (Object.entries(errors).length > 0) {
    core.setFailed(
      "Inputs are invalid. Action is failed with validation error"
    );
    return;
  }
  const rateLimitAtBeginning = await getRateLimit();
  console.log(
    "RATE LIMIT REMAINING BEFORE REQUESTS: ",
    rateLimitAtBeginning.data.rate.remaining
  );

  const ownersRepos = getOwnersRepositories();
  const organizationsRepos = await getOrganizationsRepositories();

  const repos = Object.keys(
    [...ownersRepos, ...organizationsRepos].reduce((acc, element) => {
      return { ...acc, [element.join("/")]: 1 };
    }, {})
  ).map((el) => el.split("/"));

  console.log("Initiating data request.");
  const data = [];
  for (let i = 0; i < repos.length; i++) {
    const result = await makeComplexRequest(
      parseInt(getValueAsIs("AMOUNT")),
      {
        owner: repos[i][0],
        repo: repos[i][1],
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

  const rateLimitAtEnd = await getRateLimit();
  console.log(
    "RATE LIMIT REMAINING AFTER REQUESTS: ",
    rateLimitAtEnd.data.rate.remaining
  );
}

main();

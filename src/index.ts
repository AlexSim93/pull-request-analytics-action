import "dotenv/config";
import * as core from "@actions/core";

import { createMarkdown } from "./view";
import {
  createIssue,
  getOwnersRepositories,
  makeComplexRequest,
} from "./requests";
import { collectData } from "./converters";

async function main() {
  if (process.env.TIMEZONE || core.getInput("TIMEZONE")) {
    process.env.TZ = process.env.TIMEZONE || core.getInput("TIMEZONE");
  }
  if (
    ((!process.env.GITHUB_REPO_FOR_ISSUE ||
      !process.env.GITHUB_OWNER_FOR_ISSUE) &&
      (!core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
        !core.getInput("GITHUB_REPO_FOR_ISSUE"))) ||
    (!core.getInput("GITHUB_OWNERS_REPOS") &&
      !process.env.GITHUB_OWNERS_REPOS) ||
    (!core.getInput("GITHUB_TOKEN") && !process.env.GITHUB_TOKEN)
  ) {
    throw new Error("Missing required variables");
  }

  const ownersRepos = getOwnersRepositories();
  console.log("Initiating data request.");
  const dataByRepos = await Promise.allSettled(
    ownersRepos.map(([owner, repo]) =>
      makeComplexRequest(
        parseInt(core.getInput("AMOUNT")) || +process.env.AMOUNT!,
        {
          owner,
          repo,
        },
        {
          skipReviews: false,
          skipComments: false,
        }
      )
    )
  );
  console.log("Data successfully retrieved. Starting report calculations.");
  const data = dataByRepos
    .map((element) => (element.status === "fulfilled" ? element.value : null))
    .filter((el) => el);

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
  core.setOutput("JSON_COLLECTION", JSON.stringify(preparedData));
  console.log("Calculation complete. Generating markdown.");
  const markdown = createMarkdown(preparedData);
  core.setOutput("MARKDOWN", markdown);
  console.log("Markdown successfully generated.");

  const createIssueFlag =
    core.getInput("CREATE_ISSUE") ||
    process.env.CREATE_ISSUE ||
    `true`;
  if (createIssueFlag === "true") {
    createIssue(markdown);
  }
}

main();

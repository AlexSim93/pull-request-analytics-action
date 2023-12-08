import "dotenv/config";
import * as core from "@actions/core";
import { format } from "date-fns";

import {
  collectData,
  createIssue,
  getOwnersRepositories,
  makeComplexRequest,
} from "./controllers/data";
import { createMarkdown } from "./controllers/view";

async function main() {
  if (
    (!process.env.GITHUB_REPO_FOR_ISSUE ||
      !process.env.GITHUB_OWNER_FOR_ISSUE) &&
    (!core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
      !core.getInput("GITHUB_REPO_FOR_ISSUE"))
  ) {
    throw new Error("Missing environment variables");
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
      commits: [...acc?.commits, ...element!.commits],
    }),
    {
      ownerRepo: "",
      reviews: [],
      pullRequestInfo: [],
      comments: [],
      commits: [],
    }
  );
  const preparedData = collectData(mergedData);
  core.setOutput("JSON_COLLECTION", JSON.stringify(preparedData));
  console.log("Calculation complete. Generating markdown.");
  const markdown = createMarkdown(preparedData);
  console.log("Markdown successfully generated.");
  createIssue(markdown);
}

main();

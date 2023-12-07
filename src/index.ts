import "dotenv/config";
import * as core from "@actions/core";
import { format } from "date-fns";

import {
  collectData,
  getOwnersRepositories,
  makeComplexRequest,
} from "./controllers/data";
import { octokit } from "./controllers/octokit";
import { createMarkdown } from "./controllers/view";

async function main() {
  if (
    (!process.env.GITHUB_REPO_FOR_ISSUE ||
      !process.env.GITHUB_OWNER_FOR_ISSUE ||
      !process.env.GITHUB_REPO ||
      !process.env.GITHUB_OWNER) &&
    (!core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
      !core.getInput("GITHUB_REPO_FOR_ISSUE") ||
      !core.getInput("GITHUB_OWNER") ||
      !core.getInput("GITHUB_REPO"))
  ) {
    throw new Error("Missing environment variables");
  }

  const ownersRepos = getOwnersRepositories();

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

  const data = dataByRepos
    .map((element) => (element.status === "fulfilled" ? element.value : null))
    .filter((el) => el);

  const mergedData = data.reduce<
    Awaited<ReturnType<typeof makeComplexRequest>>
  >(
    (acc, element) => ({
      ownerRepo: acc.ownerRepo.concat(element!.ownerRepo),
      reviews: [...acc.reviews, ...element!.reviews],
      pullRequestInfo: [...acc?.pullRequestInfo, ...element!.pullRequestInfo],
      comments: [...acc?.comments, ...element!.comments],
      commits: [...acc?.commits, ...element!.commits],
      checks: [...acc.checks, ...element!.checks],
    }),
    {
      ownerRepo: "",
      reviews: [],
      pullRequestInfo: [],
      comments: [],
      commits: [],
      checks: [],
    }
  );

  const preparedData = collectData(mergedData);
  core.setOutput("JSON_COLLECTION", JSON.stringify(preparedData));

  const markdown = createMarkdown(preparedData);

  octokit.rest.issues.create({
    repo:
      core.getInput("GITHUB_REPO_FOR_ISSUE") ||
      process.env.GITHUB_REPO_FOR_ISSUE!,
    owner:
      core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
      process.env.GITHUB_OWNER_FOR_ISSUE!,
    title: `Pull requests report(${format(new Date(), "d/MM/yyyy HH:mm")})`,
    body: markdown,
    labels:
      typeof core.getInput("LABEL") === "string" ||
      typeof process.env.LABEL === "string"
        ? [(core.getInput("LABEL") as string) || (process.env.LABEL as string)]
        : [],
    assignee: core.getInput("ASSIGNEE") || process.env.ASSIGNEE,
  });
}

main();

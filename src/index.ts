import "dotenv/config";
import * as core from "@actions/core";
import { format } from "date-fns";

import { collectData, makeComplexRequest } from "./controllers/data";
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
  const data = await makeComplexRequest(
    parseInt(core.getInput("AMOUNT")) || 100,
    {
      skipReviews: false,
    }
  );

  const preparedData = collectData(data);
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
  });
}

main();

import "dotenv/config";

import { collectData, makeComplexRequest } from "./controllers/data";
import { octokit } from "./controllers/octokit";
import { createMarkdown } from "./controllers/view";

async function main() {
  try {
    if (
      !process.env.GITHUB_REPO_FOR_ISSUE ||
      !process.env.GITHUB_OWNER_FOR_ISSUE ||
      !process.env.GITHUB_REPO ||
      !process.env.GITHUB_OWNER
    ) {
      throw new Error("Missing environment variables");
    }
    const data = await makeComplexRequest(10, { skipReviews: false });

    const preparedData = collectData(data);

    const markdown = createMarkdown(preparedData);

    octokit.rest.issues.create({
      repo: process.env.GITHUB_REPO_FOR_ISSUE!,
      owner: process.env.GITHUB_OWNER_FOR_ISSUE!,
      title: "Pull requests report",
      body: markdown,
    });
  } catch (error) {
    console.error(error);
  }
}

main();

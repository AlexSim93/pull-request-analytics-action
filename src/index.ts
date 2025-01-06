import "dotenv/config";
import * as core from "@actions/core";

import { createOutput } from "./createOutput";
import {
  getOrganizationsRepositories,
  getOwnersRepositories,
  makeComplexRequest,
  getTeams,
} from "./requests";
import { collectData } from "./converters";
import {
  checkCommentSkip,
  getOrgs,
  getValueAsIs,
  setTimezone,
} from "./common/utils";
import { getRateLimit } from "./requests/getRateLimit";
import { sendActionError, sendActionRun } from "./analytics";

async function main() {
  try {
    setTimezone();
    sendActionRun();

    try {
      const rateLimitAtBeginning = await getRateLimit();
      console.log(
        "RATE LIMIT REMAINING BEFORE REQUESTS: ",
        rateLimitAtBeginning.data.rate.remaining
      );
    } catch (error) {
      console.log(
        "Rate limit could not be retrieved at the beginning of the action"
      );
    }

    const ownersRepos = getOwnersRepositories();
    const organizationsRepos = await getOrganizationsRepositories();

    const repos = Object.keys(
      [...ownersRepos, ...organizationsRepos].reduce((acc, element) => {
        return { ...acc, [element.join("/")]: 1 };
      }, {})
    ).map((el) => el.split("/"));

    console.log("Initiating data request.");
    const data = [];
    const orgs = getOrgs();

    const teams = await getTeams(orgs);

    for (let i = 0; i < repos.length; i++) {
      const result = await makeComplexRequest(
        parseInt(getValueAsIs("AMOUNT")),
        {
          owner: repos[i][0],
          repo: repos[i][1],
        },
        {
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
        events: [...acc.events, ...element!.events],
        pullRequestInfo: [...acc?.pullRequestInfo, ...element!.pullRequestInfo],
        comments: [...acc?.comments, ...element!.comments],
      }),
      {
        ownerRepo: "",
        events: [],
        pullRequestInfo: [],
        comments: [],
      }
    );
    const preparedData = collectData(mergedData, teams);
    console.log("Calculation complete. Generating markdown.");
    await createOutput(preparedData);

    try {
      const rateLimitAtEnd = await getRateLimit();
      console.log(
        "RATE LIMIT REMAINING AFTER REQUESTS: ",
        rateLimitAtEnd.data.rate.remaining
      );
    } catch (error) {
      console.log("Rate limit could not be retrieved at the end of the action");
    }
  } catch (error) {
    sendActionError(error as Error);
    throw error;
  }
}

main();

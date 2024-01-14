import { octokit } from "../octokit";
import { commonHeaders } from "./constants";

export const getRateLimit = async () =>
  octokit.rest.rateLimit.get({ headers: commonHeaders });

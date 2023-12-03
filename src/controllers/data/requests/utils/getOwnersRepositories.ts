import * as core from "@actions/core";

export const getOwnersRepositories = () => {
  const owner = core.getInput("GITHUB_OWNER") || process.env.GITHUB_OWNER!;
  const repository = core.getInput("GITHUB_REPO") || process.env.GITHUB_REPO!;
  const splittedByComma =
    core.getInput("ADDITIONAL_GITHUB_OWNERS_REPOS") ||
    process.env.ADDITIONAL_GITHUB_OWNERS_REPOS!;
  const ownersRepositories = splittedByComma
    ?.split(",")
    .map((el) => el.trim()?.split("/"))
    .filter(([owner, repository]) => owner && repository);

  return [[owner, repository], ...ownersRepositories];
};

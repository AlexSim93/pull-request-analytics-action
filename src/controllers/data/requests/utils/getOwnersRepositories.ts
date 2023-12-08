import * as core from "@actions/core";

export const getOwnersRepositories = () => {
  const splittedByComma =
    core.getInput("GITHUB_OWNERS_REPOS") || process.env.GITHUB_OWNERS_REPOS!;
  const ownersRepositories = splittedByComma
    ?.split(",")
    .map((el) => el.trim()?.split("/"))
    .filter(([owner, repository]) => owner && repository);

  return ownersRepositories || [];
};

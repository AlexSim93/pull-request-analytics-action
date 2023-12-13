import { getMultipleValuesInput } from "../../common/utils";

export const getOwnersRepositories = () => {
  const ownersRepositories = getMultipleValuesInput("GITHUB_OWNERS_REPOS")
    .map((el) => el.split("/"))
    .filter(([owner, repository]) => owner && repository);

  return ownersRepositories || [];
};

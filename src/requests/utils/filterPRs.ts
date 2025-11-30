export const filterPRs = (
  pullRequests: {
    labels: { name: string }[];
    head: { ref: string };
    base: { ref: string };
    number: number;
  }[],
  {
    excludeLabels,
    includeLabels,
    excludeHeadBranchesPattern,
    includeHeadBranchesPattern,
    excludeBaseBranchesPattern,
    includeBaseBranchesPattern,
  }: {
    excludeLabels: string[];
    includeLabels: string[];
    excludeHeadBranchesPattern: string;
    includeHeadBranchesPattern: string;
    excludeBaseBranchesPattern: string;
    includeBaseBranchesPattern: string;
  }
) => {
  return pullRequests
    .filter((pr) => {
      // Check all exclude conditions first - if any match, exclude the PR
      const hasExcludedLabel =
        excludeLabels.length > 0 &&
        pr.labels.some((label) => excludeLabels.includes(label.name));

      const hasExcludedHeadBranch =
        excludeHeadBranchesPattern.length > 0 &&
        new RegExp(excludeHeadBranchesPattern).test(pr.head.ref);

      const hasExcludedBaseBranch =
        excludeBaseBranchesPattern.length > 0 &&
        new RegExp(excludeBaseBranchesPattern).test(pr.base.ref);

      // If any exclude condition matches, reject the PR immediately
      if (hasExcludedLabel || hasExcludedHeadBranch || hasExcludedBaseBranch) {
        return false;
      }

      if (
        includeLabels.length === 0 &&
        includeBaseBranchesPattern.length === 0 &&
        includeHeadBranchesPattern.length === 0
      ) {
        return true;
      }

      // Check include conditions - ALL specified types must match (AND logic)
      // If include labels are specified, PR must have at least one
      const matchesIncludeLabels =
        includeLabels.length === 0
          ? false
          : pr.labels.some((label) => includeLabels.includes(label.name));

      // If include head branch pattern is specified, PR must match
      const matchesIncludeHeadBranch =
        includeHeadBranchesPattern.length === 0
          ? false
          : new RegExp(includeHeadBranchesPattern).test(pr.head.ref);

      // If include base branch pattern is specified, PR must match
      const matchesIncludeBaseBranch =
        includeBaseBranchesPattern.length === 0
          ? false
          : new RegExp(includeBaseBranchesPattern).test(pr.base.ref);

      // All specified include conditions must be satisfied
      return (
        matchesIncludeLabels ||
        matchesIncludeHeadBranch ||
        matchesIncludeBaseBranch
      );
    })
    .map((item) => item.number);
};

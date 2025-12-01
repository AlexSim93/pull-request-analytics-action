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
    filterHeadBranchesPattern,
    filterBaseBranchesPattern,
  }: {
    excludeLabels: string[];
    includeLabels: string[];
    filterHeadBranchesPattern: string;
    filterBaseBranchesPattern: string;
  }
) => {
  return pullRequests
    .filter((pr) => {
      const isIncludeLabelsCorrect =
        includeLabels.length > 0
          ? pr.labels.some((label) => includeLabels.includes(label.name))
          : true;
      const isExcludeLabelsCorrect =
        excludeLabels.length > 0
          ? !pr.labels.some((label) => excludeLabels.includes(label.name))
          : true;

      const isFilterHeadBranchesCorrect =
        filterHeadBranchesPattern.length > 0
          ? new RegExp(filterHeadBranchesPattern).test(pr.head.ref)
          : true;
      const isFilterBaseBranchesCorrect =
        filterBaseBranchesPattern.length > 0
          ? new RegExp(filterBaseBranchesPattern).test(pr.base.ref)
          : true;

      return (
        isIncludeLabelsCorrect &&
        isExcludeLabelsCorrect &&
        isFilterHeadBranchesCorrect &&
        isFilterBaseBranchesCorrect
      );
    })
    .map((item) => item.number);
};

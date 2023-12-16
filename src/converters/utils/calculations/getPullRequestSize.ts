export type PullRequestSize = "xs" | "s" | "m" | "l" | "xl";

export const getPullRequestSize = (
  additions: number | undefined,
  deletions: number | undefined
): PullRequestSize => {
  const size = (additions || 0) + (deletions || 0) * 0.5;
  if (size <= 50) {
    return "xs";
  }
  if (size <= 200) {
    return "s";
  }
  if (size <= 400) {
    return "m";
  }
  if (size <= 700) {
    return "l";
  }
  return "xl";
};

export const getPullRequestSize = (additions: number, deletions: number) => {
  const size = additions + deletions * 0.5;
  if (size < 50) {
    return "xs";
  }
  if (size < 200) {
    return "s";
  }
  if (size < 400) {
    return "m";
  }
  if (size < 700) {
    return "l";
  }
  return "xl";
};

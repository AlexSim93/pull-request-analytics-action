import { getMultipleValuesInput } from "./getMultipleValuesInput";

export const checkCommentSkip = () => {
  return (
    !getMultipleValuesInput("SHOW_STATS_TYPES").includes(
      "code-review-engagement"
    ) && !getMultipleValuesInput("SHOW_STATS_TYPES").includes("pr-quality")
  );
};

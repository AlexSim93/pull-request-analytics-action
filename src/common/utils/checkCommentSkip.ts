import { showStatsTypes } from "../constants";
import { getMultipleValuesInput } from "./getMultipleValuesInput";

export const checkCommentSkip = () => {
  return ![
    showStatsTypes["pr-quality"],
    showStatsTypes["code-review-engagement"],
  ].some((block) => getMultipleValuesInput("SHOW_STATS_TYPES").includes(block));
};

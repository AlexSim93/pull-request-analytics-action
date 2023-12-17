import * as core from "@actions/core";
import { validateRequired } from "./validators";
import { validateMultipleValues } from "./validators";

export const validate = () => {
  const requiredErrors = validateRequired([
    "GITHUB_TOKEN",
    "GITHUB_OWNERS_REPOS",
    "GITHUB_OWNER_FOR_ISSUE",
    "GITHUB_REPO_FOR_ISSUE",
  ]);

  const { errors: multipleValuesErrors, warnings: multipleValuesWarnings } =
    validateMultipleValues({
      SHOW_STATS_TYPES: {
        validValues: [
          "timeline",
          "workload",
          "pr-quality",
          "code-review-engagement",
        ],
        required: true,
      },
      AGGREGATE_VALUE_METHODS: {
        validValues: ["percentile", "average", "median"],
        required: false,
      },
      EXECUTION_OUTCOME: {
        validValues: ["new-issue", "markdown", "collection"],
        required: true,
      },
    });
  const errors = { ...multipleValuesErrors, ...requiredErrors };
  const warnings = { ...multipleValuesWarnings };
  Object.entries(errors).forEach(([key, message]) => {
    core.error(message as string);
  });
  Object.entries(warnings).forEach(([key, message]) => {
    console.warn(message);
  });
  return errors;
};

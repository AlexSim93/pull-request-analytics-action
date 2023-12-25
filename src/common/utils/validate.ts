import * as core from "@actions/core";
import { validateDate, validateNumber, validateRequired } from "./validators";
import { validateMultipleValues } from "./validators";
import { getMultipleValuesInput } from "./getMultipleValuesInput";
import { getValueAsIs } from "./getValueAsIs";

export const validate = () => {
  const requiredErrors = validateRequired([
    "GITHUB_TOKEN",
    ["GITHUB_OWNERS_REPOS", "ORGANIZATIONS"],
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
        validValues: ["new-issue", "output", "collection", "markdown"],
        required: true,
      },
    });

  const { warnings: numbersWarnings, errors: numbersErrors } = validateNumber({
    AMOUNT: {
      min: 0,
      isCritical:
        !getValueAsIs("REPORT_DATE_START") && !getValueAsIs("REPORT_DATE_END"),
    },
    PERCENTILE: {
      max: 100,
      min: 0,
      isCritical:
        getMultipleValuesInput("AGGREGATE_VALUE_METHODS").length === 1 &&
        getMultipleValuesInput("AGGREGATE_VALUE_METHODS")[0] === "percentile",
    },
    TOP_LIST_AMOUNT: { min: 0, isCritical: false },
  });

  const dateErrors = validateDate();
  const errors = {
    ...multipleValuesErrors,
    ...numbersErrors,
    ...dateErrors,
    ...requiredErrors,
  };
  const warnings = { ...multipleValuesWarnings, ...numbersWarnings };
  Object.values(errors).forEach((message) => {
    core.error(message as string);
  });
  Object.values(warnings).forEach((message) => {
    core.warning(message as string);
  });
  return errors;
};

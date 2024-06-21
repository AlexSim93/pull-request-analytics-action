import * as core from "@actions/core";
import {
  validateDate,
  validateNumber,
  validateRequired,
  validateSingleValue,
} from "./validators";
import { validateMultipleValues } from "./validators";
import { getMultipleValuesInput } from "./getMultipleValuesInput";
import { getValueAsIs } from "./getValueAsIs";

export const validate = () => {
  const requiredErrors = validateRequired([
    "GITHUB_TOKEN",
    ["GITHUB_OWNERS_REPOS", "ORGANIZATIONS"],
    ...(getMultipleValuesInput("EXECUTION_OUTCOME").includes("new-issue") ||
    getMultipleValuesInput("EXECUTION_OUTCOME").includes("existing-issue")
      ? ["GITHUB_OWNER_FOR_ISSUE", "GITHUB_REPO_FOR_ISSUE"]
      : []),
  ]);

  const { errors: multipleValuesErrors, warnings: multipleValuesWarnings } =
    validateMultipleValues({
      SHOW_STATS_TYPES: {
        validValues: [
          "timeline",
          "workload",
          "pr-quality",
          "code-review-engagement",
          "response-time",
        ],
        required: true,
      },
      AGGREGATE_VALUE_METHODS: {
        validValues: ["percentile", "average", "median"],
        required: false,
      },
      EXECUTION_OUTCOME: {
        validValues: ["new-issue", "collection", "markdown", "existing-issue"],
        required: true,
      },
    });

  const { warnings: singleValueWarnings, errors: singleValueErrors } =
    validateSingleValue({
      PERIOD_SPLIT_UNIT: {
        validValues: ["quarters", "none", "months", "years"],
        required: false,
      },
    });

  const { warnings: numbersWarnings, errors: numbersErrors } = validateNumber({
    AMOUNT: {
      min: 0,
      isCritical:
        !getValueAsIs("REPORT_DATE_START") &&
        !getValueAsIs("REPORT_DATE_END") &&
        !getValueAsIs("REPORT_PERIOD"),
    },
    PERCENTILE: {
      max: 100,
      min: 0,
      isCritical:
        getMultipleValuesInput("AGGREGATE_VALUE_METHODS").length === 1 &&
        getMultipleValuesInput("AGGREGATE_VALUE_METHODS")[0] === "percentile",
    },
    ISSUE_NUMBER: {
      min: 1,
      isCritical:
        getMultipleValuesInput("EXECUTION_OUTCOME").length === 1 &&
        getMultipleValuesInput("EXECUTION_OUTCOME")[0] === "existing-issue",
    },
    TOP_LIST_AMOUNT: { min: 0, isCritical: false },
  });

  const dateErrors = validateDate();
  const errors = {
    ...multipleValuesErrors,
    ...numbersErrors,
    ...dateErrors,
    ...singleValueErrors,
    ...requiredErrors,
  };
  const warnings = {
    ...multipleValuesWarnings,
    ...singleValueWarnings,
    ...numbersWarnings,
  };
  Object.values(errors).forEach((message) => {
    core.error(message as string);
  });
  Object.values(warnings).forEach((message) => {
    core.warning(message as string);
  });
  return errors;
};

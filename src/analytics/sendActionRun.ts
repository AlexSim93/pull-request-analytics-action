import Mixpanel from "mixpanel";
import { getMultipleValuesInput, getValueAsIs } from "../common/utils";
import crypto from "crypto";

const mixpanel = Mixpanel.init("8d55eb8bf093d728a0c42616f890bad1");

export const sendActionRun = () => {
  if (getValueAsIs("ALLOW_ANALYTICS") === "true") {
    const nonSensitiveInputs = [
      "SHOW_STATS_TYPES",
      "AMOUNT",
      "REPORT_DATE_START",
      "REPORT_DATE_END",
      "REPORT_PERIOD",
      "CORE_HOURS_START",
      "CORE_HOURS_END",
      "PERCENTILE",
      "TOP_LIST_AMOUNT",
      "EXECUTION_OUTCOME",
      "TIMEZONE",
      "AGGREGATE_VALUE_METHODS",
    ].map((el) => getValueAsIs(el));

    const convertedInputs = [
      "GITHUB_OWNERS_REPOS",
      "ORGANIZATIONS",
      "ISSUE_TITLE",
      "HIDE_USERS",
      "SHOW_USERS",
      "INCLUDE_LABELS",
      "EXCLUDE_LABELS",
    ].map((el) => getValueAsIs(el).length);

    const stringToHash = [...nonSensitiveInputs, ...convertedInputs].join("");

    mixpanel.track("Action run with params", {
      distinct_id: crypto
        .createHash("sha256")
        .update(stringToHash)
        .digest("hex"),
      GITHUB_OWNERS_REPOS: getMultipleValuesInput("GITHUB_OWNERS_REPOS").length,
      ORGANIZATIONS: getMultipleValuesInput("ORGANIZATIONS").length,
      SHOW_STATS_TYPES: getMultipleValuesInput("SHOW_STATS_TYPES"),
      AMOUNT: getValueAsIs("AMOUNT"),
      TIMEZONE: getValueAsIs("TIMEZONE"),
      REPORT_DATE_START: getValueAsIs("REPORT_DATE_START"),
      REPORT_DATE_END: getValueAsIs("REPORT_DATE_END"),
      REPORT_PERIOD: getValueAsIs("REPORT_PERIOD"),
      CORE_HOURS_START: getValueAsIs("CORE_HOURS_START"),
      CORE_HOURS_END: getValueAsIs("CORE_HOURS_END"),
      PERCENTILE: getMultipleValuesInput("PERCENTILE"),
      TOP_LIST_AMOUNT: getValueAsIs("TOP_LIST_AMOUNT"),
      PERIOD_SPLIT_UNIT: getValueAsIs("PERIOD_SPLIT_UNIT"),
      LABELS: getMultipleValuesInput("LABELS").length,
      ASSIGNEES: getMultipleValuesInput("ASSIGNEES").length,
      ISSUE_TITLE: !!getValueAsIs("ISSUE_TITLE"),
      AGGREGATE_VALUE_METHODS: getMultipleValuesInput(
        "AGGREGATE_VALUE_METHODS"
      ),
      HIDE_USERS: getMultipleValuesInput("HIDE_USERS").length,
      SHOW_USERS: getMultipleValuesInput("SHOW_USERS").length,
      INCLUDE_LABELS: getMultipleValuesInput("INCLUDE_LABELS").length,
      EXCLUDE_LABELS: getMultipleValuesInput("EXCLUDE_LABELS").length,
      EXECUTION_OUTCOME: getMultipleValuesInput("EXECUTION_OUTCOME"),
      HOLIDAYS: getMultipleValuesInput("HOLIDAYS").length,
      REVIEW_TIME_INTERVALS: getMultipleValuesInput("REVIEW_TIME_INTERVALS"),
      APPROVAL_TIME_INTERVALS: getMultipleValuesInput(
        "APPROVAL_TIME_INTERVALS"
      ),
      MERGE_TIME_INTERVALS: getMultipleValuesInput("MERGE_TIME_INTERVALS"),
    });
  }
};

import { encrypt, getMultipleValuesInput, getValueAsIs } from "../common/utils";
import { mixpanel } from "./mixpanel";

export const sendActionError = (error: Error) => {
  if (getValueAsIs("ALLOW_ANALYTICS") === "true") {
    mixpanel.track("Action error", {
      distinct_id: encrypt(
        getMultipleValuesInput("ORGANIZATIONS")[0] ||
          getMultipleValuesInput("GITHUB_OWNERS_REPOS")[0].split("/")[0]
      ),
      error: error?.message,
      stack: error?.stack,
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
  } else {
    mixpanel.track("Anonymous action error");
  }
};

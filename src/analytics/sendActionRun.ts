import { encrypt, getMultipleValuesInput, getValueAsIs } from "../common/utils";
import { mixpanel } from "./mixpanel";

export const sendActionRun = () => {
  if (getValueAsIs("ALLOW_ANALYTICS") === "true") {
    mixpanel.track("Action run with params", {
      distinct_id: encrypt(
        getMultipleValuesInput("ORGANIZATIONS")[0] ||
          getMultipleValuesInput("GITHUB_OWNERS_REPOS")[0].split("/")[0]
      ),
      GITHUB_OWNERS_REPOS: getMultipleValuesInput("GITHUB_OWNERS_REPOS").length,
      GITHUB_OWNER_FOR_ISSUE: getValueAsIs("GITHUB_OWNER_FOR_ISSUE")?.length,
      GITHUB_REPO_FOR_ISSUE: getValueAsIs("GITHUB_REPO_FOR_ISSUE")?.length,
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
      INCLUDE_USERS: getMultipleValuesInput("INCLUDE_USERS").length,
      EXCLUDE_USERS: getMultipleValuesInput("EXCLUDE_USERS").length,
      HIDE_USERS: getMultipleValuesInput("HIDE_USERS").length,
      SHOW_USERS: getMultipleValuesInput("SHOW_USERS").length,
      REQUIRED_APPROVALS: getValueAsIs("REQUIRED_APPROVALS"),
      INCLUDE_LABELS: getMultipleValuesInput("INCLUDE_LABELS").length,
      EXCLUDE_LABELS: getMultipleValuesInput("EXCLUDE_LABELS").length,
      EXECUTION_OUTCOME: getMultipleValuesInput("EXECUTION_OUTCOME"),
      WEEKENDS: getMultipleValuesInput("WEEKENDS"),
      HOLIDAYS: getMultipleValuesInput("HOLIDAYS").length,
      REVIEW_TIME_INTERVALS: getMultipleValuesInput("REVIEW_TIME_INTERVALS"),
      APPROVAL_TIME_INTERVALS: getMultipleValuesInput(
        "APPROVAL_TIME_INTERVALS"
      ),
      MERGE_TIME_INTERVALS: getMultipleValuesInput("MERGE_TIME_INTERVALS"),
      USE_CHARTS: getValueAsIs("USE_CHARTS"),
      SHOW_CORRELATION_GRAPHS: getValueAsIs("SHOW_CORRELATION_GRAPHS"),
      SHOW_ACTIVITY_TIME_GRAPHS: getValueAsIs("SHOW_ACTIVITY_TIME_GRAPHS"),
    });
  } else {
    mixpanel.track("Anomymous action run", { distinct_id: "anonymous" });
  }
};

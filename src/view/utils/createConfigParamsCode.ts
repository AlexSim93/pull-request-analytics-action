import { getValueAsIs } from "../../common/utils";

export const createConfigParamsCode = () => {
  return `
Below are the settings applied for this report:
\`\`\`
${[
  "GITHUB_OWNERS_REPOS",
  "ORGANIZATIONS",
  "GITHUB_OWNER_FOR_ISSUE",
  "GITHUB_REPO_FOR_ISSUE",
  "ASSIGNEES",
  "LABELS",
  "SHOW_STATS_TYPES",
  "REVIEW_TIME_INTERVALS",
  "APPROVAL_TIME_INTERVALS",
  "MERGE_TIME_INTERVALS",
  "TOP_LIST_AMOUNT",
  "AGGREGATE_VALUE_METHODS",
  "SHOW_CORRELATION_GRAPHS",
  "SHOW_ACTIVITY_TIME_GRAPHS",
  "REQUIRED_APPROVALS",
  "PERCENTILE",
  "HIDE_USERS",
  "SHOW_USERS",
  "TIMEZONE",
  "CORE_HOURS_START",
  "CORE_HOURS_END",
  "WEEKENDS",
  "HOLIDAYS",
  "REPORT_PERIOD",
  "REPORT_DATE_START",
  "REPORT_DATE_END",
  "AMOUNT",
  "PERIOD_SPLIT_UNIT",
  "USE_CHARTS",
  "INCLUDE_LABELS",
  "EXCLUDE_LABELS",
  "INCLUDE_USERS",
  "EXCLUDE_USERS",
  "EXECUTION_OUTCOME",
  "ISSUE_NUMBER",
]
  .filter((name) => getValueAsIs(name))
  .map((name) => `${name}: ${getValueAsIs(name)}`)
  .join("\n")}
\`\`\`
    `;
};

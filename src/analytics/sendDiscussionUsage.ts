import { encrypt, getMultipleValuesInput, getValueAsIs } from "../common/utils";
import { Collection } from "../converters";
import { mixpanel } from "./mixpanel";

export const sendDiscussionUsage = (
  data: Record<string, Record<string, Collection>>
) => {
  if (getValueAsIs("ALLOW_ANALYTICS") === "true") {
    mixpanel.track("Discussion usage", {
      distinct_id: encrypt(
        getMultipleValuesInput("ORGANIZATIONS")[0] ||
          getMultipleValuesInput("GITHUB_OWNERS_REPOS")[0].split("/")[0]
      ),
      GITHUB_OWNERS_REPOS: getMultipleValuesInput("GITHUB_OWNERS_REPOS").length,
      ORGANIZATIONS: getMultipleValuesInput("ORGANIZATIONS").length,
      SHOW_STATS_TYPES: getMultipleValuesInput("SHOW_STATS_TYPES"),
      AMOUNT: getValueAsIs("AMOUNT"),
      REPORT_DATE_START: getValueAsIs("REPORT_DATE_START"),
      REPORT_DATE_END: getValueAsIs("REPORT_DATE_END"),
      REPORT_PERIOD: getValueAsIs("REPORT_PERIOD"),
      EXECUTION_OUTCOME: getMultipleValuesInput("EXECUTION_OUTCOME"),
      HOLIDAYS: getMultipleValuesInput("HOLIDAYS").length,
      DISCUSSION_USAGE:
        data.total.total.discussions?.received?.total &&
        Object.entries(data.total.total?.discussionsTypes || {}).reduce(
          (acc, type) => acc + (type[1].received?.total || 0),
          0
        ) / (data.total.total.discussions?.received?.total || 0),
      DISCUSSION_AGREED:
        data.total.total.discussions?.received?.agreed &&
        data.total.total.discussions?.received?.total &&
        data.total.total.discussions?.received?.agreed /
          data.total.total.discussions?.received?.total,
      DISCUSSION_DISAGREED:
        data.total.total.discussions?.received?.disagreed &&
        data.total.total.discussions?.received?.total &&
        data.total.total.discussions?.received?.disagreed /
          data.total.total.discussions?.received?.total,
    });
  }
};

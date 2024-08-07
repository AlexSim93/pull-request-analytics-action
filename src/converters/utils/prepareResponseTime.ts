import set from "lodash/set";
import get from "lodash/get";

import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";
import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { calcDifferenceInMinutes, getResponses } from "./calculations";

export const prepareResponseTime = (
  events: any[] | undefined | null = [],
  pullRequest: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  collection: Record<string, Record<string, Collection>>,
  dateKey: string,
  teams: Record<string, string[]>
) => {
  if (!events) return;
  const responses = getResponses(events);

  Object.entries(responses as Record<string, any[][]>).forEach(
    ([user, responses]) => {
      ["total", dateKey].forEach((key) => {
        const timeFromInitialRequestToResponse = calcDifferenceInMinutes(
          responses[0]?.[0],
          responses[0]?.[1],
          {
            endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
            startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
          },
          getMultipleValuesInput("HOLIDAYS")
        );

        const timeFromOpenToResponse = calcDifferenceInMinutes(
          pullRequest?.created_at,
          responses[0]?.[1],
          {
            endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
            startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
          },
          getMultipleValuesInput("HOLIDAYS")
        );

        const timeFromRepeatedRequestToResponse = responses
          .filter((el, index) => index > 0)
          .map((element) =>
            calcDifferenceInMinutes(
              element?.[0],
              element?.[1],
              {
                endOfWorkingTime: getValueAsIs("CORE_HOURS_END"),
                startOfWorkingTime: getValueAsIs("CORE_HOURS_START"),
              },
              getMultipleValuesInput("HOLIDAYS")
            )
          );

        ["total", user, ...(teams[user] || [])].forEach((userKey) => {
          set(collection, [userKey, key], {
            ...get(collection, [userKey, key], {}),
            timeFromInitialRequestToResponse:
              typeof timeFromInitialRequestToResponse === "number"
                ? [
                    ...get(
                      collection,
                      [userKey, key, "timeFromInitialRequestToResponse"],
                      []
                    ),
                    timeFromInitialRequestToResponse,
                  ]
                : get(
                    collection,
                    [userKey, key, "timeFromInitialRequestToResponse"],
                    []
                  ),
            timeFromOpenToResponse:
              typeof timeFromOpenToResponse === "number"
                ? [
                    ...get(
                      collection,
                      [userKey, key, "timeFromOpenToResponse"],
                      []
                    ),
                    timeFromOpenToResponse,
                  ]
                : get(collection, [userKey, key, "timeFromOpenToResponse"], []),
            timeFromRepeatedRequestToResponse: [
              ...get(
                collection,
                [userKey, key, "timeFromRepeatedRequestToResponse"],
                []
              ),
              ...(timeFromRepeatedRequestToResponse.filter(
                (el) => typeof el === "number"
              ) as number[]),
            ],
          });
        });
      });
    }
  );
};

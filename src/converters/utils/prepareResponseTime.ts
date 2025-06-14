import set from "lodash/set";
import get from "lodash/get";

import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";
import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import {
  calcDifferenceInMinutes,
  checkUserInclusive,
  getResponses,
} from "./calculations";
import { invalidUserLogin } from "../constants";

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
  const user = pullRequest?.user.login || invalidUserLogin;
  ["total", user, ...(teams[user] || [])].forEach((userKey) => {
    [dateKey, "total"].forEach((key) => {
      const awaitingResponse = Object.values(
        responses as Record<string, any[][]>
      )
        .reduce((acc, el) => {
          const repeatedResponses = el.filter((_, index) => index > 0);
          return [...acc, ...repeatedResponses];
        }, [])
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
        )
        .filter((el) => typeof el === "number") as number[];
      if (checkUserInclusive(userKey)) {
        set(
          collection,
          [userKey, key, "timeWaitingForRepeatedReview"],
          [
            ...get(
              collection,
              [userKey, key, "timeWaitingForRepeatedReview"],
              []
            ),
            ...awaitingResponse,
          ]
        );
      }
    });
  });

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
          if (checkUserInclusive(userKey)) {
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
                  : get(
                      collection,
                      [userKey, key, "timeFromOpenToResponse"],
                      []
                    ),
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
          }
        });
      });
    }
  );
};

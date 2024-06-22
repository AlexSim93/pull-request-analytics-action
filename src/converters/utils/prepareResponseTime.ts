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
  dateKey: string
) => {
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

        collection[user][key] = {
          ...collection[user][key],
          timeFromInitialRequestToResponse:
            typeof timeFromInitialRequestToResponse === "number"
              ? [
                  ...(collection[user][key].timeFromInitialRequestToResponse ||
                    []),
                  timeFromInitialRequestToResponse,
                ]
              : collection[user][key].timeFromInitialRequestToResponse,
          timeFromOpenToResponse:
            typeof timeFromOpenToResponse === "number"
              ? [
                  ...(collection[user][key].timeFromOpenToResponse || []),
                  timeFromOpenToResponse,
                ]
              : collection[user][key].timeFromOpenToResponse,
          timeFromRepeatedRequestToResponse: [
            ...(collection[user][key].timeFromRepeatedRequestToResponse || []),
            ...(timeFromRepeatedRequestToResponse.filter(
              (el) => typeof el === "number"
            ) as number[]),
          ],
        };
        collection.total[key] = {
          ...collection.total[key],
          timeFromInitialRequestToResponse:
            typeof timeFromInitialRequestToResponse === "number"
              ? [
                  ...(collection.total[key].timeFromInitialRequestToResponse ||
                    []),
                  timeFromInitialRequestToResponse,
                ]
              : collection.total[key].timeFromInitialRequestToResponse,
          timeFromOpenToResponse:
            typeof timeFromOpenToResponse === "number"
              ? [
                  ...(collection.total[key].timeFromOpenToResponse || []),
                  timeFromOpenToResponse,
                ]
              : collection.total[key].timeFromOpenToResponse,
          timeFromRepeatedRequestToResponse: [
            ...(collection.total[key].timeFromRepeatedRequestToResponse || []),
            ...(timeFromRepeatedRequestToResponse.filter(
              (el) => typeof el === "number"
            ) as number[]),
          ],
        };
      });
    }
  );
};

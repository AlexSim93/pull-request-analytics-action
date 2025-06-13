import {
  invalidUserLogin,
  reviewRequestRemoved,
  reviewRequestedTimelineEvent,
  reviewedTimelineEvent,
} from "../../constants";
import { checkUserInclusive } from "./checkUserInclusive";

export const getResponses = (events: any[] | undefined | null = []) => {
  return events?.reduce((acc, event) => {
    if (event.event === reviewRequestedTimelineEvent) {
      const user = event.requested_reviewer?.login || invalidUserLogin;
      if (!checkUserInclusive(user)) {
        return acc;
      }
      return {
        ...acc,
        [user]: [...(acc?.[user] || []), [(event as any)?.created_at]],
      };
    }
    if (event.event === reviewedTimelineEvent) {
      const user = event.user?.login || invalidUserLogin;
      if (!checkUserInclusive(user)) {
        return acc;
      }
      return {
        ...acc,
        [user]: acc[user]?.map((el: any, index: number, arr: any[]) =>
          index === arr.length - 1 && el.length < 2
            ? [el[0], event.submitted_at]
            : el
        ) || [[null, event.submitted_at]],
      };
    }
    if (event.event === reviewRequestRemoved) {
      const user = event.requested_reviewer?.login || invalidUserLogin;
      if (!checkUserInclusive(user)) {
        return acc;
      }
      return {
        ...acc,
        [user]: acc[user].map(
          (el: [string | undefined | null, string | undefined | null]) => [
            el[0],
            null,
          ]
        ),
      };
    }
    return acc;
  }, {});
};

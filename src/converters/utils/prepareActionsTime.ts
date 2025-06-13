import { getHours, parseISO } from "date-fns";
import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { get, set } from "lodash";
import { invalidUserLogin, reviewedTimelineEvent } from "../constants";
import { checkUserInclusive } from "./calculations";

export const prepareActionsTime = (
  pullRequest: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  events: any[] | undefined = [],
  collection: Record<string, Record<string, Collection>>
) => {
  const openingHour = pullRequest?.created_at
    ? getHours(parseISO(pullRequest?.created_at))
    : -1;
  const mergingHour = pullRequest?.merged_at
    ? getHours(parseISO(pullRequest?.merged_at))
    : -1;

  events
    ?.filter((el) => el.event === reviewedTimelineEvent)
    .map((el) => {
      const submitHour = el?.submitted_at
        ? getHours(parseISO(el?.submitted_at))
        : -1;
      const user = el?.user?.login || invalidUserLogin;
      if (submitHour !== -1 && checkUserInclusive(user)) {
        const keys = ["total", "total", "actionsTime", submitHour, el.state];
        set(collection, keys, (get(collection, keys, 0) as number) + 1);
        const userKeys = [user, "total", "actionsTime", submitHour, el.state];
        set(collection, userKeys, (get(collection, userKeys, 0) as number) + 1);
      }
    });
  const prAuthor = pullRequest?.user?.login || invalidUserLogin;
  if (openingHour !== -1 && checkUserInclusive(prAuthor)) {
    const keys = ["total", "total", "actionsTime", openingHour, "opened"];
    set(collection, keys, get(collection, keys, 0) + 1);
    const userKeys = [prAuthor, "total", "actionsTime", openingHour, "opened"];
    set(collection, userKeys, get(collection, userKeys, 0) + 1);
  }
  if (mergingHour !== -1 && checkUserInclusive(prAuthor)) {
    const keys = ["total", "total", "actionsTime", mergingHour, "merged"];
    set(collection, keys, get(collection, keys, 0) + 1);
    const userKeys = [prAuthor, "total", "actionsTime", mergingHour, "merged"];
    set(collection, userKeys, get(collection, userKeys, 0) + 1);
  }
};

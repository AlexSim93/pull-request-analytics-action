import {
  convertToDraftTimelineEvent,
  readyForReviewTimelineEvent,
} from "../../constants";

export const calcDraftTime = (
  createdAt: string | undefined,
  closedAt: string | undefined | null,
  statuses: any[] | undefined = []
): [string, string][] => {
  return statuses.reduce((acc, status, index, arr) => {
    if (index === 0 && status.event === readyForReviewTimelineEvent) {
      return [[createdAt, status.created_at]];
    }
    if (
      index === arr.length - 1 &&
      status.event === convertToDraftTimelineEvent
    ) {
      return [...acc, [status.created_at, closedAt]];
    }
    return status.event === readyForReviewTimelineEvent
      ? [...acc, [arr[index - 1].created_at, status.created_at]]
      : acc;
  }, []);
};

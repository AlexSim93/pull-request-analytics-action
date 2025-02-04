import { calcDraftTime } from "./calcDraftTime";
import {
  convertToDraftTimelineEvent,
  readyForReviewTimelineEvent,
} from "../../constants";

describe("calcDraftTime", () => {
  it("should return an empty array if statuses is empty", () => {
    const result = calcDraftTime(
      "2021-01-01T00:00:00Z",
      "2021-01-02T00:00:00Z",
      []
    );
    expect(result).toEqual([]);
  });

  it("should calculate draft time correctly when there is only one readyForReviewTimelineEvent", () => {
    const statuses = [
      {
        event: readyForReviewTimelineEvent,
        created_at: "2021-01-01T12:00:00Z",
      },
    ];
    const result = calcDraftTime(
      "2021-01-01T00:00:00Z",
      "2021-01-02T00:00:00Z",
      statuses
    );
    expect(result).toEqual([["2021-01-01T00:00:00Z", "2021-01-01T12:00:00Z"]]);
  });

  it("should calculate draft time correctly when there are multiple events", () => {
    const statuses = [
      {
        event: convertToDraftTimelineEvent,
        created_at: "2021-01-01T12:00:00Z",
      },
      {
        event: readyForReviewTimelineEvent,
        created_at: "2021-01-01T14:00:00Z",
      },
      {
        event: convertToDraftTimelineEvent,
        created_at: "2021-01-01T16:00:00Z",
      },
      {
        event: readyForReviewTimelineEvent,
        created_at: "2021-01-01T18:00:00Z",
      },
    ];
    const result = calcDraftTime(
      "2021-01-01T00:00:00Z",
      "2021-01-02T00:00:00Z",
      statuses
    );
    expect(result).toEqual([
      ["2021-01-01T12:00:00Z", "2021-01-01T14:00:00Z"],
      ["2021-01-01T16:00:00Z", "2021-01-01T18:00:00Z"],
    ]);
  });

  it("should include the closedAt time if the last event is convertToDraftTimelineEvent", () => {
    const statuses = [
      {
        event: readyForReviewTimelineEvent,
        created_at: "2021-01-01T12:00:00Z",
      },
      {
        event: convertToDraftTimelineEvent,
        created_at: "2021-01-01T14:00:00Z",
      },
    ];
    const result = calcDraftTime(
      "2021-01-01T00:00:00Z",
      "2021-01-02T00:00:00Z",
      statuses
    );
    expect(result).toEqual([
      ["2021-01-01T00:00:00Z", "2021-01-01T12:00:00Z"],
      ["2021-01-01T14:00:00Z", "2021-01-02T00:00:00Z"],
    ]);
  });

  it("should handle undefined createdAt and closedAt correctly", () => {
    const statuses = [
      {
        event: readyForReviewTimelineEvent,
        created_at: "2021-01-01T12:00:00Z",
      },
      {
        event: convertToDraftTimelineEvent,
        created_at: "2021-01-01T14:00:00Z",
      },
    ];
    const result = calcDraftTime(undefined, undefined, statuses);
    expect(result).toEqual([
      [undefined, "2021-01-01T12:00:00Z"],
      ["2021-01-01T14:00:00Z", undefined],
    ]);
  });
});

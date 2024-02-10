// @ts-nocheck
import { getApproveTime } from "./getApproveTime";

const notReviewed = [];

const approvedReview = [
  {
    state: "approved",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
];

const approvedTwiceReview = [
  {
    state: "approved",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
];

const approvedAfterChangesRequestedReview = [
  {
    state: "changes_requested",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
];

const oneApprovedOneChangesRequestedReview = [
  {
    state: "changes_requested",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev1" },
  },
];

const approvedRequestedChangesApprovedReview = [
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "changes_requested",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-12T09:00:00Z",
    user: { login: "dev2" },
  },
];

const dismissedChangesRequestedReview = [
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "dismissed",
    submitted_at: "2024-01-12T09:00:00Z",
    user: { login: "dev2" },
  },
];

const changesRequestedReview = [
  {
    state: "approved",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "changes_requested",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
];

const commentedReview = [
  {
    state: "commented",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "approved",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
];

describe("check getApproveTime", () => {
  it("Check PR without reviews and return null", () => {
    expect(getApproveTime(notReviewed)).toBe(null);
  });
  it("Check PR with only 1 approval", () => {
    expect(getApproveTime(approvedReview)).toBe("2024-01-11T07:00:00Z");
  });
  it("Check PR with 2 approval and return the earliest one", () => {
    expect(getApproveTime(approvedTwiceReview)).toBe("2024-01-11T07:00:00Z");
  });
  // changes requested included
  it("Check PR with approval after changes requested and return time of approval", () => {
    expect(getApproveTime(approvedAfterChangesRequestedReview)).toBe(
      "2024-01-11T09:00:00Z"
    );
  });
  it("Check PR with changes requested by second developer and approval after it. Should return the last time of approval", () => {
    expect(getApproveTime(oneApprovedOneChangesRequestedReview)).toBe(
      "2024-01-12T05:00:00Z"
    );
  });
  it("Check PR with approval -> changes requested -> approval and return time of the last approve", () => {
    expect(getApproveTime(approvedRequestedChangesApprovedReview)).toBe(
      "2024-01-12T09:00:00Z"
    );
  });
  it("Check PR with dismissed changes requested and return time of the approval", () => {
    expect(getApproveTime(dismissedChangesRequestedReview)).toBe(
      "2024-01-11T09:00:00Z"
    );
  });
  it("Check PR with changes requested and return null", () => {
    expect(getApproveTime(changesRequestedReview)).toBe(null);
  });
  it("Check commented PR and return time of the approval", () => {
    expect(getApproveTime(commentedReview)).toBe("2024-01-12T05:00:00Z");
  });
});

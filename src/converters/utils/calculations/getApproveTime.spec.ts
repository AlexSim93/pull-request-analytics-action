// @ts-nocheck
import { getApproveTime } from "./getApproveTime";

const notReviewed = [];

const approvedReview = [
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
];

const approvedTwiceReview = [
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
];

const approvedAfterChangesRequestedReview = [
  {
    state: "CHANGES_REQUESTED",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
];

const oneApprovedOneChangesRequestedReview = [
  {
    state: "CHANGES_REQUESTED",
    submitted_at: "2024-01-11T07:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "APPROVED",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev1" },
  },
];

const approvedRequestedChangesApprovedReview = [
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "CHANGES_REQUESTED",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "APPROVED",
    submitted_at: "2024-01-12T09:00:00Z",
    user: { login: "dev2" },
  },
];

const dismissedChangesRequestedReview = [
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "CHANGES_REQUESTED",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
  {
    state: "DISMISSED",
    submitted_at: "2024-01-12T09:00:00Z",
    user: { login: "dev2" },
  },
];

const changesRequestedReview = [
  {
    state: "APPROVED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "CHANGES_REQUESTED",
    submitted_at: "2024-01-12T05:00:00Z",
    user: { login: "dev2" },
  },
];

const commentedReview = [
  {
    state: "COMMENTED",
    submitted_at: "2024-01-11T09:00:00Z",
    user: { login: "dev1" },
  },
  {
    state: "APPROVED",
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
  it("Check PR with dismissed changes requested and return time of the last dismiss", () => {
    expect(getApproveTime(dismissedChangesRequestedReview)).toBe(
      "2024-01-12T09:00:00Z"
    );
  });
  it("Check PR with changes requested and return null", () => {
    expect(getApproveTime(changesRequestedReview)).toBe(null);
  });
  it("Check COMMENTED PR and return time of the approval", () => {
    expect(getApproveTime(commentedReview)).toBe("2024-01-12T05:00:00Z");
  });
});

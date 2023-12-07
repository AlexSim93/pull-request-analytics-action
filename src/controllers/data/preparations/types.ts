import { percentile } from "./constants";
type ReviewTypeStats = {
  [key: string]: number;
};

type TimelinePoints = {
  timeToReview?: number;
  timeToApprove?: number;
  timeToMerge?: number;
};

export type Collection = {
  opened: number;
  closed: number;
  additions: number;
  deletions: number;
  merged: number;
  median?: TimelinePoints;
  percentile?: TimelinePoints;
  average?: TimelinePoints;
  timeToReview?: number[];
  timeToApprove?: number[];
  timeToMerge?: number[];
  comments: number;
  totalReviewComments: number;
  discussions?: number;
  reviewComments?: number;
  reviewsConducted?: {
    [key: string]: ReviewTypeStats;
  };
  commentsConducted?: number;
  discussionsConducted?: number;
};

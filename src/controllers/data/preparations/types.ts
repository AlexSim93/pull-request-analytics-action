import { percentile } from './constants';
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
  comments: number;
  reviewComments: number;
  additions: number;
  deletions: number;
  merged: number;
  median?: TimelinePoints;
  percentile?: TimelinePoints;
  average?: TimelinePoints;
  timeToReview?: number[];
  timeToApprove?: number[];
  timeToMerge?: number[];
  providedReviews?: {
    [key: string]: ReviewTypeStats;
  };
};

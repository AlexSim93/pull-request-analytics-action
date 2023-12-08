type ReviewTypeStats = {
  [key: string]: number;
};

type TimelinePoints = {
  timeToReview?: number;
  timeToApprove?: number;
  timeToMerge?: number;
};

type DiscussionResult = {
  total: number;
  agreed: number;
  disagreed: number;
  unresolved: number;
};

type DiscussionType = {
  [key: string]: {
    received: DiscussionResult;
    conducted: DiscussionResult;
  };
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
  discussionsTypes?: DiscussionType;
};

type ReviewTypeStats = {
  [key: string]: number;
};

export type Collection = {
  opened: number;
  closed: number;
  comments: number;
  reviewComments: number;
  additions: number;
  deletions: number;
  merged: number;
  timeToReview?: number[];
  timeToApprove?: number[];
  timeToMerge?: number[];
  timeToReviewAvg?: number;
  timeToApproveAvg?: number;
  timeToMergeAvg?: number;
  timeToReviewMedian?: number;
  timeToApproveMedian?: number;
  timeToMergeMedian?: number;
  timeToReviewP80?: number;
  timeToApproveP80?: number;
  timeToMergeP80?: number;
  providedReviews?: {
    [key: string]: ReviewTypeStats;
  };
};

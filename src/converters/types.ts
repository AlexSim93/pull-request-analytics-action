import { PullRequestSize } from "./utils/calculations/getPullRequestSize";

type ReviewTypeStats = {
  [key: string]: number;
};

type TimelinePoints = {
  timeInDraft?: number;
  timeToReviewRequest?: number;
  timeToReview?: number;
  timeToApprove?: number;
  timeToMerge?: number;
  timeFromInitialRequestToResponse?: number;
  timeFromOpenToResponse?: number;
  timeFromRepeatedRequestToResponse?: number;
};

type DiscussionResult = {
  total: number;
  agreed?: number;
  disagreed?: number;
  unresolved?: number;
};

type DiscussionType = {
  [key: string]: {
    received?: DiscussionResult;
    conducted?: DiscussionResult;
  };
};

type PullRequestTimelineInfo = {
  link?: string;
  title?: string;
  number?: number;
  comments?: number;
  timeToReview: number;
  timeToMerge: number;
  timeToApprove: number;
  sizePoints: number;
  additions: number;
  deletions: number;
};

type Discussion = {
  received?: DiscussionResult;
  conducted?: DiscussionResult;
};

export type Collection = {
  opened?: number;
  closed?: number;
  unreviewed?: number;
  unapproved?: number;
  additions?: number;
  deletions?: number;
  merged?: number;
  median?: TimelinePoints;
  percentile?: TimelinePoints;
  average?: TimelinePoints;
  reviewTimeIntervals?: { [key: string]: number };
  approvalTimeIntervals?: { [key: string]: number };
  mergeTimeIntervals?: { [key: string]: number };
  timeInDraft?: number[];
  timeToReviewRequest?: number[];
  timeToReview?: number[];
  timeToApprove?: number[];
  timeToMerge?: number[];
  timeFromOpenToResponse?: number[];
  timeFromInitialRequestToResponse?: number[];
  timeFromRepeatedRequestToResponse?: number[];
  timeReviewerInDraft?: number[];
  unrespondedRequests?: number;
  comments?: number;
  totalReviewComments?: number;
  reviewComments?: number;
  reviewRequestsConducted?: number;
  reviewsConducted?: {
    [key: string]: ReviewTypeStats;
  };
  reverted?: number;
  commentsConducted?: number;
  discussions?: Discussion;
  discussionsTypes?: DiscussionType;
  prSizes?: string[];
  sizes?: Record<
    string,
    {
      timeToApprove: number[];
      timeToReview: number[];
      timeToMerge: number[];
      percentile: {
        timeToApprove?: number;
        timeToReview?: number;
        timeToMerge?: number;
      };
      average: {
        timeToApprove?: number;
        timeToReview?: number;
        timeToMerge?: number;
      };
      median: {
        timeToApprove?: number;
        timeToReview?: number;
        timeToMerge?: number;
      };
    }
  >;
  reviewsConductedSize?: PullRequestSize[];
  pullRequestsInfo?: PullRequestTimelineInfo[];
};

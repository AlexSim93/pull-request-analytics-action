export type Options = {
  skipChecks?: boolean;
  skipComments?: boolean;
  skipCommits?: boolean;
  skipReviews?: boolean;
};

export type Repository = {
  owner: string;
  repo: string;
};

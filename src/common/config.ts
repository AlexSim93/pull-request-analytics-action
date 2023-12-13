type Project = {
  repo: string;
  owner: string;
};

type CoreHours = {
  start: string;
  end: string;
};

type BlockType = "table" | "Bar";

type StatsType = "time" | "amount" | "conversation";

type Stats = {
  type: StatsType;
  displayType?: BlockType;
};

export type Config = {
  key: string;
  repos: Project[];
  since?: string;
  until?: string;
  amount?: number;
  coreHours?: CoreHours;
  hiddenUsers?: string[];
  excludedUsers?: string[];
  includedUsers?: string[];
  statsTypes?: Stats[];
  splitByLabels?: string[];
  addLabelsToIssue?: string[];
  issueAssignees?: string[];
};

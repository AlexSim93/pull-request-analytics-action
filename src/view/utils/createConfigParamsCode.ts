import * as core from "@actions/core";

export const createConfigParamsCode = () => {
  return `
Below are the settings applied for this report:
\`\`\`
GITHUB_OWNERS_REPOS: ${
    process.env.GITHUB_OWNERS_REPOS || core.getInput("GITHUB_OWNERS_REPOS")
  }
GITHUB_REPO_FOR_ISSUE: ${
    process.env.GITHUB_REPO_FOR_ISSUE || core.getInput("GITHUB_REPO_FOR_ISSUE")
  }
GITHUB_OWNER_FOR_ISSUE: ${
    process.env.GITHUB_OWNER_FOR_ISSUE ||
    core.getInput("GITHUB_OWNER_FOR_ISSUE")
  }
AMOUNT: ${process.env.AMOUNT || core.getInput("AMOUNT")}
TOP_LIST_AMOUNT: ${
    process.env.TOP_LIST_AMOUNT || core.getInput("TOP_LIST_AMOUNT")
  }
CORE_HOURS_START: ${
    process.env.CORE_HOURS_START || core.getInput("CORE_HOURS_START")
  }
CORE_HOURS_END: ${process.env.CORE_HOURS_END || core.getInput("CORE_HOURS_END")}
TIMEZONE: ${process.env.TIMEZONE || core.getInput("TIMEZONE")}
REPORT_DATE_START: ${
    process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START")
  }
REPORT_DATE_END: ${
    process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END")
  }
PERCENTILE: ${process.env.PERCENTILE || core.getInput("PERCENTILE")}
AGGREGATE_VALUE_METHODS: ${
    process.env.AGGREGATE_VALUE_METHODS ||
    core.getInput("AGGREGATE_VALUE_METHODS")
  }
SHOW_STATS_TYPES: ${
    process.env.SHOW_STATS_TYPES || core.getInput("SHOW_STATS_TYPES")
  }
LABELS: ${process.env.LABELS || core.getInput("LABELS")}
ASSIGNEES: ${process.env.ASSIGNEES || core.getInput("ASSIGNEES")}
HIDE_USERS: ${process.env.HIDE_USERS || core.getInput("HIDE_USERS")}
SHOW_USERS: ${process.env.SHOW_USERS || core.getInput("SHOW_USERS")}
INCLUDE_LABELS: ${process.env.INCLUDE_LABELS || core.getInput("INCLUDE_LABELS")}
EXCLUDE_LABELS: ${process.env.EXCLUDE_LABELS || core.getInput("EXCLUDE_LABELS")}
\`\`\`
    `;
};

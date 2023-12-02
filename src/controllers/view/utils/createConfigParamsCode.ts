import * as core from "@actions/core";

export const createConfigParamsCode = () => {
  return `
\`\`\`
GITHUB_REPO: ${process.env.GITHUB_REPO || core.getInput("GITHUB_REPO")}
GITHUB_OWNER: ${process.env.GITHUB_OWNER || core.getInput("GITHUB_OWNER")}
GITHUB_REPO_FOR_ISSUE: ${
    process.env.GITHUB_REPO_FOR_ISSUE || core.getInput("GITHUB_REPO_FOR_ISSUE")
  }
GITHUB_OWNER_FOR_ISSUE: ${
    process.env.GITHUB_OWNER_FOR_ISSUE ||
    core.getInput("GITHUB_OWNER_FOR_ISSUE")
  }
AMOUNT: ${process.env.AMOUNT || core.getInput("AMOUNT")}
CORE_HOURS_START: ${
    process.env.CORE_HOURS_START || core.getInput("CORE_HOURS_START")
  }
CORE_HOURS_END: ${process.env.CORE_HOURS_END || core.getInput("CORE_HOURS_END")}
REPORT_DATE_START: ${
    process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START")
  }
REPORT_DATE_END: ${
    process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END")
  }
PERCENTILE: ${process.env.PERCENTILE || core.getInput("PERCENTILE")}
LABEL: ${process.env.LABEL || core.getInput("LABEL")}
ASSIGNEE: ${process.env.ASSIGNEE || core.getInput("ASSIGNEE")}
\`\`\`
    `;
};

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
START_CORE_HOURS: ${
    process.env.START_CORE_HOURS || core.getInput("START_CORE_HOURS")
  }
END_CORE_HOURS: ${process.env.END_CORE_HOURS || core.getInput("END_CORE_HOURS")}
START_REPORT_DATE: ${
    process.env.START_REPORT_DATE || core.getInput("START_REPORT_DATE")
  }
END_REPORT_DATE: ${
    process.env.END_REPORT_DATE || core.getInput("END_REPORT_DATE")
  }
\`\`\`
    `;
};

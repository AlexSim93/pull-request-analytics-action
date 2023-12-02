import * as core from "@actions/core";
import { isAfter, isBefore, parse, parseISO } from "date-fns";

import { octokit } from "../../octokit";

export const getPullRequests = async (amount: number = 10) => {
  const startReportDate =
    process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START");
  const endReportDate =
    process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END");

  const startDate = startReportDate
    ? parse(startReportDate, "d/MM/yyyy", new Date())
    : null;
  const endDate = endReportDate
    ? parse(endReportDate, "d/MM/yyyy", new Date())
    : null;

  const data = [];
  for (
    let i = 0, dateMatched = !!startDate;
    startDate ? dateMatched : i < Math.ceil(amount / 100);
    i++
  ) {
    const pulls = await octokit.rest.pulls.list({
      owner: core.getInput("GITHUB_OWNER") || process.env.GITHUB_OWNER!,
      repo: core.getInput("GITHUB_REPO") || process.env.GITHUB_REPO!,
      per_page: amount > 100 ? 100 : amount,
      page: i + 1,
      state: "closed",
      sort: "updated",
      direction: "desc",
    });
    if (startDate || endDate) {
      const filteredPulls = pulls.data.filter((pr) => {
        const closedDate = pr.closed_at ? parseISO(pr.closed_at) : null;
        if (closedDate) {
          const isBeforeEndDate = endDate
            ? isBefore(closedDate, endDate)
            : true;
          const isAfterStartDate = startDate
            ? isAfter(closedDate, startDate)
            : true;
          return isBeforeEndDate && isAfterStartDate;
        }
        return false;
      });
      dateMatched = pulls.data.some((pr) =>
        startDate && pr.updated_at
          ? isBefore(startDate, parseISO(pr.updated_at))
          : null
      );
      data.push(...filteredPulls);
    } else {
      data.push(...pulls.data);
    }
  }
  return data;
};

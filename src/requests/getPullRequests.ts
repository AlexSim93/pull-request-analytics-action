import { commonHeaders } from "./constants";
import { isAfter, isBefore, parseISO } from "date-fns";

import { octokit } from "../octokit";
import { getReportDates } from "./utils";
import { Repository } from "./types";

export const getPullRequests = async (
  amount: number = 10,
  repository: Repository
) => {
  const { startDate, endDate } = getReportDates();
  const { owner, repo } = repository;

  const data = [];
  for (
    let i = 0, dateMatched = !!startDate;
    startDate ? dateMatched : i < Math.ceil(amount / 100);
    i++
  ) {
    const pulls = await octokit.rest.pulls.list({
      owner,
      repo,
      per_page: amount > 100 || startDate ? 100 : amount,
      page: i + 1,
      state: "closed",
      sort: "updated",
      direction: "desc",
      headers: commonHeaders,
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
    if (pulls.data.length === 0) {
      break;
    }
  }
  return data;
};

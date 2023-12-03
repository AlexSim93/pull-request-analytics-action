import * as core from "@actions/core";
import { parse } from "date-fns";

export const getReportDates = () => {
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
  return {
    startDate,
    endDate,
  };
};

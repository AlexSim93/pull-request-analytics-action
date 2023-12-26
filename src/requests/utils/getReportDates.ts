import * as core from "@actions/core";
import { parse, sub } from "date-fns";
import { getMultipleValuesInput } from "../../common/utils";

export const getReportDates = () => {
  const startReportDate =
    process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START");
  const endReportDate =
    process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END");
  const subOptions = getMultipleValuesInput("REPORT_PERIOD").reduce(
    (acc, el) => {
      const [key, value] = el.split(":");
      return { ...acc, [key.toLowerCase().trim()]: parseInt(value.trim()) };
    },
    {}
  );
  const startPeriod = getMultipleValuesInput("REPORT_PERIOD")?.length
    ? sub(new Date(), subOptions)
    : null;
  const startReportDateParsed = startReportDate
    ? parse(startReportDate, "d/MM/yyyy", new Date())
    : null;
  const startDate = startReportDateParsed || startPeriod;
  const endDate =
    endReportDate && !startPeriod
      ? parse(endReportDate, "d/MM/yyyy", new Date())
      : null;
  return {
    startDate,
    endDate,
  };
};

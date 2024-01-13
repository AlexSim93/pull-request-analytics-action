import { parse, sub } from "date-fns";
import { getMultipleValuesInput, getValueAsIs } from "../../common/utils";

export const getReportDates = () => {
  const startReportDate = getValueAsIs("REPORT_DATE_START");
  const endReportDate = getValueAsIs("REPORT_DATE_END");
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
  const startDate = startPeriod || startReportDateParsed;
  const endDate =
    endReportDate && !startPeriod
      ? parse(endReportDate, "d/MM/yyyy", new Date())
      : null;
  return {
    startDate,
    endDate,
  };
};

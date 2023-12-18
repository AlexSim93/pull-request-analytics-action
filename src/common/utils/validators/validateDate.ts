import parse from "date-fns/parse";
import { getValueAsIs } from "../getValueAsIs";

export const validateDate = () => {
  const errors = {};
  if (getValueAsIs("REPORT_DATE_START") && getValueAsIs("REPORT_DATE_END")) {
    const startDate = parse(
      getValueAsIs("REPORT_DATE_START"),
      "d/MM/yyyy",
      new Date()
    );
    const endDate = parse(
      getValueAsIs("REPORT_DATE_END"),
      "d/MM/yyyy",
      new Date()
    );
  }
  if (getValueAsIs("CORE_HOURS_START") && getValueAsIs("CORE_HOURS_END")) {
    const startCoreHours = parse(
      getValueAsIs("CORE_HOURS_START"),
      "HH:mm",
      new Date()
    );
    const endCoreHours = parse(
      getValueAsIs("CORE_HOURS_END"),
      "HH:mm",
      new Date()
    );
  }
  return errors;
};

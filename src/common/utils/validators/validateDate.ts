import parse from "date-fns/parse";
import { getValueAsIs } from "../getValueAsIs";
import { isAfter, isValid } from "date-fns";

export const validateDate = () => {
  let errors = {};
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
    if (isAfter(startDate, endDate)) {
      errors = {
        ...errors,
        REPORT_DATE_START: "REPORT_DATE_START is after REPORT_DATE_END",
      };
    }
    if (!isValid(startDate)) {
      errors = {
        ...errors,
        REPORT_DATE_START: "REPORT_DATE_START is invalid",
      };
    }
    if (!isValid(endDate)) {
      errors = {
        ...errors,
        REPORT_DATE_END: "REPORT_DATE_END is invalid",
      };
    }
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
    if (isAfter(startCoreHours, endCoreHours)) {
      errors = {
        ...errors,
        CORE_HOURS_START: "CORE_HOURS_START is after CORE_HOURS_END",
      };
    }
    if (!isValid(startCoreHours)) {
      errors = {
        ...errors,
        CORE_HOURS_START: "CORE_HOURS_START is invalid",
      };
    }
    if (!isValid(endCoreHours)) {
      errors = {
        ...errors,
        CORE_HOURS_END: "CORE_HOURS_END is invalid",
      };
    }
  }
  return errors;
};

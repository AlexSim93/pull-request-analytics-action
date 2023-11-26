import { differenceInMinutes, parseISO } from "date-fns";
import { calcWeekendMinutes } from "./calcWeekendMinutes";
import { calcNonWorkingHours } from "./calcNonWorkingHours";

export const calcDifferenceInMinutes = (
  firstIsoDate?: string | null,
  secondIsoDate?: string | null
) => {
  const firstDate = firstIsoDate ? parseISO(firstIsoDate) : null;
  const secondDate = secondIsoDate ? parseISO(secondIsoDate) : null;
  if (firstDate && secondDate) {
    return (
      differenceInMinutes(secondDate, firstDate) -
      calcWeekendMinutes(firstDate, secondDate) -
      calcNonWorkingHours(firstDate, secondDate)
    );
  }
  return null;
};

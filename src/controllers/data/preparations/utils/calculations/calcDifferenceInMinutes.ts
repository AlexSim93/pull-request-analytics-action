import { differenceInMinutes, parseISO } from "date-fns";
import { calcWeekendMinutes } from "./calcWeekendMinutes";
import { CoreHours, calcNonWorkingHours } from "./calcNonWorkingHours";

export const calcDifferenceInMinutes = (
  firstIsoDate: string | null | undefined,
  secondIsoDate: string | null | undefined,
  coreHours: CoreHours
) => {
  const firstDate = firstIsoDate ? parseISO(firstIsoDate) : null;
  const secondDate = secondIsoDate ? parseISO(secondIsoDate) : null;
  if (firstDate && secondDate) {
    return (
      differenceInMinutes(secondDate, firstDate) -
      calcWeekendMinutes(firstDate, secondDate) -
      (coreHours.startOfWorkingTime && coreHours.endOfWorkingTime
        ? calcNonWorkingHours(firstDate, secondDate, coreHours)
        : 0)
    );
  }
  return null;
};

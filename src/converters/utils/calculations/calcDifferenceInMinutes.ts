import { differenceInMinutes, parseISO, setSeconds } from "date-fns";
import { calcWeekendMinutes } from "./calcWeekendMinutes";
import { CoreHours, calcNonWorkingHours } from "./calcNonWorkingHours";

export const calcDifferenceInMinutes = (
  firstIsoDate: string | null | undefined,
  secondIsoDate: string | null | undefined,
  coreHours: CoreHours,
  holidays?: string[]
) => {
  const firstDate = firstIsoDate ? setSeconds(parseISO(firstIsoDate), 0) : null;
  const secondDate = secondIsoDate
    ? setSeconds(parseISO(secondIsoDate), 0)
    : null;
  if (firstDate && secondDate) {
    return (
      differenceInMinutes(secondDate, firstDate) -
      calcWeekendMinutes(firstDate, secondDate, holidays) -
      (coreHours.startOfWorkingTime && coreHours.endOfWorkingTime
        ? calcNonWorkingHours(firstDate, secondDate, coreHours, holidays)
        : 0)
    );
  }
  return null;
};

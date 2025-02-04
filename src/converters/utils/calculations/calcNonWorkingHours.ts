import {
  differenceInMinutes,
  eachDayOfInterval,
  isBefore,
  setHours,
  setMinutes,
} from "date-fns";
import { isHoliday } from "./isHoliday";
import { checkWeekend } from "./checkWeekend";

export type CoreHours = {
  startOfWorkingTime: string;
  endOfWorkingTime: string;
};

export const calcNonWorkingHours = (
  firstDate: Date,
  secondDate: Date,
  { startOfWorkingTime, endOfWorkingTime }: CoreHours,
  holidays?: string[]
) => {
  const daysOfInterval = eachDayOfInterval({
    start: firstDate,
    end: secondDate,
  });
  const [startHours, startMinutes] = startOfWorkingTime
    .split(":")
    .map((el) => +el);
  const [endHours, endMinutes] = endOfWorkingTime.split(":").map((el) => +el);

  const nonWorkingMinutes = daysOfInterval.reduce((acc, day, index, arr) => {
    const startOfWorkingHours = setMinutes(
      setHours(day, startHours),
      startMinutes
    );
    const endOfWorkingHours = setMinutes(setHours(day, endHours), endMinutes);
    const endOfDay = setMinutes(setHours(day, 23), 59);

    if (checkWeekend(day) || isHoliday(day, holidays)) return acc;
    if (arr.length === 1) {
      if (
        isBefore(secondDate, startOfWorkingHours) ||
        isBefore(endOfWorkingHours, firstDate)
      )
        return acc + differenceInMinutes(secondDate, firstDate);
      const minutesFirstPart = isBefore(firstDate, startOfWorkingHours)
        ? differenceInMinutes(startOfWorkingHours, firstDate)
        : 0;
      const minutesSecondPart = isBefore(endOfWorkingHours, secondDate)
        ? differenceInMinutes(secondDate, endOfWorkingHours)
        : 0;
      return acc + minutesFirstPart + minutesSecondPart;
    }
    if (index === 0) {
      const minutesFirstPart = isBefore(firstDate, startOfWorkingHours)
        ? differenceInMinutes(startOfWorkingHours, firstDate)
        : 0;

      const minutesSecondPart = isBefore(firstDate, endOfWorkingHours)
        ? differenceInMinutes(endOfDay, endOfWorkingHours) + 1
        : differenceInMinutes(endOfDay, firstDate) + 1;
      return acc + minutesFirstPart + minutesSecondPart;
    }

    if (index === arr.length - 1) {
      const minutesFirstPart = isBefore(secondDate, startOfWorkingHours)
        ? differenceInMinutes(secondDate, day)
        : differenceInMinutes(startOfWorkingHours, day);
      const minutesSecondPart = isBefore(secondDate, endOfWorkingHours)
        ? 0
        : differenceInMinutes(secondDate, endOfWorkingHours);
      return acc + minutesFirstPart + minutesSecondPart;
    }
    return (
      acc +
      differenceInMinutes(startOfWorkingHours, day) +
      differenceInMinutes(endOfDay, endOfWorkingHours) +
      1
    );
  }, 0);

  return nonWorkingMinutes;
};

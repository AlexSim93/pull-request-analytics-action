import {
  differenceInMinutes,
  eachDayOfInterval,
  eachWeekendOfInterval,
  isWeekend,
  setHours,
  setMinutes,
} from "date-fns";
import { isHoliday } from "./isHoliday";

export const calcWeekendMinutes = (
  firstDate: Date,
  secondDate: Date,
  holidays?: string[]
) => {
  const weekendsOfInterval = eachWeekendOfInterval({
    start: firstDate,
    end: secondDate,
  });

  const days = eachDayOfInterval({
    start: firstDate,
    end: secondDate,
  });
  const minutesOnHolidays = days.reduce((acc, day) => {
    if (isHoliday(day, holidays) && !isWeekend(day)) return acc + 24 * 60;
    return acc;
  }, 0);
  let minutesInWeekend =
    24 * 60 * weekendsOfInterval.length + (minutesOnHolidays || 0);

  const isStartedAtWeekend = isWeekend(firstDate);

  const isStartedOnHoliday = isHoliday(firstDate, holidays);

  const isEndedAtWeekend = isWeekend(secondDate);

  const isEndedOnHoliday = isHoliday(secondDate, holidays);

  if (isStartedAtWeekend) {
    minutesInWeekend -= differenceInMinutes(firstDate, weekendsOfInterval[0]);
  } else if (isStartedOnHoliday) {
    minutesInWeekend -= differenceInMinutes(firstDate, days[0]);
  }
  if (isEndedAtWeekend) {
    minutesInWeekend -=
      differenceInMinutes(
        setMinutes(
          setHours(weekendsOfInterval[weekendsOfInterval.length - 1], 23),
          59
        ),
        secondDate
      ) + 1;
  } else if (isEndedOnHoliday) {
    minutesInWeekend -=
      differenceInMinutes(
        setMinutes(setHours(days[days.length - 1], 23), 59),
        secondDate
      ) + 1;
  }

  return minutesInWeekend;
};

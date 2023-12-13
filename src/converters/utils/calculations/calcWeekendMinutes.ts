import {
  differenceInMinutes,
  eachWeekendOfInterval,
  isWeekend,
  setHours,
  setMinutes,
} from "date-fns";

export const calcWeekendMinutes = (firstDate: Date, secondDate: Date) => {
  const weekendsOfInterval = eachWeekendOfInterval({
    start: firstDate,
    end: secondDate,
  });
  let minutesInWeekend = 24 * 60 * weekendsOfInterval.length;
  const isStartedAtWeekend = isWeekend(firstDate);
  const isEndedAtWeekend = isWeekend(secondDate);
  if (isStartedAtWeekend) {
    minutesInWeekend -= differenceInMinutes(firstDate, weekendsOfInterval[0]);
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
  }

  return minutesInWeekend;
};

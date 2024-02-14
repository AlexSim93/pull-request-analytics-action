import { isSameDay, parse } from "date-fns";

export const isHoliday = (date: Date, holidays?: string[]) => {
  if (!holidays) return false;
  return holidays.some((holiday) => {
    const holidayDate = parse(holiday, "d/MM/yyyy", new Date());
    return isSameDay(date, holidayDate);
  });
};

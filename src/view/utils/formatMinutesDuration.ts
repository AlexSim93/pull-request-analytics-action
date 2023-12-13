import { formatDuration } from "date-fns";

export const formatMinutesDuration = (minutesDuration: number) => {
  const hours = Math.floor(minutesDuration / 60);
  const minutes = minutesDuration % 60;
  return formatDuration({ hours, minutes }, { format: ["hours", "minutes"] });
};

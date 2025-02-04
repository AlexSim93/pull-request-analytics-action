import { getDay } from "date-fns";
import { getMultipleValuesInput } from "../../../common/utils";

export const checkWeekend = (date: Date | number) => {
    const currentDay = getDay(date);
    const weekends = getMultipleValuesInput('WEEKENDS').map((el) => parseInt(el));
    return weekends.includes(currentDay);
};

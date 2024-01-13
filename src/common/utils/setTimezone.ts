import { getValueAsIs } from "./getValueAsIs";

export const setTimezone = () => {
  const timezone = getValueAsIs("TIMEZONE");
  if (timezone) {
    process.env.TZ = timezone;
  }
};

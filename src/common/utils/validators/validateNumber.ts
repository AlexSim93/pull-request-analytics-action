import { getValueAsIs } from "../getValueAsIs";

type Field = Record<
  string,
  { min?: number; max?: number; isCritical: boolean }
>;
export const validateNumber = (field: Field) => {
  return Object.entries(field).reduce(
    (acc, [key, value]) => {
      const input = getValueAsIs(key);
      const number = parseInt(input);
      if (Number.isNaN(number) && value.isCritical) {
        return {
          ...acc,
          errors: {
            ...acc.errors,
            [key]: `${key} is not a number`,
          },
        };
      }
      const isLessMinValue =
        typeof value.min === "number" && number < value.min;
      const isMoreMaxValue =
        typeof value.max === "number" && number > value.max;
      if (isLessMinValue) {
        return {
          ...acc,
          [value.isCritical ? "errors" : "warnings"]: {
            ...acc[value.isCritical ? "errors" : "warnings"],
            [key]: `${key} should be more than ${value.min}`,
          },
        };
      }
      if (isMoreMaxValue) {
        return {
          ...acc,
          [value.isCritical ? "errors" : "warnings"]: {
            ...acc[value.isCritical ? "errors" : "warnings"],
            [key]: `${key} should be less than ${value.max}`,
          },
        };
      }
      return acc;
    },
    { errors: {}, warnings: {} }
  );
};

import { getValueAsIs } from "..";

type Field = Record<string, { validValues: string[]; required: boolean }>;

export const validateSingleValue = (fields: Field) => {
  return Object.entries(fields).reduce(
    (acc, [key, value]) => {
      const inputValue = getValueAsIs(key);
      if (value.required && !value.validValues.includes(inputValue)) {
        return {
          ...acc,
          errors: {
            ...acc.errors,
            [key]: inputValue ? `${key} is invalid.` : `${key} is empty.`,
          },
        };
      }
      if (!value.required && !value.validValues.includes(inputValue)) {
        return {
          ...acc,
          warnings: {
            ...acc.warnings,
            [key]: inputValue ? `${key} is invalid.` : `${key} is empty.`,
          },
        };
      }
      return acc;
    },
    {
      errors: {},
      warnings: {},
    }
  );
};

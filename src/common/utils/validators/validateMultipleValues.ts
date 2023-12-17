import { getMultipleValuesInput } from "./../getMultipleValuesInput";
type Field = Record<string, { validValues: string[]; required: boolean }>;
export const validateMultipleValues = (fields: Field) => {
  return Object.entries(fields).reduce(
    (acc, [key, value]) => {
      const inputValues = getMultipleValuesInput(key);
      if (inputValues.length === 0) {
        return value.required
          ? {
              ...acc,
              errors: {
                ...acc.errors,
                [key]: `${key} is empty.`,
              },
            }
          : {
              ...acc,
              warnings: {
                ...acc.warnings,
                [key]: `${key} is empty.`,
              },
            };
      }
      if (
        value.required &&
        inputValues.length > 0 &&
        inputValues.every((input) => !value.validValues.includes(input))
      ) {
        return {
          ...acc,
          errors: {
            ...acc.errors,
            [key]: `${key} doesn't contain any valid value. At least one value should be valid.`,
          },
        };
      }

      if (
        value.required === false &&
        inputValues.length > 0 &&
        inputValues.every((input) => !value.validValues.includes(input))
      ) {
        return {
          ...acc,
          warnings: {
            ...acc.warnings,
            [key]: `Some values in ${key} are invalid.`,
          },
        };
      }
      return acc;
    },
    { errors: {}, warnings: {} }
  );
};

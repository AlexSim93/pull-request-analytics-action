import { getValueAsIs } from "../getValueAsIs";

export const validateRequired = (names: string[]) => {
  return names.reduce((acc, name) => {
    const value = getValueAsIs(name);
    if (value) return acc;
    return { ...acc, [name]: `${name} is required` };
  }, {});
};

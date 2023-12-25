import { getValueAsIs } from "../getValueAsIs";

export const validateRequired = (names: (string | string[])[]) => {
  return names.reduce((acc, name) => {
    if (Array.isArray(name)) {
      const isValid = name.some((el) => getValueAsIs(el));
      if (isValid) return acc;
      return { ...acc, [name.join(", ")]: `${name.join(", ")} - One of these inputs must be filled` };
    }
    if (typeof name === "string") {
      const value = getValueAsIs(name);
      if (value) return acc;
      return { ...acc, [name]: `${name} is required` };
    }
    return acc;
  }, {});
};

import { deletionCoefficient } from "./constants";

export const calcPRsize = (
  additions: number | undefined,
  deletions: number | undefined
) => {
  return (additions || 0) + (deletions || 0) * deletionCoefficient;
};

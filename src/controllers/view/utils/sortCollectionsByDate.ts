import { isBefore, parse } from "date-fns";
import { Collection } from "../../data/preparations/types";

export const sortCollectionsByDate = (
  collections: Record<string, Collection>
) =>
  Object.keys(collections)
    .slice()
    .sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return isBefore(parse(a, "M/y", new Date()), parse(b, "M/y", new Date()))
        ? 1
        : -1;
    });

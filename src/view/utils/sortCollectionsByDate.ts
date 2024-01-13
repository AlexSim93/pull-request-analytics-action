import { invalidDate } from './../../converters/constants';
import { isBefore, parse } from "date-fns";
import { Collection } from "../../converters/types";
import { getDateFormat } from "../../common/utils";

export const sortCollectionsByDate = (
  collections: Record<string, Collection>
) =>
  Object.keys(collections)
    .filter((key) => key !== invalidDate)
    .slice()
    .sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return isBefore(
        parse(a, getDateFormat(), new Date()),
        parse(b, getDateFormat(), new Date())
      )
        ? 1
        : -1;
    });

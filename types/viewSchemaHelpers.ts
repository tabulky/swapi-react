import * as v from "valibot";

const RE_SPLIT_COMMA = /,\s*/;

/** Converts a string to a number if possible, otherwise returns the original string. */
export const toNumberOrString = v.pipe(
  v.string(),
  v.transform((str): number | string => {
    const num = Number(str);
    return Number.isNaN(num) ? str : num;
  }),
);

/** Splits a comma-separated string into a trimmed string array. */
export const toStringArray = v.pipe(
  v.string(),
  v.transform((str) => str.split(RE_SPLIT_COMMA).map((s) => s.trim())),
);

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

/**
 * Splits on commas that are NOT followed by a corporate suffix
 * (e.g. "Inc.", "Inc", "Ltd.", "Corp.", "Co.", "LLC", "Incorporated").
 *
 * A trailing `(?!\w)` word-boundary guard ensures suffixes only match as
 * complete words — "Incom Corporation" splits correctly, while
 * "Gallofree Yards, Inc." stays intact.
 *
 * @example
 * "Sienar Fleet Systems, Cygnus Spaceworks"
 * // → ["Sienar Fleet Systems", "Cygnus Spaceworks"]
 *
 * @example
 * "Gallofree Yards, Inc."
 * // → ["Gallofree Yards, Inc."]
 *
 * @example
 * "Alliance Underground Engineering, Incom Corporation"
 * // → ["Alliance Underground Engineering", "Incom Corporation"]
 *
 * @remarks Safe from ReDoS — no nested quantifiers or overlapping alternation.
 */
const RE_SPLIT_COMMA_CORP =
  /,\s*(?!\s*(?:Inc\.?|Ltd\.?|Corp\.?|Co\.?|LLC|Incorporated)(?!\w))/;

/** Splits a comma-separated string into a trimmed string array, preserving corporate suffixes. */
export const toCorpStringArray = v.pipe(
  v.string(),
  v.transform((str) => str.split(RE_SPLIT_COMMA_CORP).map((s) => s.trim())),
);

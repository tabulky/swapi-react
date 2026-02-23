/**
 * Dictionary of special cases for singular forms of plural names.
 */
export const specialSingularForms: Record<string, string> = {
  people: "person",
  species: "species",
};

/**
 * Converts a plural name to its singular form.
 * It handles regular plurals by removing the trailing "s",
 * and also accounts for special cases defined in the `specialSingularForms` object.
 *
 * @param str The plural name to convert.
 * @returns The singular form of the input name.
 */
export const toSingularForm = (str: string) => {
  const specialForm = specialSingularForms[str];
  if (specialForm) {
    return specialForm;
  }
  if (str.endsWith("s")) {
    return str.slice(0, -1);
  }
  return str;
};

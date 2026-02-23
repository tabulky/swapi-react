/**
 * Utility function to convert a string to PascalCase.
 *
 * It splits the input string by underscores, spaces, or hyphens,
 * capitalizes the first letter of each word, and joins them together.
 *
 * @param str The input string to convert.
 * @returns The PascalCase version of the input string.
 */
export const toPascalCase = (str: string) => {
  return str
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

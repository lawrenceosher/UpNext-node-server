/**
 * Validates the input string to ensure it is not undefined or empty
 * @param inputString - The input string to validate
 * @returns - True if the input string is valid, false otherwise
 */
export const isInputStringValid = (inputString) =>
  inputString !== undefined && inputString !== "";

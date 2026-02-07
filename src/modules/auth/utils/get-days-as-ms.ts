
/**
 * Converts a number of days into milliseconds.
 * Validates that the input is a positive integer.
 * @param value - number of days
 * @returns milliseconds
 * @throws Error if value is not a positive integer
 */
export function getDaysAsMs(value: number): number {
  if (!Number.isInteger(value))
    throw new Error(`Invalid input: ${value} is not an integer`);

  if (value <= 0)
    throw new Error(`Invalid input: ${value} must be positive`);


  const msPerDay = 1000 * 60 * 60 * 24;
  return msPerDay * value;
}

export const parseMisUseRange = (range: string | undefined): number => {
  if (!range) return 0;

  // Extract the first number from the range
  const match = range.match(/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  // If no number found (e.g., just "<" or ">"), use 0 or a large number
  if (range.startsWith("<")) return 0;
  if (range.startsWith(">")) return 999999;

  return 0;
};

export interface StatusCounts {
  all: number;
  pending?: number;
  reviewing?: number;
  accepted?: number;
  rejected?: number;
  [key: string]: number | undefined;
}

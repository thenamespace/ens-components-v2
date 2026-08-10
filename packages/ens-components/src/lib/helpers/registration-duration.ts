export const REGISTRATION_SECONDS_PER_DAY = 86_400n;
export const REGISTRATION_SECONDS_PER_YEAR = 365n * REGISTRATION_SECONDS_PER_DAY;
export const MIN_REGISTRATION_DURATION = 28n * REGISTRATION_SECONDS_PER_DAY;
export const DEFAULT_REGISTRATION_DURATION = REGISTRATION_SECONDS_PER_YEAR;

export function parseRegistrationDuration(value: string | undefined): bigint | undefined {
  if (value === undefined) return undefined;

  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}

export function getRegistrationYearCount(duration: bigint, maximumYears: number): number {
  const years = Math.round(Number(duration) / Number(REGISTRATION_SECONDS_PER_YEAR));
  return Math.min(maximumYears, Math.max(1, years));
}

export function formatRegistrationDuration(duration: bigint): string {
  if (duration % REGISTRATION_SECONDS_PER_YEAR === 0n) {
    const years = duration / REGISTRATION_SECONDS_PER_YEAR;
    return `${years} ${years === 1n ? "year" : "years"}`;
  }

  const days = duration / REGISTRATION_SECONDS_PER_DAY;
  return `${days} ${days === 1n ? "day" : "days"}`;
}

export function formatRegistrationTimeRemaining(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

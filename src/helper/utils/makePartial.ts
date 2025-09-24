export function makePartial<T, K extends keyof T>(
  key: K,
  value: T[K]
): Partial<T> {
  // Use type assertion to satisfy TypeScript
  return { [key]: value } as unknown as Partial<T>;
}

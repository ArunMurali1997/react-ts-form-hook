export function getInputValue<T>(
  target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): T[keyof T] {
  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    // If checkbox has a value attribute other than default "on", use it
    if (target.checked) {
      return target.value && target.value !== "on"
        ? (target.value as unknown as T[keyof T])
        : (true as unknown as T[keyof T]);
    } else {
      return false as unknown as T[keyof T];
    }
  }

  // For text, textarea, select, radio, etc.
  return target.value as T[keyof T];
}

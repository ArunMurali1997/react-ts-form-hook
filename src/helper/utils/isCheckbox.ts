function isCheckbox(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement && target.type === "checkbox";
}

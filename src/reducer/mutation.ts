import { FormErrors } from "../types/types";
import { FormAction } from "./formtypes";

export const Types = {
  SET_VALUES: "SET_VALUES",
  SET_ERRORS: "SET_ERRORS",
  RESET_FORM: "RESET_FORM",
  SET_PRISTINE: "SET_PRISTINE",
  SET_VALID: "SET_VALID",
  FORCE_UPDATE: "FORCE_UPDATE",
} as const;

export const patchValues = <T>(payload: Partial<T>): FormAction<T> => ({
  type: Types.SET_VALUES,
  payload: { data: payload },
});

export const setErrors = <T>(payload: FormErrors<T>): FormAction<T> => ({
  type: Types.SET_ERRORS,
  payload: { errors: payload },
});
export const resetFormAction = <T>(): FormAction<T> => ({
  type: Types.RESET_FORM,
});
export const setPristine = <T>(isPristine: boolean): FormAction<T> => ({
  type: Types.SET_PRISTINE,
  payload: { isPristine },
});
export const setValid = <T>(isValid: boolean): FormAction<T> => ({
  type: Types.SET_VALID,
  payload: { isValid },
});
export const forceUpdate = <T>(): FormAction<T> => ({
  type: Types.FORCE_UPDATE,
});

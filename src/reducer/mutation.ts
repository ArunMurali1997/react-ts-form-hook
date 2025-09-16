import { FormErrors } from "../types/types";
import { FormAction } from "./formtypes";

export const Types = {
  UPDATE_VALUES: "UPDATE_VALUES",
  SET_ERRORS: "SET_ERRORS",
  RESET_FORM: "RESET_FORM",
  SET_PRISTINE: "SET_PRISTINE",
  SET_VALID: "SET_VALID",
} as const;

export const updateValues = <T>(payload: Partial<T>): FormAction<T> => ({
  type: Types.UPDATE_VALUES,
  payload: { data: payload },
});

export const setErrors = <T>(payload: FormErrors<T>): FormAction<T> => ({
  type: Types.SET_ERRORS,
  payload: { errors: payload },
});
export const resetForm = <T>(
  initialValues: T,
  initialErrors: FormErrors<T>,
  hasInitialErrors: boolean
): FormAction<T> => ({
  type: Types.RESET_FORM,
  payload: { hasInitialErrors, initialErrors, initialValues },
});
export const setPristine = <T>(isPristine: boolean): FormAction<T> => ({
  type: Types.SET_PRISTINE,
  payload: { isPristine },
});
export const setValid = <T>(isValid: boolean): FormAction<T> => ({
  type: Types.SET_VALID,
  payload: { isValid },
});

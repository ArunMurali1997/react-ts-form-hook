import { FormErrors } from "../types/types";
import { FormAction } from "./formtypes";
import { Types } from "./mutation";

export const updateValues = <T>(payload: Partial<T>): FormAction<T> => ({
  type: Types.UPDATE_VALUES,
  payload: { data: payload },
});

export const setErrors = <T>(payload: FormErrors<T>): FormAction<T> => ({
  type: "SET_ERRORS",
  payload: { errors: payload },
});
export const resetForm = <T>(
  initialValues: T,
  initialErrors: FormErrors<T>,
  hasInitialErrors: boolean
): FormAction<T> => ({
  type: "RESET_FORM",
  payload: { hasInitialErrors, initialErrors, initialValues },
});
export const setPristine = <T>(isPristine: boolean): FormAction<T> => ({
  type: "SET_PRISTINE",
  payload: { isPristine },
});
export const setValid = <T>(isValid: boolean): FormAction<T> => ({
  type: "SET_VALID",
  payload: { isValid },
});

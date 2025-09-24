import { version } from "react";
import { FormErrors } from "../types/types";
import { Types } from "./mutation";
export interface FormState<T> {
  initialValues: T;
  initialErrors: FormErrors<T>;
  hasInitialErrors: boolean;
  values: T;
  errors: FormErrors<T>;
  isPristine: boolean;
  isValid: boolean;
  version: number;
}

export type FormAction<T> =
  | {
      type: typeof Types.SET_VALUES;
      payload: { data: Partial<T>; doValidateCheck?: boolean };
    }
  | { type: typeof Types.SET_ERRORS; payload: { errors: FormErrors<T> } }
  | {
      type: typeof Types.RESET_FORM;
    }
  | { type: typeof Types.SET_PRISTINE; payload: { isPristine: boolean } }
  | { type: typeof Types.SET_VALID; payload: { isValid: boolean } }
  | { type: typeof Types.FORCE_UPDATE };

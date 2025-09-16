import { FormAction, FormState } from "./formtypes";
import { Types } from "./mutation";

export function formReducer<T>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case Types.UPDATE_VALUES:
      return {
        ...state,
        values: { ...state.values, ...action.payload.data },
      };

    case Types.SET_ERRORS:
      return {
        ...state,
        errors: action.payload.errors,
        isValid: Object.keys(action.payload).length === 0,
      };

    case Types.RESET_FORM:
      return {
        ...state,
        values: action.payload.initialValues,
        errors: action.payload.initialErrors,
        isPristine: !action.payload.hasInitialErrors,
        isValid: !action.payload.hasInitialErrors,
      };

    case Types.SET_PRISTINE:
      return {
        ...state,
        isPristine: action.payload.isPristine,
      };

    case Types.SET_VALID:
      return {
        ...state,
        isValid: action.payload.isValid,
      };

    default:
      return state;
  }
}

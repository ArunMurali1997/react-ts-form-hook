import { FormAction, FormState } from "./formtypes";
import { Types } from "./mutation";

export function formReducer<T>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case Types.SET_VALUES:
      return {
        ...state,
        values: { ...state.values, ...action.payload.data },
      };

    case Types.SET_ERRORS: {
      const errors = { ...state.errors, ...action.payload.errors };
      return {
        ...state,
        errors: errors,
        isValid: Object.keys(errors).length === 0,
      };
    }
    case Types.RESET_FORM:
      return {
        ...state,
        values: state.initialValues,
        errors: state.initialErrors,
        isPristine: !state.hasInitialErrors,
        isValid: !state.hasInitialErrors,
        version: state.version + 1,
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
    case Types.FORCE_UPDATE:
      return {
        ...state,
        version: state.version + 1,
      };

    default:
      return state;
  }
}

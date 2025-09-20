import { FormEvent, useCallback, useReducer } from "react";
import { IUseFormProps, FormErrors, FormChangeEvent } from "../types/types";
import { formReducer } from "../reducer/formReducer";
import * as mutation from "../reducer/mutation";

/**
 * Custom React hook for managing forms with validation.
 *
 * @template T - Type representing the shape of your form values.
 * @param {IUseFormProps<T>} props
 * @returns {{
 *   handleChange: (e: FormChangeEvent, doValidateCheck?: boolean) => void,
 *   handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
 *   setValidationErrors: (errors: FormErrors<T>) => void,
 *   bindInput: (name: keyof T, doValidateCheck?: boolean) => {
 *     name: keyof T;
 *     value: string | boolean;
 *     checked?: boolean;
 *     onChange: (e: FormChangeEvent) => void;
 *   },
 *   bindError: (name: keyof T) => { errorMessage?: string },
 *   resetForm: () => void,
 *   updateValues: (updatedValues: T, doValidateCheck?: boolean) => void,
 *   values: T,
 *   errors: FormErrors<T>,
 *   isPristine: boolean,
 *   isValid: boolean
 * }}
 */
export function useForm<T>({
  initialValues,
  initialErrors = {},
  validate,
  onSubmit,
}: IUseFormProps<T>) {
  const hasInitialErrors = Object.keys(initialErrors).length > 0;

  const [state, dispatch] = useReducer(formReducer, {
    initialValues,
    initialErrors,
    hasInitialErrors,
    values: initialValues,
    errors: initialErrors || {},
    isPristine: !hasInitialErrors,
    isValid: !hasInitialErrors,
  });
  /**
   * Run validation function on the current form values.
   *
   * @param {T} form - Current form values.
   * @returns {Promise<boolean>} True if form is valid, false otherwise.
   */
  const doValidate = async (form: T): Promise<boolean> => {
    const validationResult: FormErrors<T> = (await validate?.(form)) ?? {};
    dispatch(mutation.setErrors(validationResult));
    const valid = Object.keys(validationResult).length === 0;
    dispatch(mutation.setValid(valid));
    return valid;
  };

  function isCheckbox(el: EventTarget | null): el is HTMLInputElement {
    return el instanceof HTMLInputElement && el.type === "checkbox";
  }

  /**
   * Handles input changes and triggers optional validation
   * @param {FormChangeEvent} e The change event
   * @param {boolean} [doValidateCheck=true] Whether to validate after change
   */
  const handleChange = (
    e: FormChangeEvent,
    doValidateCheck: boolean = true
  ) => {
    const { name, value } = e.target;
    const newValue = isCheckbox(e.target) ? e.target.checked : value;
    dispatch(mutation.updateValues({ [name]: newValue } as Partial<T>));

    if (doValidateCheck) {
      doValidate({ ...state.values, [name]: newValue });
    }
  };

  /**
   * Updates multiple form values programmatically
   * @param {T} updatedValues Object with updated values
   * @param {boolean} [doValidateCheck=true] Whether to validate after update
   */
  const updateValues = (updatedValues: T, doValidateCheck: boolean = true) => {
    dispatch(mutation.updateValues(updatedValues));
    if (doValidateCheck) doValidate({ ...state.values, ...updatedValues });
  };

  /**
   * Handles form submission
   * @param {FormEvent<HTMLFormElement>} e - Form submit event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (state.isPristine) dispatch(mutation.setPristine(false));

    if (await doValidate(state.values)) {
      onSubmit(state.values);
    }
  };

  /**
   * Return props for binding an input element to the form.
   *
   * @param {keyof T} name - Key of the field in form values.
   * @param {boolean} [doValidateCheck] - Whether to validate on change.
   */
  const bindInput = useCallback(
    (name: keyof T, doValidateCheck?: boolean) => {
      const value = state.values[name];

      if (typeof value === "boolean") {
        return {
          name,
          checked: value,
          onChange: (e: FormChangeEvent) => handleChange(e, doValidateCheck),
        };
      }

      return {
        name,
        value: value as string | number,
        onChange: (e: FormChangeEvent) => handleChange(e, doValidateCheck),
      };
    },
    [state.values]
  );

  /**
   * Binds error message for a field
   * @param {keyof T} name - Key of the field in form values.
   * @returns {object} Error object
   */
  const bindError = useCallback(
    (name: keyof T) => ({
      errorMessage: !state.isPristine ? state.errors[name] : undefined,
    }),
    [state.errors, state.isPristine]
  );

  /**
   * Set validation errors programmatically
   * @param {FormErrors<T>} validationErrors Object with errors
   */
  const setValidationErrors = (validationErrors: FormErrors<T>) => {
    const newErrors = { ...state.errors, ...validationErrors };
    dispatch(mutation.setErrors(newErrors));
    dispatch(mutation.setValid(Object.keys(newErrors).length === 0));
  };

  /**
   * Reset form values and errors to initial state.
   */
  const resetForm = () => {
    dispatch(
      mutation.resetForm(initialValues, initialErrors, hasInitialErrors)
    );
  };

  return {
    handleChange,
    handleSubmit,
    setValidationErrors,
    bindError,
    bindInput,
    resetForm,
    updateValues,
    values: state.values,
    errors: state.errors,
    isPristine: state.isPristine,
    isValid: state.isValid,
  };
}

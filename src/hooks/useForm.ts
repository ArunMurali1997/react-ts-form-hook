import { FormEvent, useCallback, useReducer, useRef, version } from "react";
import {
  IUseFormProps,
  FormErrors,
  FormChangeEvent,
  HandleChangeOptions,
} from "../types/types";
import { formReducer } from "../reducer/formReducer";
import {
  resetFormAction,
  setErrors,
  setPristine,
  setValid,
  patchValues,
  forceUpdate,
} from "../reducer/mutation";
import { isCheckbox } from "../helper/utils/isCheckbox";
import { getInputValue } from "../helper/utils/getInputValue";
import { makePartial } from "../helper/utils/makePartial";

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
export function useForm<T extends Record<string, any>>({
  initialValues,
  initialErrors = {},
  validate,
  onSubmit,
}: IUseFormProps<T>) {
  const hasInitialErrors = Object.keys(initialErrors).length > 0;
  const valuesRef = useRef<T>({ ...initialValues });
  const errorsRef = useRef<FormErrors<T>>({ ...initialErrors });

  const [state, dispatch] = useReducer(formReducer, {
    initialValues,
    initialErrors,
    hasInitialErrors,
    values: initialValues,
    errors: initialErrors || {},
    isPristine: !hasInitialErrors,
    isValid: !hasInitialErrors,
    version: 0,
  });
  const validateId = useRef(0);
  /**
   * Run validation function on the current form values.
   *
   * @param {T} form - Current form values.
   * @returns {Promise<boolean>} True if form is valid, false otherwise.
   */
  const doValidate = useCallback(
    async (form: T): Promise<boolean> => {
      const id = ++validateId.current;
      const validationResult: FormErrors<T> = (await validate?.(form)) ?? {};
      if (id !== validateId.current) return false;
      errorsRef.current = validationResult;
      dispatch(setErrors(validationResult));
      return Object.keys(validationResult).length === 0;
    },
    [validate]
  );

  /**
   * Handles input changes and triggers optional validation
   * @param {FormChangeEvent} e The change event
   * @param {boolean} [doValidateCheck=true] Whether to validate after change
   */
  const handleChange = useCallback(
    async (e: FormChangeEvent, options: HandleChangeOptions<T> = {}) => {
      const { doValidateCheck = true } = options;
      const target = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      const name = target.name as keyof T;
      const newValue = getInputValue(target);
      valuesRef.current[name as keyof T] = newValue;
      dispatch(patchValues(makePartial(name, newValue)));

      if (doValidateCheck && validate) {
        await doValidate(valuesRef.current);
      }
    },
    [doValidate, validate]
  );

  /**
   * Updates multiple form values programmatically
   * @param {T} updatedValues Object with updated values
   * @param {boolean} [doValidateCheck=true] Whether to validate after update
   */
  const updateValues = (
    updatedValues: Partial<T>,
    doValidateCheck: boolean = true
  ) => {
    dispatch(patchValues(updatedValues));
    if (doValidateCheck) doValidate({ ...state.values, ...updatedValues });
  };
  const patchValuesForUser = useCallback(
    async (updatedValues: Partial<T>, doValidateCheck: boolean = true) => {
      valuesRef.current = { ...valuesRef.current, ...updatedValues };
      dispatch(patchValues(updatedValues));
      if (doValidateCheck && validate) await doValidate(valuesRef.current);
    },
    [doValidate, validate]
  );
  const getValuesForUser = useCallback(() => {
    return { ...valuesRef.current };
  }, []);
  /**
   * Handles form submission
   * @param {FormEvent<HTMLFormElement>} e - Form submit event.
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (state.isPristine) dispatch(setPristine(false));

      if (await doValidate(state.values)) {
        onSubmit(state.values);
      }
    },
    [doValidate, onSubmit, state.isPristine]
  );

  /**
   * Return props for binding an input element to the form.
   *
   * @param {keyof T} name - Key of the field in form values.
   * @param {boolean} [doValidateCheck] - Whether to validate on change.
   */
  // ------------------------------
  const bindInput = useCallback(
    (name: keyof T, options: HandleChangeOptions<T>) => {
      const value = valuesRef.current[name];

      if (typeof value === "boolean") {
        return {
          name,
          checked: value,
          onChange: (e: FormChangeEvent) => handleChange(e, options),
        };
      }

      return {
        name,
        value: value as string | number,
        onChange: (e: FormChangeEvent) => handleChange(e, options),
      };
    },
    [handleChange]
  );

  /**
   * Binds error message for a field
   * @param {keyof T} name - Key of the field in form values.
   * @returns {object} Error object
   */
  const bindError = useCallback(
    (name: keyof T) => ({
      errorMessage: !state.isPristine ? errorsRef.current[name] : undefined,
    }),
    [state.isPristine]
  );

  /**
   * Set validation errors programmatically
   * @param {FormErrors<T>} validationErrors Object with errors
   */
  const setValidationErrors = useCallback((validationErrors: FormErrors<T>) => {
    const newErrors = { ...errorsRef.current, ...validationErrors };
    errorsRef.current = newErrors;
    dispatch(setErrors(newErrors));
  }, []);

  /**
   * Reset form values and errors to initial state.
   */
  const resetForm = useCallback(() => {
    valuesRef.current = { ...initialValues };
    errorsRef.current = { ...initialErrors };
    dispatch(resetFormAction());
  }, []);

  return {
    handleChange,
    handleSubmit,
    setValidationErrors,
    bindError,
    bindInput,
    resetForm,
    updateValues,
    setValues: patchValuesForUser, // exposed to user
    getValues: getValuesForUser,
    values: valuesRef.current,
    errors: errorsRef.current,
    isPristine: state.isPristine,
    isValid: state.isValid,
  };
}

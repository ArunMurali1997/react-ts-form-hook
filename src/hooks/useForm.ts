import { FormEvent, useReducer, useState } from "react";
import { IUseFormProps, FormErrors, FormChangeEvent } from "../types/types";
import { formReducer } from "../reducer/formReducer";
import * as mutation from "../reducer/mutation";

export function useForm<T>({
  initialValues,
  initialErrors = {},
  validate,
  onSubmit,
}: IUseFormProps<T>) {
  const hasInitialErrors = initialErrors
    ? Object.keys(initialErrors).length > 0
    : false;
  const [state, dispatch] = useReducer(formReducer, {
    initialValues,
    initialErrors,
    hasInitialErrors,
    values: initialValues,
    errors: initialErrors || {},
    isPristine: !hasInitialErrors,
    isValid: !hasInitialErrors,
  });
  // const [values, setValues] = useState<T>(initialValues);
  // const [errors, setErrors] = useState<FormErrors<T>>({});
  // const [isPristine, setIsPristine] = useState<boolean>(!hasInitialErrors);
  // const [isValid, setIsValid] = useState<boolean>(!hasInitialErrors);

  const doValidate = async (form: T): Promise<boolean> => {
    const validationResult: FormErrors<T> = (await validate?.(form)) ?? {};
    dispatch(mutation.setErrors(validationResult));

    const valid: boolean = Object.keys(validationResult).length === 0;
    dispatch(mutation.setValid(valid));
    return valid;
  };
  function isCheckbox(el: EventTarget | null): el is HTMLInputElement {
    return el instanceof HTMLInputElement && el.type === "checkbox";
  }
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

  const updateValues = (updatedValues: T, doValidateCheck: boolean = true) => {
    dispatch(mutation.updateValues(updatedValues));
    if (doValidateCheck) doValidate({ ...state.values, ...updatedValues });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (state.isPristine) {
      dispatch(mutation.setPristine(false));
    }

    if (await doValidate(state.values)) {
      onSubmit(state.values);
    }
  };

  const bindInput = (name: keyof T, doValidateCheck?: boolean) => {
    return {
      name,
      onChange: (e: FormChangeEvent) => handleChange(e, doValidateCheck),
      value: state.values[name],
      checked:
        typeof state.values[name] === "boolean"
          ? state.values[name]
          : undefined,
    };
  };

  const bindError = (name: keyof T) => {
    return {
      errorMessage: !state.isPristine && state.errors[name],
    };
  };

  const setValidationErrors = (validationErrors: FormErrors<T>) => {
    const newErrors = { ...state.errors, ...validationErrors };
    dispatch(mutation.setErrors(newErrors));
    const valid: boolean = Object.keys(newErrors).length === 0;
    dispatch(mutation.setValid(valid));
  };

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

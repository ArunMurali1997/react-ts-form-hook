import { FormEvent, useState } from "react";
import { IUseFormProps, FormErrors, FormChangeEvent } from "../types/types";

export function useForm<T>({
  initialValues,
  initialErrors,
  validate,
  onSubmit,
}: IUseFormProps<T>) {
  const hasInitialErrors = initialErrors
    ? Object.keys(initialErrors).length > 0
    : false;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isPristine, setIsPristine] = useState<boolean>(!hasInitialErrors);
  const [isValid, setIsValid] = useState<boolean>(!hasInitialErrors);

  const doValidate = async (form: T): Promise<boolean> => {
    const validationResult: FormErrors<T> = (await validate?.(form)) ?? {};
    setErrors(validationResult);

    const valid: boolean = Object.keys(validationResult).length === 0;

    setIsValid(valid);
    return valid;
  };
  function isCheckbox(el: EventTarget | null): el is HTMLInputElement {
    return el instanceof HTMLInputElement && el.type === "checkbox";
  }
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    const newValue = isCheckbox(e.target) ? e.target.checked : value;
    setValues((prev) => {
      const updatedValues = { ...prev, [name]: newValue };
      doValidate(updatedValues);
      return updatedValues;
    });
  };

  const updateValues = (updatedValues: T) => {
    setValues((prev) => {
      const newValues = {
        ...prev,
        ...updatedValues,
      };
      doValidate(newValues);
      return newValues;
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPristine) {
      setIsPristine(false);
    }

    if (await doValidate(values)) {
      onSubmit(values);
    }
  };

  const bindInput = (name: keyof T) => {
    return {
      name,
      onChange: handleChange,
      value: values[name] as unknown as string, // or adjust based on expected input types
    };
  };

  const bindError = (name: keyof T) => {
    return {
      errorMessage: !isPristine && errors[name],
    };
  };

  const setValidationErrors = (validationErrors: FormErrors<T>) => {
    const newErrors = { ...errors, ...validationErrors };
    setErrors(newErrors);
    const valid: boolean = Object.keys(newErrors).length === 0;
    setIsValid(valid);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsValid(!hasInitialErrors);
    setIsPristine(!hasInitialErrors);
  };

  return {
    handleChange,
    handleSubmit,
    setValidationErrors,
    bindError,
    bindInput,
    resetForm,
    updateValues,
    values,
    errors,
    isPristine,
    isValid,
  };
}

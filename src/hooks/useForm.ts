import { ChangeEvent, FormEvent, useState } from "react";
import { IUseFormProps, FormErrors, FormChangeEvent } from "../types/types";

export function useForm<T>({
  initialValues,
  validate,
  onSubmit,
}: IUseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(true);
  function isCheckbox(el: EventTarget | null): el is HTMLInputElement {
    return el instanceof HTMLInputElement && el.type === "checkbox";
  }
  const handleChange = (e: FormChangeEvent) => {
    const { name, value, type } = e.target;
    const newValue = isCheckbox(e.target) ? e.target.checked : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPristine(false);

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      setIsValid(Object.keys(validationErrors).length === 0);
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    } else {
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

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsPristine(true);
    setIsValid(true);
  };
  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    bindError,
    bindInput,
    resetForm,
    isPristine,
    isValid,
    setErrors,
    setValues,
  };
}

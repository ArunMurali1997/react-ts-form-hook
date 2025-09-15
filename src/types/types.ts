import { ChangeEvent, FormEvent } from "react";

// Represents error messages for a form of type T
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type SubmitHandler<T> = (values: T) => void;
export type ValidationFunction<T> = (
  values: T
) => FormErrors<T> | Promise<FormErrors<T>>;

export interface IUseFormProps<T> {
  initialValues: T;
  initialErrors?: FormErrors<T>;
  validate?: ValidationFunction<T>;
  onSubmit: SubmitHandler<T>;
}
export type FormChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>
  | ChangeEvent<HTMLSelectElement>;

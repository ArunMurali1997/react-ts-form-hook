import { ChangeEvent } from "react";

export type ValidationFunction<T> = (
  values: T
) => Partial<Record<keyof T, string>>;
// Represents error messages for a form of type T
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface IUseFormProps<T> {
  initialValues: T;
  validate?: ValidationFunction<T>;
  onSubmit: (values: T) => void;
}
export type FormChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>
  | ChangeEvent<HTMLSelectElement>;

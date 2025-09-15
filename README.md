# react-ts-form-hook

A lightweight and reusable **React + TypeScript** hook for managing form state, validation, and submission easily. This hook simplifies form handling in React projects while leveraging TypeScript for type safety and scalability.

## 📦 Features

- Manages form state (`values`) and validation errors
- Handles input change and form submission
- Provides bindings for input elements and error display
- Supports pristine state tracking and validation status
- Easy to extend and integrate into any React project

## 🚀 Installation

Install the package using `npm` or `pnpm`:

```bash
npm install react-ts-form-hook
```

or

```bash
pnpm add react-ts-form-hook
```

## 🛠 Usage

### Example:

```tsx
import React from "react";
import { useForm } from "react-ts-form-hook";

interface FormData {
  name: string;
  email: string;
  subscribe: boolean;
}

const MyForm = () => {
  const { values, handleSubmit, bindInput, bindError } = useForm<FormData>({
    initialValues: {
      name: "",
      email: "",
      subscribe: false,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" {...bindInput("name")} />
      {bindError("name").errorMessage && (
        <span>{bindError("name").errorMessage}</span>
      )}

      <input type="email" placeholder="Email" {...bindInput("email")} />
      {bindError("email").errorMessage && (
        <span>{bindError("email").errorMessage}</span>
      )}

      <label>
        <input type="checkbox" {...bindInput("subscribe")} />
        Subscribe to newsletter
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

## 📚 API

### `useForm<T>({ initialValues, validate?, onSubmit })`

#### Parameters:

- `initialValues`: An object with default form values.
- `validate`: (Optional) A function that returns an object of validation errors.
- `onSubmit`: A callback function to handle form submission.

#### Returns:

- `values`: The current form values.
- `errors`: The current validation errors.
- `handleChange`: Change event handler for inputs.
- `handleSubmit`: Submit event handler for forms.
- `bindInput`: Helper to bind inputs.
- `bindError`: Helper to access error messages.
- `resetForm`: Reset the form to its initial state.
- `isPristine`: Boolean indicating if the form has been modified.
- `isValid`: Boolean indicating if the form is valid.

## ✅ TypeScript Support

This package is written entirely in TypeScript, ensuring type safety and better developer experience.

Example interface:

```ts
interface MyFormValues {
  username: string;
  password: string;
}
```

Pass this interface to `useForm` as a generic:

```ts
const { values } = useForm<MyFormValues>({ ... });
```

## 🤝 Contributing

Contributions are welcome! If you want to improve this package, feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Submit a pull request

Please make sure to write tests and update documentation where necessary.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

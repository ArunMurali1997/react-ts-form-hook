# react-form-hook

A reusable React hook for handling forms with validation in TypeScript.

## Installation

```bash
pnpm add react-form-hook
```

## Usage

```ts
import { useForm } from "react-form-hook";

const MyForm = () => {
  const { values, handleChange, handleSubmit, errors } = useForm({
    initialValues: { name: "", email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form data:", values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={values.name} onChange={handleChange} />
      <input name="email" value={values.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

import React from 'react';
import { useForm, FormErrors } from 'react-ts-form-hook';

interface LoginForm {
    name: string;
    email: string;
    remember: boolean;
    password: string;
}

const App = () => {
    const initialValues: LoginForm = {
        name: "",
        email: "",
        remember: false,
        password: ""
    };

    const { handleSubmit, bindInput, isPristine, errors, isValid } = useForm<LoginForm>({
        initialValues,
        onSubmit: (values) => {
            console.log("Form submitted:", values);
        },
        validate: (values) => {
            const errors: FormErrors<LoginForm> = {
            };

            if (!values.name.trim()) {
                errors.name = "Name is required.";
            }

            if (!values.email.trim()) {
                errors.email = "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Email is invalid.";
            }

            if (!values.password.trim()) {
                errors.password = "Password is required.";
            } else if (values.password.length < 6) {
                errors.password = "Password must be at least 6 characters.";
            }

            return errors;
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">

                <h2 className="form-title">Register</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text"  {...bindInput('name', false)} placeholder="Enter your name" />
                    {errors.name && (
                        <small className="error">{errors.name}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" {...bindInput('email', false)} placeholder="Enter your email" />
                    {errors.email && (
                        <small className="error">{errors.email}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" autoComplete="current-password" id="password" {...bindInput('password', false)} placeholder="Enter your password" />
                    {errors.password && (
                        <small className="error">{errors.password}</small>
                    )}
                </div>

                <div className="form-group">
                    <input type="checkbox" id="rememberMe" {...bindInput('remember', false)} />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>

                <button type="submit" className="btn-submit" disabled={!isValid && !isPristine}>Submit</button>

            </div>
        </form>
    );
};

export default App;

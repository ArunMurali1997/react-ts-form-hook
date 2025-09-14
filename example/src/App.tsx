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

    const { handleSubmit, bindInput, bindError } = useForm<LoginForm>({
        initialValues,
        onSubmit: (values) => {
            console.log("Form submitted:", values);
        },
        validate: (values) => {
            const errors: FormErrors<LoginForm> = {
                name: "Name is required.",
                email: "Email is invalid.",
                // remember field is optional and not validated with string error message here
                password: "Password is required."
            };

            if (!values.name.trim()) {
                errors.name = "Name is required.";
            } else {
                errors.name = ""
            }

            if (!values.email.trim()) {
                errors.email = "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Email is invalid.";
            }
            else {
                errors.email = ""
            }

            if (!values.password.trim()) {
                errors.password = "Password is required.";
            } else if (values.password.length < 6) {
                errors.password = "Password must be at least 6 characters.";
            } else { errors.password = "" }

            return errors;
        }
    });

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">

                <h2 className="form-title">Register</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" {...bindInput('name')} placeholder="Enter your name" />
                    {bindError('name').errorMessage && (
                        <small className="error">{bindError('name').errorMessage}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" {...bindInput('email')} placeholder="Enter your email" />
                    {bindError('email').errorMessage && (
                        <small className="error">{bindError('email').errorMessage}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" {...bindInput('password')} placeholder="Enter your password" />
                    {bindError('password').errorMessage && (
                        <small className="error">{bindError('password').errorMessage}</small>
                    )}
                </div>

                <div className="form-group">
                    <input type="checkbox" id="rememberMe" {...bindInput('remember')} />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>

                <button type="submit" className="btn-submit">Submit</button>

            </div>
        </form>
    );
};

export default App;

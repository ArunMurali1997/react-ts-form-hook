import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { useForm } from "../hooks/useForm";

interface FormData {
    name: string;
    email: string;
    mobile: string;
    age: number;
    remember: boolean;
}

const initialValues: FormData = {
    name: "",
    email: "",
    mobile: "",
    age: 0,
    remember: false,
};

describe("useForm hook with numbers and mobile", () => {
    it("updates all input types correctly", async () => {
        const TestComponent: React.FC = () => {
            const { bindInput, values } = useForm<FormData>({
                initialValues,
                onSubmit: () => { },
            });

            return (
                <>
                    <input data-testid="name" {...bindInput("name")} />
                    <input data-testid="email" {...bindInput("email")} />
                    <input data-testid="mobile" {...bindInput("mobile")} />
                    <input type="number" data-testid="age" {...bindInput("age")} />
                    <input type="checkbox" data-testid="remember" {...bindInput("remember")} />

                    <span data-testid="output-name">{values.name}</span>
                    <span data-testid="output-email">{values.email}</span>
                    <span data-testid="output-mobile">{values.mobile}</span>
                    <span data-testid="output-age">{values.age}</span>
                    <span data-testid="output-remember">{values.remember ? "true" : "false"}</span>
                </>
            );
        };

        const { getByTestId } = render(<TestComponent />);

        const nameInput = getByTestId("name") as HTMLInputElement;
        const emailInput = getByTestId("email") as HTMLInputElement;
        const mobileInput = getByTestId("mobile") as HTMLInputElement;
        const ageInput = getByTestId("age") as HTMLInputElement;
        const rememberInput = getByTestId("remember") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: "Alice" } });
            fireEvent.change(emailInput, { target: { value: "alice@test.com" } });
            fireEvent.change(mobileInput, { target: { value: "9876543210" } });
            fireEvent.change(ageInput, { target: { value: 25 } }); // will be parsed to number in hook
            fireEvent.click(rememberInput);
        });

        expect(getByTestId("output-name").textContent).toBe("Alice");
        expect(getByTestId("output-email").textContent).toBe("alice@test.com");
        expect(getByTestId("output-mobile").textContent).toBe("9876543210");
        expect(getByTestId("output-age").textContent).toBe("25");
        expect(getByTestId("output-remember").textContent).toBe("true");
    });
});

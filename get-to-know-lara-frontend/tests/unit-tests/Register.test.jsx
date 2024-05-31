import {describe, test, expect} from "vitest";
import {render} from "@testing-library/react";
import Registration from "../../src/Pages/GuestPages/Registration.jsx";

describe('Register component', () => {
    test('renders form fields and submit button', () => {
        render(<Registration/>);

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Sign up'})).toBeInTheDocument();
    })
})
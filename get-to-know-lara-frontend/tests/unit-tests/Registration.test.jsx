import {describe, test, expect, beforeEach} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import Registration from "../../src/Pages/GuestPages/Registration.jsx";
import {BrowserRouter} from "react-router-dom";

describe('Register component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>);
    });


    test('renders form fields and submit button', () => {
        expect(screen.getByLabelText('Name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last name', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Email address', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Password', {exact: true})).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password', {exact: false})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Sign up'})).toBeInTheDocument();
    });

    test('updates form fields correctly', () => {
        const firstNameInput = screen.getByPlaceholderText('First name', {exact: false});
        fireEvent.change(firstNameInput, {target: {value: 'Amy'}});
        expect(firstNameInput.value).toBe('Amy');

        const lastNameInput = screen.getByPlaceholderText('Last name', {exact: false});
        fireEvent.change(lastNameInput, {target: {value: 'Santiago'}});
        expect(lastNameInput.value).toBe('Santiago');

        const emailInput = screen.getByLabelText('Email address', {exact: false});
        fireEvent.change(emailInput, {target: {value: 'santiago@nypd.com'}});
        expect(emailInput.value).toBe('santiago@nypd.com');

        const passwordInput = screen.getByLabelText('Password', {exact: true});
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        expect(passwordInput.value).toBe('password123');

        const passConfInput = screen.getByLabelText('Confirm password', {exact: false});
        fireEvent.change(passConfInput, {target: {value: 'password123'}});
        expect(passConfInput.value).toBe('password123');
    });

    test('shows validation messages for empty fields', () => {
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        expect(screen.getByText('Please, enter your first name', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your family name', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter a valid email address', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your password', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your password again', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for short password', () => {
        const passwordInput = screen.getByLabelText('Password', {exact: true});
        fireEvent.change(passwordInput, {target: {value: '123'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));
        expect(screen.getByText('Password should be at least 6 characters long', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for password without number', () => {
        const passwordInput = screen.getByLabelText('Password', {exact: true});
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));
        expect(screen.getByText('Password should contain a number', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for not matching passwords', () => {
        const passwordInput = screen.getByLabelText('Password', {exact: true});
        const passConfInput = screen.getByLabelText('Confirm password', {exact: false});

        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        fireEvent.change(passConfInput, {target: {value: '123password'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));
        expect((screen.getAllByText('Passwords do not match', {exact: false})).length).toBeGreaterThan(0);
    });
})
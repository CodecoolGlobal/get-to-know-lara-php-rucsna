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


})
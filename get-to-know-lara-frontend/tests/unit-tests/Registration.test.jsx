import {describe, test, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import Registration from "../../src/Pages/GuestPages/Registration.jsx";
import {BrowserRouter} from "react-router-dom";

describe('Register component', () => {
    test('renders form fields and submit button', () => {
        render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>);

        expect(screen.getByLabelText('Name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last name', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Email address', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Password', {exact: true})).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password', {exact: false})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Sign up'})).toBeInTheDocument();
    })
})
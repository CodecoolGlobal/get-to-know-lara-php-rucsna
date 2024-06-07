import {describe, test, expect, beforeEach, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import Registration from "../../src/Pages/GuestPages/Registration.jsx";
import axiosClient from "../../src/axios-client.js";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import Dashboard from "../../src/Pages/UserPages/Dashboard.jsx";
import UserLayout from "../../src/Pages/Layouts/UserLayout.jsx";


vi.mock("../../src/axios-client.js");

describe('Register component', () => {
    beforeEach(() => {
        axiosClient.post.mockReset();
        render(
            <MemoryRouter initialEntries={["/guest/registration"]}>
                <Routes>
                    <Route path="/guest/registration" element={<Registration/>} />
                    <Route path="/" element={<UserLayout/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                </Routes>
            </MemoryRouter>);
    });

    test('renders form fields and submit button', () => {
        // assert
        expect(screen.getByLabelText('Name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First name', {exact: false})).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last name', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Email address', {exact: false})).toBeInTheDocument();
        expect(screen.getByLabelText('Password', {exact: true})).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password', {exact: false})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Sign up'})).toBeInTheDocument();
    });

    test('updates form fields correctly', () => {
        // arrange
        const firstNameInput = screen.getByPlaceholderText('First name', {exact: false});
        const lastNameInput = screen.getByPlaceholderText('Last name', {exact: false});
        const emailInput = screen.getByLabelText('Email address', {exact: false});
        const passwordInput = screen.getByLabelText('Password', {exact: true});
        const passConfInput = screen.getByLabelText('Confirm password', {exact: false});

        // act
        fireEvent.change(firstNameInput, {target: {value: 'Amy'}});
        fireEvent.change(lastNameInput, {target: {value: 'Santiago'}});
        fireEvent.change(emailInput, {target: {value: 'santiago@nypd.com'}});
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        fireEvent.change(passConfInput, {target: {value: 'password123'}});

        // assert
        expect(firstNameInput.value).toBe('Amy');
        expect(lastNameInput.value).toBe('Santiago');
        expect(emailInput.value).toBe('santiago@nypd.com');
        expect(passwordInput.value).toBe('password123');
        expect(passConfInput.value).toBe('password123');
    });

    test('shows validation messages for empty fields', () => {
        // act
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        // assert
        expect(screen.getByText('Please, enter your first name', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your family name', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter a valid email address', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your password', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('Please, enter your password again', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for short password', () => {
        // arrange
        const passwordInput = screen.getByLabelText('Password', {exact: true});

        // act
        fireEvent.change(passwordInput, {target: {value: '123'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        // assert
        expect(screen.getByText('Password should be at least 6 characters long', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for password without number', () => {
        // arrange
        const passwordInput = screen.getByLabelText('Password', {exact: true});

        // act
        fireEvent.change(passwordInput, {target: {value: 'password'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        // assert
        expect(screen.getByText('Password should contain a number', {exact: false})).toBeInTheDocument();
    });

    test('shows validation message for not matching passwords', () => {
        //arrange
        const passwordInput = screen.getByLabelText('Password', {exact: true});
        const passConfInput = screen.getByLabelText('Confirm password', {exact: false});

        // act
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        fireEvent.change(passConfInput, {target: {value: '123password'}});
        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        // assert
        expect((screen.getAllByText('Passwords do not match', {exact: false})).length).toBeGreaterThan(0);
    });

    test('calls submitRegistration on form submission', async () => {
        // arrange
        const newUserPayload = {
            name: 'Amy Santiago',
            email: 'santiago@nypd.com',
            password: 'password123',
            password_confirmation: 'password123'
        };

        const newUserData = {
            id: 1,
            ...newUserPayload
        };

        axiosClient.post.mockResolvedValue({
            data: {
                user: newUserData,
                toke: 'test_token'
            }
        });

        // act
        fireEvent.change(screen.getByPlaceholderText('First name', {exact: false}), {target: {value: 'Amy'}});
        fireEvent.change(screen.getByPlaceholderText('Last name', {exact: false}), {target: {value: 'Santiago'}});
        fireEvent.change(screen.getByLabelText('Email address', {exact: false}), {target: {value: 'santiago@nypd.com'}});
        fireEvent.change(screen.getByLabelText('Password', {exact: true}), {target: {value: 'password123'}});
        fireEvent.change( screen.getByLabelText('Confirm password', {exact: false}), {target: {value: 'password123'}});

        fireEvent.submit(screen.getByRole('button', {name: 'Sign up'}));

        // assert
        await waitFor(() => {
            expect(screen.queryByText('Please, enter your first name', {exact: false})).not.toBeInTheDocument();
            expect(screen.queryByText('Please, enter a valid email address', {exact: false})).not.toBeInTheDocument();
            expect(screen.queryByText('Passwords do not match', {exact: false})).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(axiosClient.post).toHaveBeenCalledWith('/authentication/register', newUserPayload);
        });


        // checking for navigation
        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });
        await waitFor(() => {
            expect(screen.findByText('Amy Santiago', {exact: false})).toBeInTheDocument();
        });
    });
})
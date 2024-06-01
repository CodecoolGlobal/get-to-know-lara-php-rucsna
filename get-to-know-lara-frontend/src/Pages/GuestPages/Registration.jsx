import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import FormContainer from "../../Components/FormContainer.jsx";
import {Button, Col, Form, Row} from "react-bootstrap";
import ErrorToastMessage from "../../Components/ErrorToastMessage.jsx";

const Registration = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConf: ""
    });
    const [errors, setErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {setUser, storeToken} = useStateContext();
    const navigate = useNavigate();


    const handleFieldChange = useCallback((field, value) => {
        setForm(prevForm => ({...prevForm, [field]: value}));
        if (errors[field]) {
            setErrors(prevErrors => ({...prevErrors, [field]: null}));
        }
    }, [errors]);


    const validateForm = () => {
        const {firstName, lastName, email, password, passwordConf} = form;
        const newErrors = {};

        if (firstName.length < 2) {
            newErrors.firstName = "Please, enter your first name";
        }
        if (lastName.length < 2) {
            newErrors.lastName = "Please, enter your family name";
        }
        if (!email) {
            newErrors.email = "Please, enter your email address";
        }
        if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            newErrors.email = "Please, enter a valid email address";
        }
        if (!password) {
            newErrors.password = "Please, enter your password";
        }
        if (password.length > 0 && password.length < 6) {
            newErrors.password = "Password should be at least 6 characters long";
        }
        if (!password.match(/.*[0-9].*/)) {
            newErrors.password = "Password should contain a number";
        }
        if (passwordConf && password !== passwordConf) {
            newErrors.password = "Passwords do not match";
        }
        if (!passwordConf) {
            newErrors.passwordConf = "Please, enter your password again";
        }
        if (password && passwordConf !== password) {
            newErrors.passwordConf = "Passwords do not match";
        }
        return newErrors;
    }


    const submitRegistration = useCallback((event) => {
        event.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const {firstName, lastName, email, password, passwordConf, ...rest} = form;
        const newUser = {
            ...rest,
            name: `${firstName} ${lastName}`,
            email,
            password,
            password_confirmation: passwordConf
        };

        setIsLoading(true);
        axiosClient.post('/authentication/register', newUser)
            .then((response) => {
                console.log(response.data);
                const {user, token} = response.data;
                setUser(user);
                storeToken(token);
                navigate('/dashboard');
            })
            .catch(error => {
                if (error.response) {
                    const {message} = error.response.data;
                    if (message === "The email has already been taken.") {
                        setRegistrationSuccess(false);
                        setToastMessage("This email address is already taken. Please, choose another one.");
                    }
                } else {
                    setRegistrationSuccess(false);
                    setToastMessage("An unexpected error occurred. Please, try again");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [form, navigate, setUser, storeToken]);


    return (
        <FormContainer>
            <fieldset>
                <legend className="text-sm-center fs-5 fst-italic">New on the page? Please, sign up!</legend>

                <Form className="mt-5" onSubmit={submitRegistration} noValidate>
                    <Row>
                        <Form.Group as={Col} controlId="firstName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                className='mb-2'
                                type="text"
                                placeholder="First name"
                                value={form.firstName}
                                onChange={e => handleFieldChange('firstName', e.target.value)}
                                isInvalid={!!errors.firstName}
                                required
                            />
                            <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="lastName">
                            <Form.Label> </Form.Label>
                            <Form.Control
                                className='mb-2'
                                type="text"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={e => handleFieldChange('lastName', e.target.value)}
                                isInvalid={!!errors.lastName}
                                required
                            />
                            <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>


                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            className='mb-2'
                            type="email"
                            value={form.email}
                            onChange={e => handleFieldChange('email', e.target.value)}
                            isInvalid={!!errors.email}
                            required
                        />
                        <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className='mb-2'
                            type="password"
                            value={form.password}
                            onChange={e => handleFieldChange('password', e.target.value)}
                            isInvalid={!!errors.password}
                            required
                        />
                        <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            className='mb-2'
                            type="password"
                            value={form.passwordConf}
                            onChange={e => handleFieldChange('passwordConf', e.target.value)}
                            isInvalid={!!errors.passwordConf}
                            required
                        />
                        <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                            {errors.passwordConf}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {!registrationSuccess &&
                        <ErrorToastMessage toastHeader={"Registration failed"} toastMessage={toastMessage}/>
                    }
                    <Button variant="secondary" type="submit">
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </Button>
                </Form>
            </fieldset>
        </FormContainer>
    )
}

export default Registration;
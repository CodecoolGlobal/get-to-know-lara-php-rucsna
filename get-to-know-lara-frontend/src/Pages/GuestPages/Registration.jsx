import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import FormContainer from "../../Components/FormContainer.jsx";
import {Button, Col, Form, Row} from "react-bootstrap";

const Registration = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfError, setPasswordConfError] = useState("");

    const { setUser, storeToken } = useStateContext();
    const navigate = useNavigate();

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        if(!firstName || firstName.length < 2){
            setFirstNameError("Please, enter your first name");
        } else {
            setFirstNameError("");
        }
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        if(!lastName || lastName.length < 2){
            setLastNameError("Please, enter your family name");
        } else {
            setLastNameError("");
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if(email && email.length < 7){
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    }
    const handlePasswordChange = (event) => {
        const currentPassword = event.target.value;
        setPassword(currentPassword);

        console.log("PASS", currentPassword);
        if(password && password.length < 6){
            setPasswordError("Password should be at least 6 characters long");
        } else if(!password.match(/.*[0-9].*/)){
            setPasswordError("Password should contain a number");
        } else {
            setPasswordError("");
        }
        if(passwordConf && passwordConf !== currentPassword){
            setPasswordError("Password and Password confirm should match");
        }
    }

    const handlePasswordConfirmChange = (event) => {
        const currentPasswordConf = event.target.value;
        setPasswordConf(currentPasswordConf);

        console.log("curr-PASS", currentPasswordConf);
        console.log("password-", password);
        if(currentPasswordConf !== password){
            setPasswordConfError("Password and Password confirm should match");
        } else {
            setPasswordConfError("");
        }
    }

    const submitRegistration = async (event) => {
        event.preventDefault();

        const newUser = {
            name: `${firstName} ${lastName}`,
            email: email,
            password: password,
            password_confirmation: passwordConf
        };
        console.log(newUser);

        try {
            const { data } = await axiosClient.post('/authentication/register', newUser);
            console.log(data);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');
            
        } catch (error) {
            console.error("error with registration", error);
        }
    };


    return (
        <FormContainer>
            <fieldset>
            <legend className="text-sm-center fs-5 fst-italic">New on the page? Please, sign up!</legend>
            <Form className="mt-5" onSubmit={submitRegistration} noValidate>
                <Row>
                    <Form.Group as={Col} controlId="firstName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            className={`mb-2 ${firstNameError ? "border-danger" : ""}`}
                            type="text"
                            placeholder="First name"
                            required
                            title={firstNameError}
                            onChange={handleFirstNameChange}
                        />
                        {firstNameError &&
                        <p className="text-danger fs-6 fst-italic">{firstNameError}</p>
                        }
                    </Form.Group>
                    <Form.Group as={Col} controlId="lastName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            className={`mb-2 ${lastNameError ? "border-danger" : ""}`}
                            type="text"
                            placeholder="Last name"
                            required
                            title={lastNameError}
                            onChange={handleLastNameChange}
                        />
                        <p className="text-danger fs-6 fst-italic">{lastNameError}</p>
                    </Form.Group>
                </Row>


                <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                    <Form.Control
                        className={`mb-2 ${emailError ? "border-danger" : ""}`}
                        type="email"
                        required
                        title={emailError}
                        onChange={handleEmailChange}
                        value={email}
                    />
                    <p className="text-danger fs-6 fst-italic">{emailError}</p>
                </Form.Group>

                <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                    <Form.Control
                        className={`mb-2 ${passwordError ? "border-danger" : ""}`}
                        type="password"
                        required
                        minLength="6"
                        pattern="/.*[0-9].*/"
                        title={passwordError}
                        onChange={handlePasswordChange}
                        value={password}
                    />
                    <p className="text-danger fs-6 fst-italic">{passwordError}</p>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                        className={`mb-2 ${passwordConfError ? "border-danger" : ""}`}
                        type="password"
                        required
                        title={passwordConfError}
                        onChange={handlePasswordConfirmChange}
                        value={passwordConf}
                    />
                    <p className="text-danger fs-6 fst-italic">{passwordConfError}</p>
                </Form.Group>
                <Button variant="secondary" type="submit">Sign up</Button>
            </Form>
            </fieldset>
        </FormContainer>
    )
}

export default Registration;
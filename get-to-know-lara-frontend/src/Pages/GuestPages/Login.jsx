import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import ErrorToastMessage from "../../Components/ErrorToastMessage.jsx";

import {Button, Form} from "react-bootstrap";
import FormContainer from "../../Components/FormContainer.jsx";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {setUser, storeToken} = useStateContext();


    const handleFieldChange = useCallback((field, value) => {
        setForm(prevForm => ({...prevForm, [field]: value}));
        if(errors[field]){
            setErrors(prevErrors => ({...prevErrors, [field]: null}));
        }
    },[errors]);

    
    const validateForm = () => {
        const {email, password} = form;
        const newErrors = {};

        if(!email){
            newErrors.email = "Please, enter your email address.";
        }
        if(!password){
            newErrors.password = "Please, enter your password.";
        }
        return newErrors;
    }


    const submitLogin = useCallback(async (event) => {
        event.preventDefault();

        const formErrors = validateForm();
        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors);
            return;
        }
        
        setIsLoading(true);
        try {
            const {data} = await axiosClient.post('/authentication/login', form);
            setUser(data.user);
            storeToken(data.token);
            navigate('/dashboard');
        } catch (err) {
            setLoginSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }, [form, navigate, setUser, storeToken]);


    return (
            <FormContainer>
                <fieldset>
                <legend className="text-sm-center fs-5 fst-italic">Have an account? Please, log in!</legend>

                <Form className="mt-5" onSubmit={submitLogin} noValidate>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            className="mb-2"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            isInvalid={!!errors.email}
                            required
                        />
                        <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mt-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="mb-2"
                            type="password"
                            value={form.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            isInvalid={!!errors.password}
                            required
                        />
                        <Form.Control.Feedback className="fs-6 fst-italic" type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {!loginSuccess &&
                        <ErrorToastMessage toastHeader={"Login failed"} toastMessage={"Username or password is invalid"}/>
                    }
                    <Button className="mt-4" variant="info" type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
                </fieldset>
            </FormContainer>
    )
}

export default Login;
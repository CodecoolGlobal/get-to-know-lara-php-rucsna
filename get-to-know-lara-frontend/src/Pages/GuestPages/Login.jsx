import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import ErrorToastMessage from "../../Components/ErrorToastMessage.jsx";

import {Button, Form} from "react-bootstrap";
import FormContainer from "../../Components/FormContainer.jsx";

const Login = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState(true);

    const navigate = useNavigate();
    const {setUser, storeToken} = useStateContext();

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        });

        if(!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }
    }

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

    const submitLogin = async (event) => {
        event.preventDefault();

        const formErrors = validateForm();
        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors);
            return;
        }

        const currentUser = {
            email: form.email,
            password: form.password
        };

        try {
            const {data} = await axiosClient.post('/authentication/login', currentUser);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');

        } catch (err) {
            setLoginSuccess(false);
        }
    };

    return (
            <FormContainer>
                <fieldset>
                <legend className="text-sm-center fs-5 fst-italic">Have an account? Please, log in!</legend>
                    {!loginSuccess &&
                        <ErrorToastMessage toastHeader={"Login failed"} toastMessage={"Username or password is invalid"}/>
                    }
                <Form className="mt-5" onSubmit={submitLogin}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            className="mb-2"
                            type="email"
                            value={form.email}
                            onChange={(e) => setField('email', e.target.value)}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="mb-2"
                            type="password"
                            value={form.password}
                            onChange={(e) => setField('password', e.target.value)}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="secondary" type="submit">Login</Button>
                </Form>
                </fieldset>
            </FormContainer>
    )
}

export default Login;
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import ErrorToastMessage from "../../Components/ErrorToastMessage.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [loginSuccess, setLoginSuccess] = useState(true);

    const navigate = useNavigate();
    const {setUser, storeToken} = useStateContext();

    const validateInputs = () => {
        let valid = true;
        if (!emailValid) {
            setEmailValid(false);
            valid = false;
        } else {
            setEmailValid(true);
        }

        if (!passwordValid) {
            setPasswordValid(false);
            valid = false;
        } else {
            setPasswordValid(false);
        }
        return valid;
    }

    const submitLogin = async (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }
        ;

        const currentUser = {
            email: email,
            password: password
        };

        try {
            const {data} = await axiosClient.post('/authentication/login', currentUser);
            console.log(data);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');

        } catch (err) {
            setLoginSuccess(false);
            console.error("error logging in", err);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <fieldset>
                        <legend className="text-center fs-5">Have an account? Please, log in!</legend>
                        <form className="mx-auto" id="login-form" onSubmit={submitLogin}>

                            <div className="mb-3 mt-5">
                                <label htmlFor="inputEmail" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className={`form-control ${emailValid ? '' : 'is-invalid'} `}
                                    id="inputEmail"
                                    aria-describedby="emailHelp"
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Please enter your email address.
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="inputPassword" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${passwordValid ? '' : 'is-invalid'}`}
                                    id="inputPassword"
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Please enter your password.
                                </div>
                                <div id="emailHelp" className="form-text">Forget password?</div>
                            </div>

                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </fieldset>
                </div>
                {!loginSuccess &&
                    <ErrorToastMessage toastHeader={"Login failed"} toastMessage={"Username or password is invalid"}/>
                }
            </div>
        </div>
    )
}

export default Login;
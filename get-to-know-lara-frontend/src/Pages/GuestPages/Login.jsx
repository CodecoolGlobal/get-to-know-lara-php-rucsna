import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";

const Login = () => {
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const navigate = useNavigate();
    const { setUser, storeToken } = useStateContext();

    const submitLogin = async (event) => {
        event.preventDefault();

        const currentUser = {
            email: currentEmail,
            password: currentPassword
        };

        try {
            const { data } = await axiosClient.post('/authentication/login', currentUser);
            console.log(data);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');

        } catch (err) {
           console.error("error logging in", err);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
            <fieldset>
                <legend className="text-center">Have an account? Please, log in!</legend>
                <form className="mx-auto" id="login-form" onSubmit={submitLogin}>

                    <div className="mb-3 mt-5">
                        <label htmlFor="inputEmail" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="inputEmail"
                            aria-describedby="emailHelp"
                            onChange={e => setCurrentEmail(e.target.value)}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="inputPassword"
                            onChange={e => setCurrentPassword(e.target.value)}/>
                        <div id="emailHelp" className="form-text">Forget password?</div>
                    </div>

                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </fieldset>
                </div>
            </div>
        </div>
)
}

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";

const Login = () => {
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();
    const { setUser, storeToken } = useStateContext();

    const submitLogin = async (event) => {
        event.preventDefault();

        const currentUser = {
            email: currentEmail,
            password: currentPassword
        };
        setErrors(null);

        try {
            const { data } = await axiosClient.post('/login', currentUser);
            console.log(data);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');

        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                    console.error(response.data.errors);
                } else {
                    setErrors({
                        email: [response.data.message]
                    });
                    console.error(response.data.message);
                }
            }
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">Have an account? Please, log in!</label>
            {errors &&
                <div className="alert alert-danger" role="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            }
            <form id="login-form" onSubmit={submitLogin}>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        placeholder="example@email.com"
                        onChange={e => setCurrentEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <br />
                <p>
                    Do not have an account yet? <Link to="/registration">Create an account</Link>
                </p>
            </form>
        </div>
    )
}

export default Login;
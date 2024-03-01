import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const Registration = () => {
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [errors, setErrors] = useState(null);

    const { setUser, storeToken } = useStateContext();
    const navigate = useNavigate();

    const submitRegistration = async (event) => {
        event.preventDefault();

        const newUser = {
            name: currentUsername,
            email: currentEmail,
            password: currentPassword,
            password_confirmation: passwordConf
        };
        setErrors(null);

        try {
            const { data } = await axiosClient.post('/register', newUser);
            console.log(data);
            setUser(data.user);
            storeToken(data.token);
            navigate('/');
            
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
                console.error(response.data.errors);
            }
        }
    };


    return (
        <div className="mb-3">
            <label className="form-label">New on the page? Please, sign up!</label>
            {errors &&
                <div className="alert alert-danger" role="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            }
            <form onSubmit={submitRegistration}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="inputUsername"
                        placeholder="Username"
                        onChange={e => setCurrentUsername(e.target.value)} />
                </div>
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
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="inputPasswordConf"
                        placeholder="Confirm password"
                        onChange={e => setPasswordConf(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <p>
                    Already registered? <Link to="/login">Log in to your account</Link>
                </p>
            </form>
        </div>
    )
}

export default Registration;
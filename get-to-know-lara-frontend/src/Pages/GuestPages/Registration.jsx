import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

const Registration = () => {
    const [currentName, setCurrentName] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");

    const { setUser, storeToken } = useStateContext();
    const navigate = useNavigate();

    const submitRegistration = async (event) => {
        event.preventDefault();

        const newUser = {
            name: currentName,
            email: currentEmail,
            password: currentPassword,
            password_confirmation: passwordConf
        };

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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
            <fieldset>
            <legend className="text-center">New on the page? Please, sign up!</legend>
            <form onSubmit={submitRegistration}>

                <div className="mb-3 mt-5">
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        onChange={e => setCurrentName(e.target.value)}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        onChange={e => setCurrentEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        onChange={e => setCurrentPassword(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="inputPasswordConf">Confirm password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPasswordConf"
                        onChange={e => setPasswordConf(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </fieldset>
                </div>
            </div>
        </div>
    )
}

export default Registration;
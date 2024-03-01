import { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const Compose = (props) => {
    const [recipientId, setRecipientId] = useState("Select address");
    const [currentSubject, setCurrentSubject] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const [userData, setUserData] = useState([]);

    const { user } = useStateContext();

    useEffect(() => {
        const getUsers = async () => {
            const { data } = await axiosClient.get('/usersEmail');
            setUserData(data);
            console.log(data);
        }
        getUsers();
    }, [])


    const sendEmail = async (event) => {
        event.preventDefault();

        const newEmail = {
            id_user_from: user.id,
            id_user_to: recipientId,
            subject: currentSubject,
            message: currentMessage
        }
        console.log(newEmail);

        try {
            const { data } = await axiosClient.post('/mails', newEmail);
            props.goToInbox();
            console.log("message successfully sent", data);

        } catch (error) {
            console.error("error with sending message", error);
        }

    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <form className="row g-3 needs-validation" onSubmit={sendEmail} noValidate>
                        <h6 className="card-title">New message</h6>
                        <div className="input-group col-md-6 has-validation">
                            <span className="input-group-text" id="basic-addon1">To:</span>
                            <select className="form-select" onChange={(e) => setRecipientId(e.target.value)} required>
                                <option defaultValue="">Select address</option>
                                {userData && userData.map(ud => (
                                    <option key={ud.id} value={ud.id}>{ud.email}</option>))}
                            </select>
                            <div className="invalid-feedback">
                                Please select an address.
                            </div>
                        </div>
                        <div className="input-group col-md-6 has-validation">
                            <span className="input-group-text" id="basic-addon1">Subject:</span>
                            <input type="text" className="form-control" onChange={(e) => setCurrentSubject(e.target.value)} required/>
                            <div className="invalid-feedback">
                                Subject is a required field.
                            </div>
                        </div>
                        <div className="col-md-12 has-validation">
                            <textarea className="form-control" rows="6" onChange={(e) => setCurrentMessage(e.target.value)} required/>
                        </div>
                        <div className="invalid-feedback">
                                Message is a required field.
                            </div>
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-secondary">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Compose;
import { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import {useNavigate} from "react-router-dom";

const Compose = () => {
    const [recipientId, setRecipientId] = useState("Select address");
    const [currentSubject, setCurrentSubject] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const [userData, setUserData] = useState([]);
    const [formErrors, setFormErrors] = useState({
        recipient: "",
        subject: "",
        message: ""
    });

    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = () => {
            axiosClient.get('/usersEmail')
                .then(response => {
                    setUserData(response.data);
                    console.log(response.data);
                })
                .catch(error => console.error("error with getting email addresses", error));
        }
        getUsers();
    }, []);

    const handleRecipientChange = (event) => {
        setRecipientId(event.target.value);
        setFormErrors({...formErrors, recipient: event.target.value ? "" : "Please select an address." });
    };

    const handleSubjectChange = (event) => {
        setCurrentSubject(event.target.value);
        setFormErrors({...formErrors, subject: event.target.value ? "" : "Subject is a required field." });
    };

    const handleMessageChange = (event) => {
        setCurrentMessage(event.target.value);
        setFormErrors({...formErrors, message: event.target.value ? "" : "Message is a required field." });
    };


    const sendEmail = async (event) => {
        event.preventDefault();

        const form = event.target;
        if(!form.checkValidity()) {
            event.stopPropagation();
            return;
        }

        const request = {
            sender: user.id,
            recipient: recipientId,
            subject: currentSubject,
            message: currentMessage
        }
        console.log(request);

        try {
            const { data } = await axiosClient.post('/mails', request);
            console.log("message successfully sent", data);
            navigate('/inbox');
        } catch (error) {
            console.error("error with sending message", error);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <form className="row g-3 needs-validation" onSubmit={sendEmail} noValidate>
                        <h6 className="card-title">New message</h6>
                        <div className="input-group col-md-6 has-validation">
                            <span className="input-group-text" id="basic-addon1">To:</span>
                            <select className="form-select" onChange={handleRecipientChange} required>
                                <option defaultValue="">Select address</option>
                                {userData && userData.map(ud => (
                                    <option key={ud.id} value={ud.id}>{ud.email}</option>))}
                            </select>
                            <div className="invalid-feedback">
                                {formErrors.recipient}
                            </div>
                        </div>
                        <div className="input-group col-md-6 has-validation">
                            <span className="input-group-text" id="basic-addon1">Subject:</span>
                            <input type="text" className="form-control" onChange={handleSubjectChange} required/>
                            <div className="invalid-feedback">
                                {formErrors.subject}
                            </div>
                        </div>
                        <div className="col-md-12 has-validation">
                            <textarea className="form-control" rows="6" onChange={handleMessageChange} required/>
                            <div className="invalid-feedback">
                                {formErrors.message}
                            </div>
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
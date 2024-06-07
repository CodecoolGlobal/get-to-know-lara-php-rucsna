import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useParams, useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {Button} from "react-bootstrap";

const CurrentMail = () => {
    const [mail, setMail] = useState(null);
    const navigate = useNavigate();
    const {user} = useStateContext();
    const {id} = useParams();

    useEffect(() => {
        const getMailById = async () => {
            axiosClient.patch(`/mail/display/mail`, {user_id: user.id, mail_id: id}
                )
                .then((response) => {
                    setMail(response.data.mail);
                })
                .catch(error => {
                    console.error("error with updating mail", error);
                })
        };
        getMailById().then();
    }, [id, user.id]);

    return (
        <div className="container">
            {mail &&
                <div className="card">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">From: {mail.user_from_name} - {mail.user_from_email}</li>
                        <li className="list-group-item">To: {mail.user_to_name} - {mail.user_to_email}</li>
                        <li className="list-group-item">Date: {mail.received === null ? mail.sent : mail.received}</li>
                    </ul>
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2">Subject: {mail.subject}</h6>
                        <p className="card-text">{mail.message}</p>
                    </div>
                    <div className="card-body">
                        <Button className="text-dark" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left-square"></i>
                        </Button>
                    </div>
                </div>}
        </div>
    )
}

export default CurrentMail;
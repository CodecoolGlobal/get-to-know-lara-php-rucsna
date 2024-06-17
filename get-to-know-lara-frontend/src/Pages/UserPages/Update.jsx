import axiosClient from "../../axios-client.js";
import {useNavigate, useParams} from "react-router-dom";
import MailForm from "../../Components/MailForm.jsx";
import {useEffect, useState} from "react";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

const Update = () => {
    const [mail, setMail] = useState();
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useStateContext();


    useEffect(() => {
        axiosClient.patch('/draft/display', {user_id: user.id, mail_id: id})
            .then(response => setMail(response.data.mail))
            .catch(error => console.error("error fetching draft", error));
    }, [id, user.id]);

    console.log('draft', mail);

    const sendEmail = (request) => {
        axiosClient.post(`/mail/send/${id}`, request)
            .then(() => {
                console.log("message successfully sent");
                navigate('/inbox');
            })
            .catch (error => console.error("error with sending message", error));
    };

    const saveDraft = (request) => {
        axiosClient.post('/draft', request)
            .then(() => {
                console.log("draft successfully saved");
            })
            .catch(error => console.error("error with saving draft", error));
    }


    return (
        <div className="container">
            <MailForm onSend={sendEmail} onSave={saveDraft} mail={mail}/>
        </div>
    )
}

export default Update;
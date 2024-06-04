import axiosClient from "../../axios-client.js";
import {useNavigate} from "react-router-dom";
import MailForm from "../../Components/MailForm.jsx";

const Compose = () => {
    const navigate = useNavigate();

    const sendEmail = (request) => {
        axiosClient.post('/mail/send', request)
            .then(() => {
            console.log("message successfully sent");
            navigate('/dashboard');
            })
            .catch (error => console.error("error with sending message", error));
    };

    const saveDraft = (request) => {
        axiosClient.post('/mail/draft', request)
            .then(() => {
                console.log("draft successfully saved");
                navigate('/dashboard');
            })
            .catch(error => console.error("error with saving draft", error));
    }


    return (
        <div className="container">
           <MailForm onSend={sendEmail} onSave={saveDraft}/>
        </div>
    )
}

export default Compose;
import axiosClient from "../../axios-client.js";
import {useNavigate} from "react-router-dom";
import MailForm from "../../Components/MailForm.jsx";

const Compose = () => {
    const navigate = useNavigate();

    const sendEmail = (request) => {
        axiosClient.post('/mail/send', request)
            .then(() => {
            navigate('/');
            })
            .catch (error => console.error("error with sending message", error));
    };

    const saveDraft = (request) => {
        console.log(request);
        axiosClient.post('/draft', request)
            .then(() => {
                navigate('/');
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
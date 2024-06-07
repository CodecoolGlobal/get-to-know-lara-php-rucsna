import {useEffect, useState} from "react";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import MailsTable from "../../Components/MailsTable.jsx";

const Sent = () => {
    const [mails, setMails] = useState([]);
    const {user} = useStateContext();

    useEffect(() => {
        getSentMails();
    }, [user.id]);

    const getSentMails = () => {
        axiosClient.get(`/mail/mailsByUser/sent/${user.id}`)
            .then(response => {
                setMails(response.data.mails);
                console.log(response.data.mails);
            })
            .catch(error => console.error("Error fetching mails", error))
    };
    
    return (
        <div>
            {mails &&
                <MailsTable mails={mails} getCurrent={getSentMails} label={"To: "}/>
            }
        </div>
    )
}

export default Sent;
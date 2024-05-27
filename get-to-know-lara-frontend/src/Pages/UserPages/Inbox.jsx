import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import MailsTable from "../../Components/MailsTable.jsx";

const Inbox = () => {
    const [mails, setMails] = useState([]);
    const {user} = useStateContext();

    useEffect(() => {
        getInbox();
    }, [user.id]);

    const getInbox = () => {
        axiosClient.get(`/mail/mailsByUser/inbox/${user.id}`)
            .then(response => {
                const data = response.data;
                console.log('MAILS', data.mails);
                setMails(data.mails);

            })
            .catch(error => {
                console.error("error with getting mails", error);
            })
    };

    return (
        <div>
            {mails &&
            <MailsTable mails={mails} getCurrent={getInbox} setMails={setMails} isInbox={true} label={"From: "}/>
            }
        </div>
    )
};

export default Inbox;
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import MailsTable from "../../Components/MailsTable.jsx";
import PropTypes from "prop-types";

const Inbox = ({setCounter}) => {
    const [mails, setMails] = useState([]);
    const {user} = useStateContext();

    useEffect(() => {
        getInbox();
    }, [user.id]);

    const getInbox = () => {
        axiosClient.get(`/mail/mailsByUser/inbox/${user.id}`)
            .then(response => {
                const data = response.data;
                setMails(data.mails);
                console.log(data.mails);
                if(mails) {
                    const newMails = data.mails.filter(mail => mail.opened_at === null).length;
                    setCounter(newMails);
                }
            })
            .catch(error => {
                console.error("error with getting mails", error);
            })
    };

    return (
        <div>
            {mails &&
            <MailsTable mails={mails} getCurrent={getInbox} isInbox={true} label={"From: "}/>
            }
        </div>
    )
};

Inbox.propTypes = {
    setCounter: PropTypes.func
};

export default Inbox;
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

const Inbox = (props) => {
    const [mails, setMails] = useState([]);

    useEffect(() => {
        const getInbox = async () => {
            try {
                const { data } = await axiosClient.get(`/mailsByReceiver/${props.userId}`);
                const sortedData = data.sort((a, b) => new Date(b.created) - new Date(a.created));
                setMails(sortedData);
                console.log(data);
            } catch (error) {

            }
        };
        getInbox();
    }, [props.userId]);


    return (
        <div >
            {mails &&
                mails.map(mail => (
                    <div key={mail.id}>
                        <p>{mail.id_user_from} - {mail.subject}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Inbox;
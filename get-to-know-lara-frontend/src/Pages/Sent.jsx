import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

const Sent = (props) => {
    const [mails, setMails] = useState([]);

    useEffect(() => {
        const getSent = async () => {
            try {
                const { data } = await axiosClient.get(`/mailsBySender/${props.userId}`);
                const sortedData = data.sort((a, b) => new Date(b.created) - new Date(a.created));
                setMails(sortedData);
                console.log(data);
            } catch (error) {
                console.error("Error with getting mails", error);
            }
        };
        getSent();
    }, [])
    

    return(
        <div>
           {mails &&
                mails.map(mail => (
                    <div key={mail.id}>
                        <p>{mail.id_user_to} - {mail.subject}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Sent;
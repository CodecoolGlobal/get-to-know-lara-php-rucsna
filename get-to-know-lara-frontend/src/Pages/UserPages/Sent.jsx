import { useEffect, useState } from "react";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";

const Sent = () => {
    const [mails, setMails] = useState([]);
    const {user} = useStateContext();

    useEffect(() => {
        const getSent = () => {
            axiosClient.get(`/mailsBySender/${user.id}`)
                .then(response => {
                    setMails(response.data);
                    console.log(response.data);
                })
                .catch (error => console.error("Error with getting mails", error))
        };
        getSent();
    }, [user.id]);
    

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
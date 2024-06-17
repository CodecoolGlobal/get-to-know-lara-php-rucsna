import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import MailsTable from "../../Components/MailsTable.jsx";

const Bin = () => {
    const [mails, setMails] = useState();
    const {user} = useStateContext();

    useEffect(() => {
        getDeletedMails();
    }, [user.id]);

    const getDeletedMails = () => {
        axiosClient.get(`/mails/deleted/${user.id}`)
            .then(response => {
                setMails(response.data.mails);
                console.log(response.data.mails);
            })
            .catch (error => console.error("Error fetching mails", error))
    };

    return(
        <div>
            {mails &&
               <MailsTable mails={mails} getCurrent={getDeletedMails} isBin={true} label={"Deleted "}/>
            }
        </div>
    );
}

export default Bin;
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import MailsTable from "../../Components/MailsTable.jsx";

const Drafts = () => {
    const [mails, setMails] = useState();
    const {user} = useStateContext();

    useEffect(() => {
        getDrafts();
    }, [user.id]);

    const getDrafts = () => {
        axiosClient.get(`/drafts/${user.id}`)
            .then(response => {
                setMails(response.data.mails);
                console.log(response.data.mails);
            })
            .catch (error => console.error("Error fetching mails", error))
    };

    return(
        <div>
            {mails &&
                <MailsTable mails={mails} setMails={setMails} getCurrent={getDrafts} isDraft={true} label={"Draft "}/>
            }
        </div>
    );
}

export default Drafts;
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {useNavigate} from "react-router-dom";

const Inbox = () => {
    const [mails, setMails] = useState([]);
    const {user} = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        getInbox();
    }, [user.id]);

    const getInbox = () => {
        axiosClient.get(`/mailsByReceiver/${user.id}`)
            .then(response => {
                const data = response.data;
                setMails(data);
                console.log(data);
            })
            .catch(error => {
                console.error("error with getting mails", error);
            })
    };

    const handleMailDisplay = (mailId) => {
        axiosClient.patch(`/mail/${mailId}`, {is_read: true})
            .then(() => {
                console.log("mail marked as read successfully");
                navigate(`/currentMail/${mailId}`);
            })
            .catch(error => {
                console.error("error with updating mail", error);
            })
    };

    const markMailUnread = (mailId) => {
        axiosClient.patch(`/mail/${mailId}`, {is_read: false})
            .then(() => {
                console.log("mail updated successfully");
                getInbox();
            })
            .catch(error => console.error("error with updating mail", error));
    };

    const deleteMail = (mailId) => {
        axiosClient.patch(`/mail/delete/${mailId}`)
            .then(() => {
                console.log("mail deleted successfully");
                setMails(mails.filter(mail => mail.id !== mailId));
            })
            .catch(error => console.error("error with deleting mail", error));
    };

    return (
        <div>
            {mails &&
                <table>
                    <thead>
                    <tr>
                        <th>From</th>
                        <th>Subject</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mails.map(mail => (
                        <tr key={mail.id} className={`${mail.is_read ? 'fw-normal' : 'fw-bold'}`}>
                            <td>{mail.id_user_from}</td>
                            <td>{mail.subject}</td>
                            <td className="fs-6 fw-light" onClick={() => handleMailDisplay(mail.id)}>Read</td>
                            <td className="fs-6 fw-light" onClick={() => markMailUnread(mail.id)}>Mark as unread</td>
                            <td className="fs-6 fw-light" onClick={() => deleteMail(mail.id)}>Delete</td>
                        </tr>
                    ))}
                    </tbody>
                </table>}
        </div>
    )
};

export default Inbox;
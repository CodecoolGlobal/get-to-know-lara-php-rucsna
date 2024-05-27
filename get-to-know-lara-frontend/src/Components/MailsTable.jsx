import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const MailsTable = ({mails, getCurrent, isBin, isInbox, isDraft, label}) => {
    const navigate = useNavigate();
    const {user} = useStateContext();

    MailsTable.propTypes = {
        mails: PropTypes.array.isRequired,
        getCurrent: PropTypes.func.isRequired,
        setMails: PropTypes.func.isRequired,
        isBin: PropTypes.bool,
        isInbox: PropTypes.bool,
        isDraft: PropTypes.bool,
        label: PropTypes.string.isRequired
    };

    const handleMailDisplay = (mailId) => {
        navigate(`/currentMail/${mailId}`);
    };

    const markMailUnread = (mailId) => {
        axiosClient.patch(
            '/mail/restore', {user_id: user.id, mail_id: mailId, type: "read"}
        )
            .then(() => {
                console.log("mail updated successfully");
                getCurrent();
            })
            .catch(error => console.error("error with updating mail", error));
    };

    const restoreMail = (mailId) => {
        axiosClient.patch(
            '/mail/restore', {user_id: user.id, mail_id: mailId, type: "deleted"}
        )
            .then(() => {
                console.log("mail updated successfully");
                getCurrent();
            })
            .catch(error => console.error("error with updating mail", error));
    };

    const deleteMail = (mailId) => {
        axiosClient.patch('/mail/delete', {user_id: user.id, mail_id: mailId}
        )
            .then(() => {
                console.log("mail deleted successfully");
                getCurrent();
            })
            .catch(error => console.error("error with deleting mail", error));
    };

    const deleteDraft = (mailId) => {
        axiosClient.delete(`/mail/deleteDraft/${mailId}/${user.id}`)
            .then(() => {
                console.log("draft deleted successfully")
                getCurrent();
            })
            .catch(error => console.error("error with deleting draft", error));
    };

    const editDraft = (mailId) => {
        navigate(`/draft/${mailId}`);
    }

    return (
        <fieldset>
            <table className="table table-success table-striped">
                <tbody>
                {mails.map(mail => (
                    <tr key={mail.id} className={`${mail.opened_at === null ? 'fw-bold' : 'fw-normal'}`}>
                        <th scope="row" className="fst-italic fw-medium">{label}</th>
                        <td>{mail.name}</td>
                        <td>{mail.subject ?? '(No subject)'}</td>
                        <td>{mail.time}</td>
                        {!isDraft ?
                            <td className="btn btn-warning text-warning-emphasis" onClick={() => handleMailDisplay(mail.id)}>Open</td> : null
                        }
                        {isInbox || isBin ?
                            <td className="btn btn-secondary text-secondary-emphasis" onClick={() => markMailUnread(mail.id)}>Mark as unread</td> : null
                        }
                        {isDraft ?
                            <>
                                <td className="btn btn-warning text-warning-emphasis" onClick={() => editDraft(mail.id)}>Open</td>
                                <td className="btn btn-danger text-danger-emphasis" onClick={() => deleteDraft(mail.id)}>Delete</td>
                            </> : null
                        }
                        {!isBin && !isDraft ?
                            <td className="btn btn-danger text-danger-emphasis" onClick={() => deleteMail(mail.id)}>Delete</td> : null
                        }
                        {isBin ?
                            <td className="btn btn-danger text-danger-emphasis" onClick={() => restoreMail(mail.id)}>Restore</td> : null
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </fieldset>
    )
}
export default MailsTable;
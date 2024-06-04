import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Container, Table} from "react-bootstrap";

const MailsTable = ({mails, getCurrent, isBin, isInbox, isDraft, label}) => {
    const navigate = useNavigate();
    const {user} = useStateContext();

    MailsTable.propTypes = {
        mails: PropTypes.array.isRequired,
        getCurrent: PropTypes.func.isRequired,
        isBin: PropTypes.bool,
        isInbox: PropTypes.bool,
        isDraft: PropTypes.bool,
        label: PropTypes.string.isRequired
    };

    const handleMailDisplay = (mailId) => {
        navigate(`/mail/${mailId}`);
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
    };

    return (
        <Container className="mt-3" fluid="lg">
            <Table striped bordered responsive="lg">
                <tbody>
                {mails.map(mail => (
                    <tr key={mail.id} className={`${mail.opened_at === null ? 'fw-bolder' : 'fw-normal'}`}>
                        <th className="fw-semibold fw-medium text-warning">{label}</th>
                        <td className="text-secondary">{mail.name}</td>
                        <td className="text-secondary">{mail.subject ?? '(No subject)'}</td>
                        <td className="text-truncate text-secondary" style={{maxWidth: '150px'}}>{mail.message}</td>
                        <td className="text-secondary">{mail.time}</td>
                        {!isDraft ?
                            <td className="text-primary"
                                onClick={() => handleMailDisplay(mail.id)}>
                                <i className="bi bi-envelope-open"></i>
                            </td> : null
                        }
                        {isInbox || isBin ?
                            <td className="text-secondary"
                                onClick={() => markMailUnread(mail.id)}>
                                <i className="bi bi-envelope"></i>
                            </td> : null
                        }
                        {isDraft ?
                            <>
                                <td className="text-primary" onClick={() => editDraft(mail.id)}>
                                    <i className="bi bi-envelope-open"></i>
                                </td>
                                <td className="text-danger"
                                    onClick={() => deleteDraft(mail.id)}>
                                    <i className="bi bi-trash3"></i>
                                </td>
                            </> : null
                        }
                        {!isBin && !isDraft ?
                            <td className="text-danger" onClick={() => deleteMail(mail.id)}>
                                <i className="bi bi-trash3"></i>
                            </td> : null
                        }
                        {isBin ?
                            <td className="text-danger" onClick={() => restoreMail(mail.id)}>
                                <i className="bi bi-envelope-arrow-up"></i>
                            </td> : null
                        }
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}
export default MailsTable;
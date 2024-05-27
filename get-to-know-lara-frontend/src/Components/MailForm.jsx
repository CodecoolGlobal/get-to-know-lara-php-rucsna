import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar.jsx";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const MailForm = ({mail, onSend, onSave}) => {
    const [userIdTo, setUserIdTo] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState( "");
    const {user} = useStateContext();

    MailForm.propTypes = {
        mail: PropTypes.object,
        onSend: PropTypes.func,
        onSave: PropTypes.func
    };

    useEffect(() => {
        if(mail){
            setUserIdTo(mail.user_id_to);
            setEmail(mail.email);
            setSubject(mail.subject);
            setMessage(mail.message);
        }
    }, [mail]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const {name} = event.nativeEvent.submitter;

        if(name === "saveButton"){
            if(mail){
                return onSave({
                    ...mail,
                    //user_id_from: user.id,
                    user_id_to: userIdTo,
                    subject,
                    message,
                    is_draft: false
                });
            }
            return onSave({
                user_id_from: user.id,
                user_id_to: userIdTo,
                subject: subject,
                message: message,
                is_draft: false
            });
        }

        if(name === "sendButton"){
            if(mail){
                return onSend({
                    ...mail,
                    //user_id_from: user.id,
                    user_id_to: userIdTo,
                    subject,
                    message,
                    is_draft: false
                });
            }
            return onSend({
                user_id_from: user.id,
                user_id_to: userIdTo,
                subject: subject,
                message: message,
                is_draft: false
            });
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <h6 className="card-title">New message</h6>
                        <div className="input-group col-md-6">
                            <span className="input-group-text" id="basic-addon1">To:</span>
                            <SearchBar setUser={setUserIdTo} email={email}/>
                        </div>
                        <div className="input-group col-md-6">
                            <span className="input-group-text" id="basic-addon1">Subject:</span>
                            <input
                                type="text"
                                className="form-control"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}/>
                        </div>
                        <div className="col-md-12 has-validation">
                            <textarea
                                className="form-control"
                                rows="6"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required/>
                        </div>
                        <div className="col-md-12">
                            <button type="submit" name="sendButton" className="btn btn-secondary">Send</button>
                        </div>
                        <div className="col-md-12">
                            <button type="submit" name="saveButton" className="btn btn-secondary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MailForm;
import {useEffect, useState} from "react";import {useStateContext} from "../contexts/ContextProvider.jsx";
import PropTypes from "prop-types";

import SearchBar from "./SearchBar.jsx";
import FormContainer from "./FormContainer.jsx";
import {Button, Card, FloatingLabel, Form, FormControl, InputGroup} from "react-bootstrap";

const MailForm = ({mail, onSend, onSave}) => {
    const [userIdTo, setUserIdTo] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState( "");
    const {user} = useStateContext();

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
        <FormContainer>
            <Card>
                <Card.Header className="text-light">New message</Card.Header>
                <Card.Body>
                    <Form className="row g-3" onSubmit={handleSubmit}>
                        <SearchBar setUser={setUserIdTo} email={email}/>

                        <InputGroup className="col-md-6">
                            <InputGroup.Text className="text-light" id="subject">Subject:</InputGroup.Text>
                            <FormControl
                                type="text"
                                aria-label="subject"
                                aria-describedby="subject"
                                placeholder="example subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}/>
                        </InputGroup>

                        <InputGroup className="col-md-12 has-validation">
                            <FloatingLabel className="text-light" controlId="message" label={"Message"}>
                            <Form.Control
                                as="textarea"
                                style={{height: '200px'}}
                                placeholder="Type your message here..."
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
};

MailForm.propTypes = {
    mail: PropTypes.object,
    onSend: PropTypes.func,
    onSave: PropTypes.func
};

export default MailForm;
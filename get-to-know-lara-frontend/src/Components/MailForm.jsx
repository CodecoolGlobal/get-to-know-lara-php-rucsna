import {useCallback, useEffect, useState} from "react";import {useStateContext} from "../contexts/ContextProvider.jsx";
import PropTypes from "prop-types";

import SearchBar from "./SearchBar.jsx";
import FormContainer from "./FormContainer.jsx";
import {Button, Card, FloatingLabel, Form, FormControl, InputGroup} from "react-bootstrap";
import AttachmentUpload from "./AttachmentUpload.jsx";

const MailForm = ({mail, onSend, onSave}) => {
    const [form, setForm] = useState({
        user_id_to: "",
        email: "",
        subject: "",
        message: "",
        attachment: null
    });
    const [errors, setErrors] = useState({});

    const {user} = useStateContext();

    useEffect(() => {
        if(mail){
            setForm({...mail});
        }
    }, [mail]);

    const handleFieldChange = useCallback((field, value) => {
        setForm(prevForm => ({...prevForm, [field]: value}));
        if(errors[field]){
            setErrors(prevErrors => ({...prevErrors, [field]: null}));
        }
    },[errors]);


    const handleSave = () => {
        if(mail){
            return onSave({...mail, ...form, is_draft: false});
        } else{
            return onSave({user_id_from: user.id, ...form, is_draft: false});
        }
    };

    const handleSend = () => {
        if(mail){
            return onSend({...mail, ...form, is_draft: false});
        } else {
            return onSend({user_id_from: user.id, ...form, is_draft: false});
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const {name} = event.nativeEvent.submitter;

        if(name === "saveButton"){
            handleSave();
        }

        if(name === "sendButton"){
            handleSend();
        }
    };

    console.log('FORM', form);

    return (
        <FormContainer>
            <Card>
                <Card.Header className="text-light">New message</Card.Header>
                <Card.Body>
                    <Form className="row g-3" onSubmit={handleSubmit}>
                        <SearchBar setUser={handleFieldChange} email={form.email}/>

                        <InputGroup className="col-md-6">
                            <InputGroup.Text className="text-light" id="subject">Subject:</InputGroup.Text>
                            <FormControl
                                type="text"
                                aria-label="subject"
                                aria-describedby="subject"
                                placeholder="example subject"
                                value={form.subject}
                                onChange={e => handleFieldChange('subject', e.target.value)}/>
                        </InputGroup>

                        <InputGroup className="col-md-12 has-validation">
                            <FloatingLabel className="text-light" controlId="message" label={"Message"}>
                            <Form.Control
                                as="textarea"
                                style={{height: '200px'}}
                                placeholder="Type your message here..."
                                value={form.message}
                                onChange={e => handleFieldChange('message', e.target.value)}
                                required/>
                            </FloatingLabel>
                        </InputGroup>

                        <AttachmentUpload handleFieldChange={handleFieldChange}/>

                        <InputGroup>
                            <Button type="submit" name="sendButton" className="btn-success btn-outline-light">Send</Button>
                            <Button type="submit" name="saveButton" className="btn-success btn-outline-light">Save</Button>
                        </InputGroup>

                    </Form>
                </Card.Body>
            </Card>
        </FormContainer>
    )
};

MailForm.propTypes = {
    mail: PropTypes.object,
    onSend: PropTypes.func,
    onSave: PropTypes.func
};

export default MailForm;
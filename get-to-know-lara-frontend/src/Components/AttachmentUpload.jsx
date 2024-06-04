import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

const AttachmentUpload = ({handleFieldChange}) => {
    const [files, setFiles] = useState([]);

    const packFiles = (files) => {
        const data = new FormData();
        [...files].forEach((file, i) => {
            data.append(`file-${i}`, file, file.name);
        });
        console.log('packed files', data);
        return data;
    };

    useEffect(() => {
        if(files.length){
            console.log('files', files);
            handleFieldChange('files', packFiles(files));
        }
    }, [files, handleFieldChange]);

    return(
        <Form.Group controlId="file-input" className="mb-3">
            <Form.Label className="text-light">Attachment</Form.Label>
            <Form.Control
                type="file"
                multiple
                accept="image/*, .pdf, audio/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={e => setFiles(e.target.files)}
            />
        </Form.Group>
    )
};

AttachmentUpload.propTypes = {
    handleFieldChange: PropTypes.func
};

export default AttachmentUpload;
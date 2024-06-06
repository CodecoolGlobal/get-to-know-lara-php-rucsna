import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AttachmentUpload = ({handleFieldChange}) => {
    return(
        <Form.Group controlId="file-input" className="mb-3">
            <Form.Label className="text-light">Attachment</Form.Label>
            <Form.Control
                type="file"
                accept="image/*, .pdf, audio/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={e => handleFieldChange('attachment', e.target.files)}
                multiple
            />
        </Form.Group>
    )
};

AttachmentUpload.propTypes = {
    handleFieldChange: PropTypes.func.isRequired
};

export default AttachmentUpload;
import PropTypes from "prop-types";
//import {useEffect} from "react";
import {Toast} from "react-bootstrap";
import {useState} from "react";

const ErrorToastMessage = ({toastHeader, toastMessage}) => {
    const [show, setShow] = useState(true);

    return(
        <Toast className="border-danger" onClose={() => setShow(false)} show={show}>
            <Toast.Header>
                <strong className="me-auto text-danger">{toastHeader}</strong>
            </Toast.Header>
            <Toast.Body className="text-danger">
                {toastMessage}
            </Toast.Body>
        </Toast>
    );
};

ErrorToastMessage.propTypes = {
    toastHeader: PropTypes.string,
    toastMessage: PropTypes.string
};

export default ErrorToastMessage;
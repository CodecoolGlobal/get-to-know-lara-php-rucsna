import PropTypes from "prop-types";
import {useEffect} from "react";

const ErrorToastMessage = ({toastHeader, toastMessage}) => {
    ErrorToastMessage.propTypes = {
        toastHeader: PropTypes.string,
        toastMessage: PropTypes.string
    };

    useEffect(() => {
        const toastContent = document.querySelector('.toast');

        const toast = new bootstrap.Toast(toastContent);
        toast.show();
    }, []);

    return(
        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
            <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <strong className="me-auto">{toastHeader}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {toastMessage}
                </div>
            </div>
        </div>
    );
}

export default ErrorToastMessage;
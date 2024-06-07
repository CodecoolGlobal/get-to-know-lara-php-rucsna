import {OverlayTrigger, Tooltip} from "react-bootstrap";
import PropTypes from "prop-types";

const OverlayInfoMessage = ({children, info, placement}) => {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {info}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={placement}
            delay={{ show: 250, hide: 200 }}
            overlay={renderTooltip}
        >
            {children}
        </OverlayTrigger>
    );
};

OverlayInfoMessage.propTypes = {
    children: PropTypes.any.isRequired,
    info: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired
};

export default OverlayInfoMessage;
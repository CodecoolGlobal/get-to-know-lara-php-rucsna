import {Col, Container, Row} from "react-bootstrap";
import PropTypes from "prop-types";

const FormContainer = ({children}) => {
    return(
        <Container fluid="md">
            <Row className="justify-content-md-center mt-4">
                <Col xs={12} md={8}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}

FormContainer.propTypes = {
    children: PropTypes.any
};

export default FormContainer;
import {useState} from "react";
import axiosClient from "../axios-client.js";
import PropTypes from "prop-types";
import {Form, InputGroup} from "react-bootstrap";
import OverlayInfoMessage from "./OverlayInfoMessage.jsx";

const SearchBar = ({setUser, email}) => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);

    const fetchAddress = (input) => {
        axiosClient.get(`/user/addresses/${input}`)
            .then(response => {
                setResults(response.data);
            })
            .catch(error => console.error("error with getting email addresses", error));
    }

    const handleChange = (event) => {
        setInput(event.target.value);
        if (input.length >= 2) {
            fetchAddress(input);
        }
        const selectedUser = results.find(result => result.name === event.target.value);

        if (selectedUser) {
            setUser('user_id_to', selectedUser.id);
        } else {
            setUser(null);
        }
    };

    console.log(input);

    return (
        <InputGroup>
            <InputGroup.Text className="text-light" id="recipient-address">To:</InputGroup.Text>
            <OverlayInfoMessage info="Start typing a name or an email address" placement="top-start">
            <Form.Control
                placeholder={input === "" ? "example@email.com" : email}
                aria-label="recipient-address"
                aria-describedby="recipient-address"
                value={input}
                onChange={handleChange}
                list="result-list"
            />
            </OverlayInfoMessage>
            <datalist id="result-list">
                {
                    results && results.map((result, id) => {
                        return <option key={id} value={result.name}>{result.email}</option>
                    })
                }
            </datalist>
        </InputGroup>
    )
};

SearchBar.propTypes = {
    setUser: PropTypes.func,
    email: PropTypes.string
};

export default SearchBar;
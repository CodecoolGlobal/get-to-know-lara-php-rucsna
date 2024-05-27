import {useState} from "react";
import axiosClient from "../axios-client.js";
import PropTypes from "prop-types";

const SearchBar = ({setUser, email}) => {
    const [input, setInput] = useState(email ?? "");
    const [results, setResults] = useState([]);

    SearchBar.propTypes = {
        setUser: PropTypes.func,
        email: PropTypes.string
    }
    const fetchAddress = (input) => {
            axiosClient.get(`/user/addresses/${input}`)
                .then(response => {
                    setResults(response.data);
                    //setUser(response.data.id);
                    console.log(response.data);
                })
                .catch(error => console.error("error with getting email addresses", error));
    }

    const handleChange = (event) => {
        setInput(event.target.value);
        if(input.length >= 2){
            fetchAddress(input);
        }
        const selectedUser = results.find(result => result.name === event.target.value);
        console.log(selectedUser);
        if(selectedUser){
            setUser(selectedUser.id);
        } else{
            setUser(null);
        }
    }

    return(
        <div>
            <input
                placeholder={email}
                value={input}
                onChange={handleChange}
                list="result-list"
            />
            <datalist id="result-list">
                {
                    results && results.map((result, id) => {
                        return <option key={id} value={result.name}>{result.email}</option>
                    })
                }
            </datalist>
        </div>
    )
}

export default SearchBar;
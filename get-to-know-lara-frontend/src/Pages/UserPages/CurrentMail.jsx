import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import {useNavigate, useParams} from "react-router-dom";

const CurrentMail = () => {
    const [mail, setMail] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams();

    console.log("MAIL ID", id);
    
    useEffect(() => {
        const getMailById = async () => {
            try {
                const { data } = await axiosClient.get(`/mail/${id}`);
                setMail(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        getMailById().then();
    }, [id]);

    const handleRedirection = () => {
        navigate('/inbox');
    };

    return (
        
        <div>
            {mail &&
            <div>
            <button onClick={handleRedirection}>&#x2190;</button>
            <ul>From: {mail.id_user_from}</ul>
            <ul>To: {mail.id_user_to}</ul>
            <ul>{mail.sent}</ul>
            <ul>{mail.subject}</ul>
            <ul>{mail.message}</ul>
            </div>}
        </div>
    )
}

export default CurrentMail;
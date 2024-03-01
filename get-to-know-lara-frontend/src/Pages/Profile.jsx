import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import Inbox from "./Inbox";
import Compose from "./Compose";
import Sent from "./Sent";


const Profile = () => {
    const [isInbox, setIsInbox] = useState(true);
    const [isCompose, setIsCompose] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const { setUser, user } = useStateContext();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axiosClient.get('/user');
                setUser(data);
                console.log(data);
            } catch (err) {
                console.error("Error with getting user data", err);
            }

        };
        getUser();

    }, [setUser]);

    const goToCompose = () => {
        setIsCompose(true);
        setIsInbox(false);
        setIsSent(false);
    }

    const goToInbox = () => {
        setIsInbox(true);
        setIsCompose(false);
        setIsSent(false);
    };

    const goToSent = () => {
        setIsSent(true);
        setIsCompose(false);
        setIsInbox(false);
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <div className="btn-group-vertical" role="group" aria-label="Basic example">
                        <button type="button" className={`btn ${isCompose ? 'btn-secondary' : 'btn'}`} onClick={goToCompose}>Compose</button>
                        <button type="button" className={`btn ${isInbox ? 'btn-secondary' : 'btn'}`} onClick={goToInbox}>Inbox</button>
                        <button type="button" className={`btn ${isSent ? 'btn-secondary' : 'btn'}`} onClick={goToSent}>Sent</button>
                    </div>
                </div>
                <div className="col-md-6 offset md-3">
                    {user && isInbox &&
                        <Inbox userId={user.id} />
                    }
                    {isCompose &&
                        <Compose goToInbox={goToInbox}/>
                    }
                    {isSent &&
                        <Sent userId={user.id}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;
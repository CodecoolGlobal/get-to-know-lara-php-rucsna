import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    storeToken: () => {}
});


// provides shared data between components, not only user and token but their helper (set) functions as well
// children prop represents all the child element that is passed to the component
export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const storeToken = (token) => {
        setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    
    return(
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            storeToken
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
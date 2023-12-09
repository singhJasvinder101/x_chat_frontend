import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatContext = createContext();
// this created context is used once in contextProvider for globally other one for using in other components

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const apiUrl = import.meta.env.VITE_API_URI
    // fetch chats again when leaving group to update the list
    const [fetchAgain, setFetchAgain] = useState(false)
    const [notification, setNotification] = useState([])

    const navigate = useNavigate()

    const checkCookieToken = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/get-token`, {
                withCredentials: true
            })
            if (data.token) {
                return data.token;
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const token = await checkCookieToken();
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            // if (!userInfo || !token) {  due to slow service of render
            if (!userInfo) {
                navigate('/');
            } else {
                setUser(userInfo);
                navigate('/chats')
            }
        };

        fetchData();
    }, [navigate])  

    return (
        <ChatContext.Provider value={{
            setUser, user, selectedChat, setSelectedChat, chats, setChats, 
            setFetchAgain, fetchAgain, notification, setNotification
        }}>
            {children}
        </ChatContext.Provider>
    );
};


export const chatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider

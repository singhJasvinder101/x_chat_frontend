import React, { useEffect, useRef, useState } from 'react'
import { chatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, space, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProfileModal from './ProfileModal'
import { getSender, getSenderFull } from '../config/ChatLogics'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Typing from '../animations/Typing'
// import Lottie from "lottie-react";
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } = chatState()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const apiUrl = import.meta.env.VITE_API_URI
    const toast = useToast()
    const bottomRef = useRef(null)

    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`${apiUrl}/api/message/${selectedChat._id}`,
                { withCredentials: true }
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                setNewMessage("");
                // bcoz the api is async so do not immediately empty string
                const { data } = await axios.post(`${apiUrl}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat,
                },
                    { withCredentials: true });
                socket.emit("new message", data)
                setMessages([...messages, data])
                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    // initializing the socket at top
    useEffect(() => {
        if (!socket) {
            socket = io(apiUrl)

            socket.emit("setup", user)
            socket.on("connected", () => setSocketConnected(true))
            socket.on("typing", () => {
                setIsTyping(true)
            })
            socket.on("stop typing", () => setIsTyping(false))

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setSocketConnected(false);
            });

            socket.on("join chat", (room) => {
                socket.join(room);
                console.log("User Joined Room: " + room);
            });
        }

        return () => {
            if (socket) {
                socket.disconnect()
            }
        };
    }, [])

    useEffect(() => {
        fetchMessages()
        // console.log(messages)
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight
    }, [messages]);

    useEffect(() => {
        // checking whether the icnoming messge belong to respective/selected chat or not
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // console.log(selectedChatCompare)
                // console.log(newMessageRecieved)
                // console.log(notification)

                // give ntifications
                if (!notification.includes(newMessageRecieved._id)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain)
                }
            }
            else {
                // update the messages
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const typingHandler = async (e) => {
        setNewMessage(e.target.value)

        // typing indicator logic
        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        className='d-flex'
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <div className='xs:flex md:hidden'>
                            <IconButton
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat(false)}
                            />
                        </div>
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel fetchMessages={fetchMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        className='d-flex'
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                                <div className="messages" ref={bottomRef}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {isTyping && <span><Typing /></span>}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box className='h-[100%] d-flex items-center justify-center' alignItems="center">
                    <Text fontSize={'3xl'} pb={3}>
                        Click on user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat

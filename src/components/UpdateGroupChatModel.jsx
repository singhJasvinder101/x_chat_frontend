import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { chatState } from '../context/ChatProvider'
import UserBadgeItem from './User Avatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from './User Avatar/UserListItem'

const UpdateGroupChatModel = ({ fetchMessages }) => {
    const { fetchAgain, setFetchAgain, selectedChat, setSelectedChat, user } = chatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();
    const apiUrl = import.meta.env.VITE_API_URI


    const handleRemove = async (delUser) => {
        if (selectedChat.groupAdmin._id !== user._id && user._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.patch(`${apiUrl}/api/chats/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: delUser._id,
                },
                { withCredentials: true }
            );

            // if the user himself was admin then will able to reach here 
            // and if he removed himself then do this
            delUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            setGroupChatName("");
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)
            const { data } = await axios.patch(`${apiUrl}/api/chats/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                { withCredentials: true }
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
        onClose()
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${apiUrl}/api/user/allusers?search=${search}`, {
                withCredentials: true
            });
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            console.log(error)
        }
    }


    const handleAddUsers = async (newuser) => {
        if (selectedChat.users.some(u => u._id === newuser._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.patch(`${apiUrl}/api/chats/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: newuser._id,
                },
                { withCredentials: true }
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }
    return (
        <div>
            <div className='xs:flex'>
                <IconButton icon={<ViewIcon />} onClick={onOpen} />
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        className='d-flex'
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='d-flex flex-col items-center'>
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl className="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResults
                                ?.slice(0, 4)
                                .map((u) => (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        admin={user}
                                        handleFunction={() => handleAddUsers(u)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupChatModel

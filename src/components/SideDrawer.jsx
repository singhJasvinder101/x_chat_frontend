import { Avatar, Button, Drawer, DrawerBody, DrawerCloseButton, Input, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure, useToast, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import NotificationBadge from "react-notification-badge";
import { Box, Text, Tooltip } from '@chakra-ui/react'
import { chatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './User Avatar/UserListItem';
import { getSender } from '../config/ChatLogics';
import { Badge } from 'react-bootstrap'
const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setSelectedChat, selectedChat, chats, setChats, setNotification, notification } = chatState()

    const btnRef = React.useRef()
    const toast = useToast()
    const apiUrl = import.meta.env.VITE_API_URI

    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [loadingChat, setLoadingChat] = useState(false)

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        window.location.href = "/"
    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
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
        }

    }
    useEffect(() => {
        const heandleRealtimeSearch = async () => {
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
            }
        }
        heandleRealtimeSearch()
    }, [search])

    const accessChat = async (userId) => {
        setLoadingChat(true)
        try {
            const { data } = await axios.post(`${apiUrl}/api/chats`, { userId }, {
                withCredentials: true
            });

            if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    useEffect(() => {
        if ((selectedChat && notification.length > 0) && notification?.some(n => n.chat._id === selectedChat._id)) {
            setNotification(notification.filter((notif) => {
                return notif.chat._id !== selectedChat._id
            }));
        }
    }, [selectedChat])

    return (
        <div>
            <div className="flex justify-between items-center bg-white p-3">
                <Tooltip
                    label="Search Users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text className='brand' fontSize="2xl">
                    <img className='logo d-inline-block mb-1 xs:h-[2rem] xs:w-[2rem]  md:h-[4rem] md:w-[4rem]' src="/x_chat_logo (2).png" alt="logo" />CHAT
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <div className="relative">
                                <BellIcon fontSize="2xl" m={1} />
                                <Badge className={`absolute right-0 px-2`} pill bg="danger">
                                    {notification.length > 0 ? notification.length : null}
                                </Badge>
                            </div>
                        </MenuButton>
                        <MenuList>
                            {!notification.length && <span className='px-3'>No New Messages</span>}
                            {(!selectedChat && notification.length > 0) && notification?.map((n, idx) => (
                                <MenuItem key={idx}
                                    onClick={() => {
                                        setSelectedChat(n.chat);
                                        setNotification(notification.filter((notif) => notif !== n));
                                    }}
                                >
                                    {n.chat.isGroupChat ? `New Message in ${n.chat.chatName}` :
                                        `New Message from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box className='d-flex' pb={2}>
                            <Input
                                placeholder="search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>
                        <div>
                            {
                                loading ? (
                                    <ChatLoading />
                                ) : (
                                    searchResults?.map((user, idx) => (
                                        <UserListItem
                                            key={idx}
                                            user={user}
                                            accessChatFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                )
                            }
                        </div>
                        {loadingChat && <Spinner ml='auto' className='d-flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer

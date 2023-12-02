import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { chatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModel from './GroupChatModel';

const MyChats = () => {
  const apiUrl = import.meta.env.VITE_API_URI
  const { selectedChat, fetchAgain, setSelectedChat, user, chats, setChats } = chatState();
  const [loggedUser, setLoggedUser] = useState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/chats`, {
        withCredentials: true
      })
      setChats(data);

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
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  return (
    <Box
      className={`${selectedChat ? 'xs:hidden' : 'xs:flex'} md:flex`}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        d="flex"
        w="100%"
        className='d-flex justify-between'
        alignItems="center"
      >
        My Chats
        <Tooltip label="New Group Chat" placement="bottom-start" hasArrow>
          <Button
            ml={{ md: 4 }}
            d="flex"
            fontSize={{ base: "13px", md: "14px", lg: "14px" }}
            rightIcon={<AddIcon fontSize="11px" />}
          >
            <GroupChatModel>
              <span className='md:block xs:hidden'>New Group Chat</span>
            </GroupChatModel>
          </Button>
        </Tooltip>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                <Text fontSize={'sm'}>
                  {/* {console.log(chat)} */}
                  {chat.latestMessage && (
                    <>
                      <span>{chat?.latestMessage?.sender.name} : {chat?.latestMessage?.content}</span>
                    </>
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats

import React from 'react'
import { Box } from '@chakra-ui/react'
import { chatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const { selectedChat, fetchAgain, setFetchAgain } = chatState()
  return (
    <Box
      className={`${selectedChat ? 'xs:flex flex-col' : 'xs:hidden'} justify-center md:flex sm:w-[100%] md:w-[68%]`}
      // className='xs:hidden'
      alignItems="center"
      p={3}
      bg="white"
      borderRadius="lg"
      w={{ base: "100%", md: "68%" }}
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox

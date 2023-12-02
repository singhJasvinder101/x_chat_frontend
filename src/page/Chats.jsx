import React, { useState } from 'react'
import { chatState } from '../context/ChatProvider'
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import { Box, Button, Text, Tooltip } from '@chakra-ui/react'


const Chats = () => {
  const { user } = chatState()
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  return (
    <div>
      {/* {user && <SideDrawer />} */}
      {user && <SideDrawer />}
      <div className='d-flex justify-between w-100 chat-page p-3' >
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  )
}

export default Chats

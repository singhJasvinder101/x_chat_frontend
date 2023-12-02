import React from 'react'
import './Scrollbarstyle.css'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { chatState } from '../context/ChatProvider'

const ScrollableChat = ({ messages }) => {
    const { user } = chatState()
    return (
        <div className='px-3'>
            {messages && messages.map((m, idx) => (
                <div key={idx} className="d-flex">
                    {(
                        isSameSender(messages, m, idx, user._id) ||
                        isLastMessage(messages, idx, user._id)
                    ) && (
                            <>
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        className=' d-inline-block'
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            </>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, idx, user._id),
                            marginTop: isSameUser(messages, m, idx, user._id) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}
                    >{m.content}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default ScrollableChat

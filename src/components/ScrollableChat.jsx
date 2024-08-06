import React, { useEffect, useRef, useState } from 'react'
import './Scrollbarstyle.css'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { chatState } from '../context/ChatProvider'
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit, FaSave } from "react-icons/fa";
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URI

const ScrollableChat = ({ messages, setMessages, setFetchAgain }) => {
    const { user } = chatState()
    const [hoverId, setHoverId] = useState(null)
    const [editId, setEditId] = useState(null)
    const contentEdited = useRef('')


    useEffect(() => {
        setHoverId(null);
    }, []);

    async function handleMouseHover(id) {
        setHoverId(id);
    }

    function handleMouseLeave() {
        setHoverId(null);
        setEditId(null);
        contentEdited.current = ""
    }

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`${apiUrl}/api/message/delete`, {
                data: { messageId: id },
                withCredentials: true,
            });
            if (data.message === "Message Deleted") {
                const newMessages = messages.filter((m) => m._id !== id);
                setMessages(newMessages);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }

    const handleEditMessage = async (id) => {
        setEditId(id);
        const message = messages.find(m => m._id === id);
        contentEdited.current = message.content;
    }

    const handleSaveEdit = async (id) => {
        try {
            const { data } = await axios.patch(`${apiUrl}/api/message/edit`, {
                messageId: id,
                newContent: contentEdited.current,
            }, {
                withCredentials: true,
            });
            if (data.message === "Message Edited") {
                setFetchAgain(prev => !prev);
                const message = messages.find(m => m._id === id);
                message.content = contentEdited.current;
                setEditId(null);
            }
        } catch (error) {
            console.error('Error editing message:', error);
        }
    }



    return (
        <div className='px-3'>
            {messages && messages.map((m, idx) => (
                <div
                    key={idx}
                    className="d-flex"
                    onMouseOver={() => handleMouseHover(m._id)}
                    onMouseLeave={handleMouseLeave}
                >
                    {(
                        isSameSender(messages, m, idx, user._id) ||
                        isLastMessage(messages, idx, user._id)
                    ) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    className='d-inline-block'
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                    <span
                        className="flex items-center justify-between"
                        style={{
                            marginLeft: isSameSenderMargin(messages, m, idx, user._id),
                            marginTop: isSameUser(messages, m, idx, user._id) ? 5 : 10,
                        }}
                    >
                        <span className="cursor-pointer">
                            {m.sender._id === user._id && m._id === hoverId && (
                                <div className="flex items-center">
                                    <Tooltip label="Delete">
                                        <span>
                                            <RiDeleteBin5Line size={16} onClick={() => handleDelete(m._id)} />
                                        </span>
                                    </Tooltip>
                                    <Tooltip label="Edit">
                                        <span>
                                            {editId !== m._id &&
                                                <FaEdit size={16} onClick={() => handleEditMessage(m._id)} />
                                            }
                                        </span>
                                    </Tooltip>
                                    <Tooltip label="Save">
                                        <span>
                                            {editId === m._id &&
                                                <FaSave onClick={() => handleSaveEdit(m._id)} size={16} />
                                            }
                                        </span>
                                    </Tooltip>
                                </div>
                            )}
                        </span>
                        <span
                            dir="ltr"
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "100%",
                                
                                display: 'inline-block'
                            }}
                            contentEditable={m.sender._id === user._id && m._id === editId}
                            onInput={(e) => contentEdited.current = e.currentTarget.textContent}
                            suppressContentEditableWarning={true}
                            onBlur={() => { }}
                        >
                            {m.sender._id === user._id && m._id === editId ? contentEdited.current : m.content}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    )
}

export default ScrollableChat

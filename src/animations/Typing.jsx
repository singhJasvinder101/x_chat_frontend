import React from 'react'
import './typing.css'
const Typing = () => {
    return (
        <div className="typing-indicator p-2 mb-2 ml-3 bg-transparent">
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
        </div>
    )
}

export default Typing

import { Tooltip } from '@chakra-ui/react';
import React from 'react';
import { Detector } from 'react-detect-offline';
import { GoDotFill } from 'react-icons/go';
import { chatState } from '../context/ChatProvider';

const OnlineStatus = () => {
    const { status, setStatus } = chatState()
    const handleOnlineChange = (isOnline) => {
        localStorage.setItem("isOnline", isOnline);
    };


    return (
        <div>
            <Detector
                render={({ online }) => {
                    handleOnlineChange(online);
                    return (
                        <Tooltip label={online ? "Online" : "Offline"}>
                            <span className="cursor-pointer">
                                <GoDotFill color={online ? "green" : "red"} size={20} />
                            </span>
                        </Tooltip>
                    );
                }}
            />
        </div>
    );
};

export default OnlineStatus;

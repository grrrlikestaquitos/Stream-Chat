import { Client } from 'tmi.js'
import { useEffect, useState, useRef, useCallback } from 'react'
import { debounce, getRandomColor } from '../util/util'
import { StreamMessage } from './StreamMessage'

import '../css/App.css'

export const StreamChat = () => {
    // State
    const [rerenderUI, setRerenderUI] = useState(false)
    const [messages, setMessages] = useState([])
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

    // Refs
    const client = useRef(null)
    const usernameColors = useRef({})
    const lastMessageTimestamp = useRef(Date.now())
    const lastMessageRef = useRef(undefined)

    // Refs Dependent on state
    const messagesRef = useRef([])
    const rerenderUIRef = useRef(false)
    const autoScrollEnabledRef = useRef(true)

    messagesRef.current = messages
    rerenderUIRef.current = rerenderUI
    autoScrollEnabledRef.current = autoScrollEnabled

    // Use Effect
    useEffect(() => {
        client.current = new Client({
            connection: {
                secure: true,
                reconnect: true
            },
            channels: ['grrrlikestaquitos']
        })

        connectAndListenToMessage()
        rerenderMessageList()
    }, [])

    useEffect(() => {
        autoScrollEnabled && scrollToBottom()
    }, [messages])

    // Message Handling
    const connectAndListenToMessage = () => {
        client.current.connect()
        client.current.on('message', newMessageReceived)
    }

    const newMessageReceived = (channel, tags, message) => {
        const newMessage = {
            username: tags.username,
            timestamp: tags['tmi-sent-ts'],
            message
        }

        generateUsernameColors(newMessage.username)
        generateMessagesList(newMessage)
    }

    const rerenderMessageList = () => {
        const fiveSeconds = 1000 * 5

        setInterval(() => {
            const diffInTime = Date.now() - lastMessageTimestamp.current

            diffInTime >= fiveSeconds && setRerenderUI(!rerenderUIRef.current)
        }, fiveSeconds)
    }

    const generateUsernameColors = (username) => {
        // First time user joined chat, no color assigned to themselves, assign new color
        if (usernameColors.current[username] === undefined) {
            usernameColors.current[username] = getRandomColor()
        }
    }

    const generateMessagesList = (newMessage) => {
        const { username, message, timestamp } = newMessage

        const newMessageList = [...messagesRef.current]
        const lastMessageInList = newMessageList[newMessageList.length - 1]

        if (lastMessageInList !== undefined && lastMessageInList.username === username) { // Most recent user sent another message
            lastMessageInList.message += "\\n" + message
            lastMessageInList.timestamp = timestamp
        } else {
            newMessageList.push(newMessage)
        }

        newMessageList.length > 10 && newMessageList.shift()

        lastMessageTimestamp.current = Date.now()
        setMessages(newMessageList)
    }

    const getLastMessageRef = (ref) => {
        lastMessageRef.current = ref
    }

    // Touch/UI Events 
    const onScroll = ({ target }) => {
        const lastMessageHeight = 40
        const currentScrollHeightFloor = target.scrollHeight - Math.floor(target.scrollTop)
        const currentScrollHeightCeil = target.scrollHeight - Math.ceil(target.scrollTop)
        const scrollTopDifference = currentScrollHeightCeil - target.clientHeight

        const didScrollToBottom = scrollTopDifference < lastMessageHeight ||
                                  currentScrollHeightCeil === target.clientHeight ||
                                  currentScrollHeightFloor === target.clientHeight

        !didScrollToBottom && setAutoScrollEnabled(false)
        didScrollToBottom && setAutoScrollEnabled(true)
    }

    const scrollToBottom = () => {
        lastMessageRef.current !== undefined &&
        lastMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    const onClickAutoScroll = () => {
        !autoScrollEnabledRef.current && scrollToBottom()
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ backgroundColor: '#6383A5', alignItems: 'center', zIndex: 100 }}>
                <span style={{ margin: '1%', fontSize: 28 }}>grrrlikestaquitos chat</span>
            </div>

            <div style={{ flex: 1, overflowY: 'scroll' }} onScroll={onScroll}>
                {messages.map((messageObj, index, readOnlyArray) => {
                    const { username, timestamp, message } = messageObj
                    const isMostRecentMessage = !!(readOnlyArray.length - 1 === index)

                    return (
                        <StreamMessage
                            key={username + message + index}
                            username={username}
                            timestamp={timestamp}
                            message={message}
                            usernameColors={usernameColors.current}
                            isMostRecentMessage={isMostRecentMessage}
                            getLastMessageRef={getLastMessageRef}
                        />
                    )
                })}
            </div>

            {!autoScrollEnabled &&
            <div onClick={onClickAutoScroll} style={{ backgroundColor: '#F5BE52', alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <span style={{ margin: '1%', fontSize: 28 }}>Resume AutoScroll</span>
            </div>
            }
        </div>
    )
}
import { Client } from 'tmi.js'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getRandomColor } from '../util/util'
import { StreamMessage } from './StreamMessage'

import '../css/App.css'

const Constants = {
    chatHeader: 'Chat',
    chatPaused: 'Chat Paused'
}

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
        let newMessage = {
            username: tags.username,
            timestamp: tags['tmi-sent-ts'],
            message
        }

        newMessage = filterMessage(newMessage)
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

    const filterMessage = (message) => {
        let filteredMessage = message
        filteredMessage.message = filteredMessage.message.replace(/\\n/g, '') // Remove any linebreaks inputted by viewers (in an attempt to override user settings)
        return filteredMessage
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

        if (lastMessageInList !== undefined && lastMessageInList.username === username && false) { // Most recent user sent another message
            lastMessageInList.message += '\\n' + message
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
        <div style={Styles.containerDiv}>
            <div style={Styles.headerDiv}>
                <span style={Styles.headerSpan}>{Constants.chatHeader}</span>
            </div>

            <div style={Styles.messagesDiv} onScroll={onScroll}>
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
            <div style={Styles.autoScrollDiv} onClick={onClickAutoScroll}>
                <span style={Styles.autoScrollSpan}>{Constants.chatPaused}</span>
            </div>
            }
        </div>
    )
}

const Styles = {
    containerDiv: {
        width: '100%',
        height: '100%'
    },
    headerDiv: {
        backgroundColor: '#6383A5',
        alignItems: 'center',
        zIndex: 100
    },
    headerSpan: {
        margin: '1%',
        fontSize: 28
    },
    messagesDiv: {
        flex: 1,
        overflowY: 'scroll'
    },
    autoScrollDiv: {
        backgroundColor: '#F5BE52',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    autoScrollSpan: {
        margin: '1%',
        fontSize: 28
    }
}
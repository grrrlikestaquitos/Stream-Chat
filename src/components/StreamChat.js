import { Client } from 'tmi.js'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getRandomColor } from '../util/util'
import { StreamMessage } from './StreamMessage'
import { StreamSettings } from './StreamSettings'
import { StreamHeader } from './StreamHeader'
import SettingsLogo from '../images/settings-logo-2.svg'
import Constants from '../util/constants'
import { config } from '../config'
import { RendererStore as store } from '../util/rendere-store'
import '../css/App.css'

export const StreamChat = () => {
    const storedUsername = store.get(config.username.key)
    const storedMessageMerging = store.get(config.consecutiveMessageMerging.key)
    const storedMessageLimit = store.get(config.messageLimit.key)

    // State
    const [rerenderUI, setRerenderUI] = useState(false)
    const [messages, setMessages] = useState([])
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
    const [enableResumeHighlight, setEnableResumeHighlight] = useState(false)
    const [showSettingsPage, setShowSettingsPage] = useState(false)
    const [userName, setUserName] = useState(storedUsername)
    const [showMergedMessages, setShowMergedMessages] = useState(storedMessageMerging)

    // Refs
    const client = useRef(null)
    const usernameColors = useRef({})
    const lastMessageTimestamp = useRef(Date.now())
    const lastMessageRef = useRef(undefined)

    // Refs Dependent on state
    const messagesRef = useRef([])
    const rerenderUIRef = useRef(false)
    const autoScrollEnabledRef = useRef(true)
    const showMergedMessagesRef = useRef(storedMessageMerging)

    messagesRef.current = messages
    rerenderUIRef.current = rerenderUI
    autoScrollEnabledRef.current = autoScrollEnabled
    showMergedMessagesRef.current = showMergedMessages

    // Use Effect
    useEffect(() => {
        client.current = new Client({
            connection: {
                secure: true,
                reconnect: true
            },
            channels: [userName]
        })

        connectAndListenToMessage()
        rerenderMessageList()

        return () => {
            client.current.disconnect()
            setMessages([])
        }
    }, [userName])

    useEffect(() => {
        setMessages([])
    }, [showMergedMessages])

    useEffect(() => {
        const unsubscribeUserName = store.onDidChange(config.username.key, (newUsernameValue) => {
            setUserName(newUsernameValue)
        })

        const unsubscribeMessageMerging = store.onDidChange(config.consecutiveMessageMerging.key, (newShowMessageMergeValue) => {
            setShowMergedMessages(newShowMessageMergeValue)
        })

        return () => {
            unsubscribeUserName()
            unsubscribeMessageMerging()
        }
    }, [])

    useEffect(() => {
        autoScrollEnabled && messages.length > 0 && scrollToBottom()
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

        console.log(showMergedMessagesRef.current)

        if (lastMessageInList !== undefined && lastMessageInList.username === username && showMergedMessagesRef.current) { // Most recent user sent another message
            lastMessageInList.message += '\\n' + message
            lastMessageInList.timestamp = timestamp
        } else {
            newMessageList.push(newMessage)
        }

        newMessageList.length > storedMessageLimit && newMessageList.shift()

        lastMessageTimestamp.current = Date.now()
        setMessages(newMessageList)
    }

    const getLastMessageRef = (ref) => {
        lastMessageRef.current = ref
    }

    // Touch/UI Events
    const onClickSettings = () => {
        setShowSettingsPage(!showSettingsPage)
    }

    const onScroll = ({ target }) => {
        const lastMessageHeight = 60
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
        setEnableResumeHighlight(false)
    }

    const onMouseOver = () => {
        setEnableResumeHighlight(true)
    }

    const onMouseOut = () => {
        setEnableResumeHighlight(false)
    }

    return (
        <div style={Styles.containerDiv}>
            {showSettingsPage && <StreamSettings/>}

            <div style={Styles.chatContainerDiv}>

                <StreamHeader color={'#4C6B6B'}>
                    <img style={Styles.settingsImg} src={SettingsLogo} onClick={onClickSettings}/>
                    <span style={Styles.headerSpan}>{Constants.chat.chatHeader}</span>
                </StreamHeader>

                {!userName &&
                <div style={Styles.requireUsernameDiv}>
                    <span style={Styles.requireUsernameSpan}>
                        {Constants.chat.requireUsername1}
                        <br/>
                        <br/>
                        {Constants.chat.requireUsername2}
                    </span>
                </div>
                }

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
                <span style={{...Styles.autoScrollSpan, backgroundColor: enableResumeHighlight ? '#8C8C8C' : '#424242' }} 
                    onMouseOver={onMouseOver} 
                    onMouseOut={onMouseOut} 
                    onClick={onClickAutoScroll}>
                    {Constants.chat.chatPaused}
                </span>}
            </div>
        </div>
    )
}

const Styles = {
    containerDiv: {
        width: '100%',
        height: '100%',
        flexDirection: 'row'
    },
    chatContainerDiv: {
        flex: 1
    },
    settingsImg: {
        position: 'absolute',
        alignSelf: 'flex-start',
        margin: 8,
        height: 30,
        fill: 'red',
        aspectRatio: 1
    },
    headerSpan: {
        margin: 8,
        fontSize: 24
    },
    messagesDiv: {
        flex: 1,
        overflowY: 'scroll'
    },
    autoScrollSpan: {
        display: 'inline-block',
        borderColor: '#8C8C8C',
        borderWidth: 3,
        borderStyle: 'solid',
        opacity: 0.85,
        borderRadius: 8,
        alignSelf: 'center',
        position: 'absolute',
        alignItems: 'center',
        bottom: 16,
        padding: '1.3%',
        fontSize: 24
    },
    requireUsernameDiv: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    requireUsernameSpan: {
        fontSize: 25,
        fontWeight: 'bold',
        width: '70%',
        textAlign: 'center'
    }
}
import { Client } from 'tmi.js'
import { useEffect, useState, useRef } from 'react'
import { getRandomColor } from '../util/util'
import { StreamMessage } from './StreamMessage'

import '../css/App.css'

export const StreamChat = () => {
    const client = useRef(null)

    // State
    const [rerenderUI, setRerenderUI] = useState(false)
    const [messages, setMessages] = useState([])

    // Refs
    const usernameColors = useRef({})
    const lastMessageTimestamp = useRef(Date.now())
    const lastMessageRef = useRef(undefined)

    // Refs Dependent on state
    const messagesRef = useRef([])
    const rerenderUIRef = useRef(false)

    messagesRef.current = messages
    rerenderUIRef.current = rerenderUI

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
        // rerenderMessageList()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (lastMessageRef.current !== undefined) {
            lastMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }

    const connectAndListenToMessage = () => {
        client.current.connect()

        client.current.on('message', (channel, tags, message) => {
            const newMessage = {
                username: tags.username,
                timestamp: tags['tmi-sent-ts'],
                message
            }

            generateUsernameColors(newMessage.username)
            generateMessagesList(newMessage)
        })
    }

    const rerenderMessageList = () => {
        const fiveSeconds = 1000 * 5

        setInterval(() => {
            const diffInTime = Date.now() - lastMessageTimestamp.current

            if (diffInTime >= fiveSeconds) {
                setRerenderUI(!rerenderUIRef.current)
            }
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

        if (newMessageList.length > 10) {
            newMessageList.shift()
        }

        lastMessageTimestamp.current = Date.now()
        setMessages(newMessageList)
    }

    const getLastMessageRef = (ref) => {
        lastMessageRef.current = ref
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ backgroundColor: '#6383A5', alignItems: 'center', zIndex: 100 }}>
                <span style={{ margin: '1%', fontSize: 28 }}>grrrlikestaquitos chat</span>
            </div>
            <div style={{ flex: 1, overflowY: 'scroll' }}>
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
        </div>
    )
}
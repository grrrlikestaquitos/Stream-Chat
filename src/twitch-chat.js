import { Client } from 'tmi.js'
import { PureComponent } from 'react'
import { getRandomColor } from './util'
import './App.css'

export class TwitchChat extends PureComponent {
    client
    userColor

    constructor(props) {
        super(props)

        this.userColor = {}

        this.client = new Client({
            connection: {
                secure: true,
                reconnect: true
            },
            channels: ['grrrlikestaquitos', 't_mikage']
        })

        this.state = {
            messages: [],
            shouldRender: false
        }
    }

    componentDidMount() {
        this.client.connect()

        this.client.on('message', (channel, tags, message) => {
            const newMessage = {
                username: tags.username,
                timestamp: tags['tmi-sent-ts'],
                message
            }

            this.onMessageReceived(newMessage)
        })

        const fiveSeconds = 1000 * 5

        setInterval(() => {
            this.setState({ shouldRender: !this.state.shouldRender })
        }, fiveSeconds)
    }

    

    getMessageTimestamp = (timestamp) => {
        // Parse my timestamp to the following format: minutes, seconds
        // Check time difference in timestamp from now
        const differenceInTime = Date.now() - timestamp

        const oneSecond = 1000
        const oneMinute = oneSecond * 60

        if (differenceInTime >= oneMinute) {
            const minutes = Math.floor(differenceInTime / oneMinute)
            return `${minutes} min ago`
        } else {
            const seconds = Math.floor(differenceInTime / oneSecond)
            return `${seconds} sec ago`
        }
    }

    getUserColors = (username) => {
        // First time user joined chat, no color assigned to themselves, assign new color
        if (this.userColor[username] === undefined) {
            const newUserColors = {...this.userColor}
            newUserColors[username] = getRandomColor()
            return newUserColors
        } else {
            return this.userColor
        }
    }

    getMessages = (newMessage) => {
        const { username, message} = newMessage
        const newMessageList = [...this.state.messages]

        const lastMessageInList = newMessageList[newMessageList.length - 1]

        if (lastMessageInList !== undefined && lastMessageInList.username === username) { // Most recent user sent another message
            lastMessageInList.message += "\\n" + message
        } else {
            newMessageList.push(newMessage)
        }

        if (newMessageList.length > 10) {
            newMessageList.shift()
        }

        return newMessageList
    }

    onMessageReceived = (message) => {
        const messages = this.getMessages(message)
        const userColors = this.getUserColors(message.username)

        this.userColor = userColors
        this.setState({
            messages
        })
    }

    renderMessage = ({ username, message, timestamp }) => {
        const userColor = this.userColor[username]
        const messageTimestamp = this.getMessageTimestamp(timestamp)
        
        return (
            <div style={{ padding: 16 }}>
                <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 26, fontWeight: 'bold', color: userColor }}>{username}</span>
                    <span style={{ fontSize: 22 }}>{messageTimestamp}</span>
                </div>
                {message.split('\\n').map((text) => (
                    <span style={{ fontSize: 26 }}>{text}</span>
                ))}
            </div>
        )
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ width: '100%', backgroundColor: '#7A8284', alignItems: 'center', zIndex: 100 }}>
                    <span style={{ margin: 8, fontSize: 25 }}>grrrlikestaquitos chat</span>
                </div>
                <div style={{ height: '95%', width: '100%', justifyContent: 'flex-end' }}>
                    {this.state.messages.map((message) => this.renderMessage(message))}
                </div>
            </div>
        )
    }
}
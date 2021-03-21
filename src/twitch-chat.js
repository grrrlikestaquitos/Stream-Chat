import { Client } from 'tmi.js'
import { PureComponent } from 'react'
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
            channels: ['grrrlikestaquitos']
            // channels: ['grrrlikestaquitos', 't_mikage', 'snowxcones', 'littleteabad504']
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

    getRandomColor = () => {
        const randomNumber = Math.floor(Math.random() * (10 - 1) + 1)

        switch (randomNumber) {
            case 0:
                return '#69A4FF'
            case 1:
                return '#ff8469'
            case 2:
                return '#FFEC69'
            case 3:
                return '#FF6991'
            case 4:
                return '#FFDB69'
            case 5:
                return '#6DFF69'
            case 6:
                return '#69FFD1'
            case 7:
                return '#69C0FF'
            case 8:
                return '#F291B9'
            case 9:
                return '#91E3F2'
            default: return '#ffffff'
        }
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
            newUserColors[username] = this.getRandomColor()
            return newUserColors
        } else {
            return this.userColor
        }
    }

    getMessages = (message) => {
        const newMessageList = [...this.state.messages]
        newMessageList.push(message)

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
            <div style={{ flexDirection: 'column' }}>
                <div style={{ flexDirection: 'column',  margin: 20 }}>
                    <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 22, fontWeight: 'bold', color: userColor }}>{username}</span>
                        <span style={{ fontSize: 20 }}>{messageTimestamp}</span>
                    </div>
                    <span style={{ fontSize: 22 }}>{message}</span>
                </div>
                <hr style={{ width: '100%', backgroundColor: 'white' }}/>
            </div>
        )
    }

    render() {
        return (
            <div style={{ flex: 1, flexDirection: 'column', alignSelf: 'flex-end' }}>
                {this.state.messages.map((message) => this.renderMessage(message))}
            </div>
        )
    }
}
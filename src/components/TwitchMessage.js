import '../css/App.css'

export const TwitchMessage = ({ username, timestamp, message, usernameColor }) => {
    const getMessageTimestamp = (timestamp) => {
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

    const messageTimestamp = getMessageTimestamp(timestamp)

    return (
        <div style={{ padding: 16 }}>
            <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 28, fontWeight: 'bold', color: usernameColor }}>{username}</span>
                <span style={{ fontSize: 24 }}>{messageTimestamp}</span>
            </div>
            {message.split('\\n').map((text, index) => (
                <span key={text + index} style={{ fontSize: 28 }}>{text}</span>
            ))}
        </div>
    )
}
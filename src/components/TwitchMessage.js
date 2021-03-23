import '../css/App.css'

export const TwitchMessage = ({ username, timestamp, message, usernameColors }) => {
    const getMessageTimestamp = (timestamp) => {
        // Check time difference in timestamp from now
        const differenceInTime = Date.now() - timestamp

        const oneSecond = 1000
        const oneMinute = oneSecond * 60

        if (differenceInTime >= oneMinute) {
            const minutes = Math.floor(differenceInTime / oneMinute)
            return `${minutes} min ago`
        } else {
            const seconds = Math.ceil(differenceInTime / oneSecond)
            return `${seconds} sec ago`
        }
    }

    const messageTimestamp = getMessageTimestamp(timestamp)

    const renderMessage = () => {
        return (
            message.split('\\n').map((text, index) => {
                const arrayOfText = text.split(' ') // Array of text with a white space delimiter

                return (
                    <div style={{ display: 'inline-block', flexDirection: 'row' }}>
                        {arrayOfText.map((subText, subIndex) => {
                            const regex = new RegExp('@[^\s]+')
                            const containsUserMention = regex.test(subText)
                            var color = 'white'
    
                            if (containsUserMention) {
                                const extractedUsername = subText.substring(1).toLowerCase()
                                console.log(`extracted username: ${extractedUsername}`)
                                color = usernameColors[extractedUsername]
                            }
                            
                            return (
                                <span key={username + text + index + subIndex} style={{ fontSize: 28, color }}>{subText + ' '}</span>
                            )
                        })}
                    </div>
                )
            })
        )
    }

    return (
        <div>
            <hr style={{ width: '100%', border: 'none', color: '#7A808A', backgroundColor: '#7A808A', height: '2px' }}/>
            <div style={{ paddingLeft: '4%', paddingRight: '4%', paddingTop: '2%', paddingBottom: '2%' }}>
                <div style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 28, fontWeight: 'bold', color: usernameColors[username] }}>{username}</span>
                    <span style={{ fontSize: 24 }}>{messageTimestamp}</span>
                </div>
                {renderMessage()}
            </div>
        </div>
    )
}
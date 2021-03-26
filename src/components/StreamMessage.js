import { useCallback } from 'react'
import '../css/App.css'

// PROPS
// username (string, required)
// timestamp (string, required)
// message (string, required)
// usernameColors (string, required)
// isMostRecentMessage (boolean, optional)
// getLastMessageRef ((ref: HTMLRef) => void, optional)

export const StreamMessage = ({ username, timestamp, message, usernameColors, isMostRecentMessage, getLastMessageRef }) => {
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

    // wrap this into a useCallback or memo
    const retrieveMessageRef = useCallback((ref) => {
        console.log(`Ref is being assigned ${ref}`)
        if (getLastMessageRef !== undefined && isMostRecentMessage) {
            getLastMessageRef(ref)
        }
    }, [message])

    const messageTimestamp = getMessageTimestamp(timestamp)

    const renderMessage = () => {
        return (
            message.split('\\n').map((text, index, readOnlyArray) => {
                const arrayOfText = text.split(' ') // Split text if there is a white space
                const isLastItem = (readOnlyArray.length - 1) === index

                return (
                    <div key={username + text + index } style={{ display: 'inline-block', flexDirection: 'row' }} ref={isLastItem ? retrieveMessageRef : null}>
                        {arrayOfText.map((subText, subIndex) => {
                            const regex = new RegExp('@[^\s]+')
                            const containsUserMention = regex.test(subText)
                            var color = 'white'
    
                            if (containsUserMention) {
                                const extractedUsername = subText.substring(1).toLowerCase()
                                console.log(`extracted username: ${extractedUsername}`)
                                color = usernameColors[extractedUsername]
                            }
                            
                            return <span key={username + subText + subIndex} style={{ fontSize: 28, color }}>{subText + ' '}</span>
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
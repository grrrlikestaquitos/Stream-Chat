import { useCallback } from 'react'
import { RendererStore as store } from '../util/rendere-store'
import '../css/App.css'
import { config } from '../config'

// PROPS
// username (string, required)
// timestamp (string, required)
// message (string, required)
// usernameColors (string, required)
// isMostRecentMessage (boolean, optional)
// getLastMessageRef ((ref: HTMLRef) => void, optional)

export const StreamMessage = ({ username, timestamp, message, usernameColors, isMostRecentMessage, getLastMessageRef }) => {
    const showTimestamps = store.get(config.enableTimestamps.key)
    const showUserColorMentions = store.get(config.viewerColorReferenceInChat.key)
    const showMergedMessages = store.get(config.consecutiveMessageMerging.key)

    const getMessageTimestamp = (timestamp) => {
        if (!showTimestamps) {
            return
        }

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

    const getUsernameIfMentioned = (text) => {
        const regex = new RegExp('@[^\s]+')
        const containsUserMention = regex.test(text)

        if (containsUserMention && showUserColorMentions) {
            const extractedUsername = text.substring(1).toLowerCase()
            return extractedUsername
        }
    }

    const retrieveMessageRef = useCallback((ref) => {
        if (getLastMessageRef !== undefined && isMostRecentMessage) {
            getLastMessageRef(ref)
        }
    }, [message])

    const renderMessage = useCallback(() => {
        const renderableMessageComponent = (text, index, readOnlyArray) => {
            const isLastItem = (readOnlyArray.length - 1) === index

            const renderableSubTextComponent = (subText, subIndex) => {
                const username = getUsernameIfMentioned(subText)
                const color = usernameColors[username]
                return <span key={username + subText + subIndex} style={{ fontSize: 28, color }}>{subText + ' '}</span>
            }

            if (showUserColorMentions) {
                const arrayOfText = text.split(' ') // Split text if there is a white space
                return (
                    <div key={username + text + index } style={Styles.subTextDiv} ref={isLastItem ? retrieveMessageRef : null}>
                        {arrayOfText.map(renderableSubTextComponent)}
                    </div>
                )
            }

            return (
                <div key={username + text + index } style={Styles.subTextDiv} ref={isLastItem ? retrieveMessageRef : null}>
                    {renderableSubTextComponent(text, index)}
                </div>
            )
        }

        if (showMergedMessages) { // should split messages if contains line break
            const mergedMessagesSplit = message.split(`\\n`)
            return mergedMessagesSplit.map(renderableMessageComponent)
        }
        
        return renderableMessageComponent(message, 0, [message])
    }, [showUserColorMentions, showMergedMessages])

    const messageTimestamp = getMessageTimestamp(timestamp)

    return (
        <div>
            <hr style={Styles.lineHr}/>
            <div style={Styles.messageDiv}>
                <div style={Styles.userNameDiv}>
                    <span style={{...Styles.userNameSpan, color: usernameColors[username]}}>{username}</span>
                    <span style={Styles.timestampSpan}>{messageTimestamp}</span>
                </div>
                {renderMessage()}
            </div>
        </div>
    )
}

const Styles = {
    lineHr: {
        width: '100%',
        border: 'none',
        color: '#7A808A',
        backgroundColor: '#7A808A',
        height: '2px'
    },
    messageDiv: {
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: '2%',
        paddingBottom: '2%'
    },
    subTextDiv: {
        display: 'inline-block',
        flexDirection: 'row'
    },
    userNameDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userNameSpan: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    timestampSpan: {
        fontSize: 24
    }
}
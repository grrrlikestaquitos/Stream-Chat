import { useCallback, useState } from 'react'
import TwitchLogo from '../images/twitch-logo-purple.svg'
import Config from '../config'
import Constants from '../util/constants'
import { RendererStore as store } from '../util/rendere-store'
import '../css/App.css'

const { config } = Config

export const StreamUserInput = () => {
    const storedUsername = store.get(config.username.key)
    const [userName, setUserName] = useState(storedUsername)
    const [isButtonHighlighted, setIsButtonHighlighted] = useState(false)

    const onMouseOver = () => {
        setIsButtonHighlighted(true)
    }

    const onMouseOut = () => {
        setIsButtonHighlighted(false)
    }

    const onChange = (event) => {
        const text = event.target.value
        setUserName(text)
    }

    const onClick = useCallback(() => {
        if (isButtonEnabled()) {
            console.log(userName)
        }
    }, [userName])

    const isButtonEnabled = useCallback(() => {
        if (storedUsername !== userName) { // Username has changed
            return true
        }
        return false
    }, [userName])

    const highlightedStyle = isButtonHighlighted && isButtonEnabled() && { backgroundColor: '#E0E0E0' }

    return (
        <div style={Styles.usernameContainerDiv}>
            <div style={Styles.usernameInputDiv}>
                <input
                    style={Styles.usernameInput}
                    type={'text'}
                    value={userName}
                    placeholder={Constants.userInput.usernamePlaceHolder}
                    onChange={onChange}/>
                <img style={{ height: 26 }} src={TwitchLogo}/>
            </div>

            <hr style={{ width: '90%' }}/>

            <button
                style={{...Styles.usernameButton, ...highlightedStyle }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut} onClick={onClick}
                disabled={!isButtonEnabled()}>
                <span style={{ fontSize: 16 }}>{Constants.userInput.connect}</span>
            </button>
        </div>
    )
}

const Styles = {
    usernameContainerDiv: {
        height: 120,
        flexShrink: 0,
        justifyContent: 'center',
        backgroundColor: '#484F59'
    },
    usernameInputDiv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 12,
        paddingRight: 12
    },
    usernameInput: {
        fontSize: 18,
        color: '#B483FE',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none'
    },
    usernameButton: {
        width: '60%',
        alignSelf: 'center',
        borderRadius: 4,
        outline: 'none',
        border: 'none',
        padding: 8
    }
}
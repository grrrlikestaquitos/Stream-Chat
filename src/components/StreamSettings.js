import { useState } from 'react'
import Config from '../config'
import { StreamHeader } from './StreamHeader'
import TwitchLogo from '../images/twitch-logo-purple.svg'
import '../css/App.css'

const Store = window.require('electron-store')
const store = new Store()

const Constants = {
    header: 'Settings',
    usernamePlaceHolder: 'Type your username'
}

const SettingsUserName = () => {
    const storedUsername = store.get(Config.username.key)
    const [userName, setUserName] = useState(storedUsername)

    const onChange = (event) => {
        const text = event.target.value
        setUserName(text)
    }

    const isButtonDisabled = () => {
        // Check if strings match 
    }

    return (
        <div style={{ height: 120, flexShrink: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#484F59' }}>
            <div style={{ flexDirection: 'row' }}>
                <input
                    style={{ fontSize: 18, color: '#B483FE', alignItems: 'center', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    type={'text'}
                    value={userName}
                    placeholder={Constants.usernamePlaceHolder}
                    onChange={onChange}/>
                <img style={{ height: 26 }} src={TwitchLogo}/>
            </div>
            <hr style={{ width: '90%'}}/>
            <button disabled={false}>
                <span>Hello</span>
            </button>
        </div>
    )
}

const SettingsFeature = ({ keyId, title, type }) => {
    const storedValue = store.get(keyId)

    const [toggleEnabled, setToggleEnabled] = useState(storedValue)
    const [currentNumber, setCurrentNumber] = useState(storedValue)
    const [highlightFeature, setHighlightFeature] = useState(false)

    const backgroundColor = toggleEnabled ? '#2BD853': '#EA5555'
    const alignItems = toggleEnabled ? 'flex-end' : 'flex-start'
    const highlightedBackground = highlightFeature ? '#545454' : 'transparent'

    const isToggableFeature = type === 'boolean'
    const isEditableFeature = type === 'number'

    const onMouseOver = () => {
        setHighlightFeature(true)
    }

    const onMouseOut = () => {
        setHighlightFeature(false)
    }

    const onClick = () => {
        setToggleEnabled(!toggleEnabled)
        store.set(keyId, !toggleEnabled)
    }

    const onChange = (event) => {
        const value = event.target.value
        setCurrentNumber(value)
        store.set(keyId, value)
    }

    return (
        <div style={{ ...Styles.featureDiv, backgroundColor: highlightedBackground }} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <span style={Styles.featureTitleSpan}>{title}</span>

            {isToggableFeature &&
                <div style={{ ...Styles.toggleDiv, backgroundColor, alignItems }} onClick={onClick}>
                    <div style={Styles.toggleBubbleDiv}/>
                </div>
            }
            {isEditableFeature &&
                <input style={Styles.featureInput} type={'number'} value={currentNumber} onChange={onChange}/>
            }
        </div>
    )
}

export const StreamSettings = () => {
    const listOfFeatures = [
        Config.enableTimestamps,
        Config.consecutiveMessageMerging,
        Config.viewerColorReferenceInChat,
        Config.messageLimit
    ]

    return (
        <div style={Styles.containerDiv}>
            <StreamHeader color={'#919191'}>
                <span style={Styles.headerSpan}>{Constants.header}</span>
            </StreamHeader>

            <div style={{ overflowY: 'scroll' }}>
                <SettingsUserName/>

                {listOfFeatures.map((feature) => {
                    const { key, title, type } = feature
                    return (
                        <div key={key}>
                            <SettingsFeature keyId={key} type={type} title={title}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const Styles = {
    containerDiv: {
        flex: 0.5,
        backgroundColor: '#646464',
    },
    headerSpan: {
        margin: 8,
        fontSize: 24
    },
    featureDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16
    },
    featureTitleSpan: {
        flex: 1,
        fontSize: 20,
        paddingRight: 10,
        color: '#ECECEC'
    },
    featureInput: {
        width: 50,
        height: 25
    },
    toggleDiv: {
        flexGrow: 0,
        justifyContent: 'center',
        width: 50,
        height: 28,
        borderRadius: 15,
    },
    toggleBubbleDiv: {
        backgroundColor: 'white',
        width: 20.5,
        height: 20.5,
        borderRadius: 10,
        marginLeft: 4,
        marginRight: 4
    }
}
import { useState } from 'react'
import { StreamHeader } from './StreamHeader'
import { StreamUserInput } from './StreamUserInput'
import { StreamSettingsFeature } from './StreamSettingsFeature'
import Constants from '../util/constants'
import Config from '../config'
import '../css/App.css'
const { config } = Config

const Store = window.require('electron-store')
const store = new Store()

export const StreamSettings = () => {
    const listOfFeatures = [
        config.enableTimestamps,
        config.consecutiveMessageMerging,
        config.viewerColorReferenceInChat,
        config.messageLimit
    ]

    const onClickResetButton = () => {
        store.clear()
    }

    return (
        <div style={Styles.containerDiv}>
            <StreamHeader color={'#919191'}>
                <span style={Styles.headerSpan}>{Constants.settings.header}</span>
            </StreamHeader>

            <div style={{ overflowY: 'scroll', paddingBottom: 50 }}>
                <StreamUserInput/>

                {listOfFeatures.map((feature) => {
                    const { key, title, type } = feature
                    return (
                        <div key={key}>
                            <StreamSettingsFeature keyId={key} type={type} title={title}/>
                        </div>
                    )
                })}

                <button style={Styles.resetButton} onClick={onClickResetButton}>
                    <label style={Styles.resetLabel}>Reset Settings</label>
                </button>
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
    resetButton: {
        alignSelf: 'center',
        width: '80%',
        backgroundColor: 'tranparent',
        outline: 'none',
        border: 'none',
        borderRadius: 5
    },
    resetLabel: {
        fontSize: 16
    }
}
import { StreamHeader } from './StreamHeader'
import { StreamUserInput } from './StreamUserInput'
import { StreamSettingsFeature } from './StreamSettingsFeature'
import Constants from '../util/constants'
import { RendererStore as store } from '../util/renderer-store'
import { config } from '../config'
import '../css/App.css'

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
                    <span style={Styles.resetLabel}>{Constants.settings.resetSettings}</span>
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
        backgroundColor: 'white',
        outline: 'none',
        border: 'none',
        borderRadius: 5,
        marginTop: 10,
        padding: 8
    },
    resetLabel: {
        fontSize: 16
    }
}
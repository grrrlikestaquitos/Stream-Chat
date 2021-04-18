import { useState } from 'react'
import { features } from '../config'
import { StreamHeader } from './StreamHeader'
import '../css/App.css'

const Store = window.require('electron-store')
const store = new Store()

const Constants = {
    header: 'Settings'
}

export const StreamSettings = () => {
    const [enableTimestamps, setEnableTimestamps] = useState(store.get(features.enableTimestamps))
    const [consecutiveMessageMerging] = useState(store.get(features.consecutiveMessageMerging))
    const [messageLimit] = useState(store.get(features.messageLimit))
    const [viewerColorReferenceInChat] = useState(store.get(features.viewerColorReferenceInChat))

    return (
        <div style={Styles.containerDiv}>
            <StreamHeader color={'#919191'}>
                <span style={Styles.headerSpan}>{Constants.header}</span>
            </StreamHeader>
        </div>
    )
}

const Styles = {
    containerDiv: {
        flex: 0.4,
        backgroundColor: '#646464',
    },
    headerSpan: {
        margin: 8,
        fontSize: 24
    }
}
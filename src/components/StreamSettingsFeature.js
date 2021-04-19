import { useState, useEffect, useRef } from 'react'
import { RendererStore as store } from '../util/rendere-store'
import '../css/App.css'

export const StreamSettingsFeature = ({ keyId, title, type }) => {
    const storedValue = store.get(keyId)

    // State
    const [toggleEnabled, setToggleEnabled] = useState(storedValue)
    const [currentNumber, setCurrentNumber] = useState(storedValue)
    const [highlightFeature, setHighlightFeature] = useState(false)

    // Refs dependant on state
    const highlightFeatureRef = useRef(storedValue)
    highlightFeatureRef.current = highlightFeature

    // Computed properties
    const backgroundColor = toggleEnabled ? '#2BD853': '#EA5555'
    const alignItems = toggleEnabled ? 'flex-end' : 'flex-start'
    const highlightedBackground = highlightFeature ? '#545454' : 'transparent'

    const isToggableFeature = type === 'boolean'
    const isEditableFeature = type === 'number'

    useEffect(() => {
        const unsubscribe = store.onDidChange(keyId, () => {
            isToggableFeature && !highlightFeatureRef.current && setToggleEnabled(storedValue)
            isEditableFeature && !highlightFeatureRef.current && setCurrentNumber(storedValue)
        })
        return () => {
            console.log('feature will unmount')
            unsubscribe()
        }
    }, [])

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

const Styles = {
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
        height: 25,
        outline: 'none'
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
    },
}
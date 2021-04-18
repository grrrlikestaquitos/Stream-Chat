import '../css/App.css'

export const StreamHeader = ({ color, children }) => {
    return (
        <div style={{ ...Styles.headerDiv, backgroundColor: color }}>
            {children}
        </div>
    )
}

const Styles = {
    headerDiv: {
        height: 45,
        alignItems: 'center',
    }
}
const Config = {
    windowBounds: { key: 'windowBounds', type: 'object', title: 'Window Bounds' },
    username: { key: 'username', type: 'string', title: 'User Name' },
    enableTimestamps: { key: 'enableTimestamps', type: 'boolean', title: 'Enable Timestamp' },
    consecutiveMessageMerging: { key: 'consecutiveMessageMerging', type: 'boolean', title: 'Enable Consecutive Message Merging' },
    messageLimit: { key: 'messageLimit', type: 'number', title: 'Message Limit' },
    viewerColorReferenceInChat: { key: 'viewerColorReferenceInChat', type: 'boolean', title: 'Enable User Mention Color Matching' }
}

module.exports.config = Config

module.exports.defaults = {
    [Config.windowBounds.key]: { width: 800, height: 600 },
    [Config.username.key]: '',
    [Config.enableTimestamps.key]: true,
    [Config.consecutiveMessageMerging.key]: true,
    [Config.messageLimit.key]: 50,
    [Config.viewerColorReferenceInChat.key]: true
}


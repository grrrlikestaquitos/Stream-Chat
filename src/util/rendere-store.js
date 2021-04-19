import Config from '../config'
const { defaults } = Config

const Store = window.require('electron-store')
export const RendererStore = new Store({ defaults })
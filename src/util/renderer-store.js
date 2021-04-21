import { defaults } from '../config'

const Store = window.require('electron-store')
export const RendererStore = new Store({ defaults })
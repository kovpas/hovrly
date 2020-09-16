module.exports = { init, toggle, show, hide, getWin }

const electron = require('electron')
const config = require('./config')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
// const twig = require('electron-twig')
const tray = require('./tray')
const Positioner = require('electron-positioner')
// const system = electron.systemPreferences
// const nativeTheme = electron.nativeTheme

var win = null
var positioner

function init() {
    console.log('window init')

    win = new BrowserWindow({
        width: config.WIN_WIDTH,
        height: 400,
        maxHeight: 500,
        frame: false,
        transparent: true,
        titleBarStyle: 'default',
        show: false,
        fullscreenable: false,
        resizable: false,
        movable: false,
        icon: config.DOCK_ICON,
        skipTaskbar: true,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    positioner = new Positioner(win)

    win.webContents.loadURL(`file://${__dirname}/templates/index.html`)
    win.setVisibleOnAllWorkspaces(true)

    win.once('ready-to-show', () => {
        win.webContents.send('app-height-get')

        ipc.on('app-height', (event, height) => {
            win.setSize(config.WIN_WIDTH, height)
        })
    })

    win.on('blur', hide)

    win.on('close', (event) => {
        if (app.quitting) {
            win = null
        } else {
            event.preventDefault()
            hide()
        }
    })
}

function getWin() {
    return win
}

function show() {
    let position = positioner.calculate('trayLeft', tray.getBounds())
    win.setPosition(position.x, position.y, false)
    win.show()
}

function hide() {
    win.hide()
}

function toggle() {
    win.isVisible() ? hide() : show()
}

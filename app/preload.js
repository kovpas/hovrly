const $ = selector => document.querySelector(selector)
const $all = selector => document.querySelectorAll(selector)
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer
const config = remote.require('./config')

function init()
{
    document.title = config.APP_NAME

    ipc.send('get-clocks')

    $('.update').innerHTML += ` <small class='version'>v${config.APP_VERSION}</small>`

    $all('.app-name').forEach(item => { item.innerText = config.APP_NAME })
}

window.addEventListener('DOMContentLoaded', init)

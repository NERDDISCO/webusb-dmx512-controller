import WebUsbConnection from './WebUsbConnection.js'

const devConsole = document.getElementById('console')

const webusbConnection = new WebUsbConnection({ devConsole })
const enableWebusb = document.getElementById('activateWebUsb')
const disconnectWebusb = document.getElementById('disconnectWebUsb')
const sendWebusb = document.getElementById('sendWebUsb')

window.webusbConnection = webusbConnection


enableWebusb.addEventListener('click', e => {
  webusbConnection.enable()
})

disconnectWebusb.addEventListener('click', e => {
  webusbConnection.disconnect()
})

sendWebusb.addEventListener('click', e => {
  // Flat PAR on Address 1: red, green, blue, uv, dimmer
  webusbConnection.send([255, 0, 0, 255, 255])
})

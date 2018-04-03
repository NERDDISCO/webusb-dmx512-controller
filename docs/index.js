import WebUsbConnection from './WebUsbConnection.js'

const devConsole = document.getElementById('console')

const webusbConnection = new WebUsbConnection({ devConsole })
const enableWebusb = document.getElementById('activateWebUsb')
const sendWebusb = document.getElementById('sendWebUsb')


enableWebusb.addEventListener('click', e => {
  webusbConnection.enable()
})

sendWebusb.addEventListener('click', e => {
  const buffer = Uint8Array.from([255, 255, 0])
  webusbConnection.send(buffer)
})

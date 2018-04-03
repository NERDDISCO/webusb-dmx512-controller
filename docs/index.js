import WebUsbConnection from './WebUsbConnection.js'

const webusbConnection = new WebUsbConnection()
const enableWebusb = document.getElementById('activateWebUsb')
const sendWebusb = document.getElementById('sendWebUsb')

enableWebusb.addEventListener('click', e => {
  webusbConnection.enable()
})

sendWebusb.addEventListener('click', e => {
  const buffer = Uint8Array.from([255, 255, 0])
  webusbConnection.send(buffer)
})

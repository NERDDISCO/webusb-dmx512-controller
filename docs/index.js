import WebUsbConnection from './WebUsbConnection.js'

const devConsole = document.getElementById('console')

const webusbConnection = new WebUsbConnection({ devConsole })
window.webusbConnection = webusbConnection

const enableWebusb = document.getElementById('activateWebUsb')
const disconnectWebusb = document.getElementById('disconnectWebUsb')
const red = document.getElementById('red')
const green = document.getElementById('green')
const blue = document.getElementById('blue')
const strobe = document.getElementById('strobe')




enableWebusb.addEventListener('click', e => {
  webusbConnection.enable()
})

disconnectWebusb.addEventListener('click', e => {
  webusbConnection.disconnect()
})

red.addEventListener('click', e => {
  // Flat PAR on Address 1: red, green, blue, uv, dimmer, strobe
  webusbConnection.send([255, 0, 0, 255, 255, 0])
})

green.addEventListener('click', e => {
  // Flat PAR on Address 1: red, green, blue, uv, dimmer, strobe
  webusbConnection.send([0, 255, 0, 255, 255, 0])
})

blue.addEventListener('click', e => {
  // Flat PAR on Address 1: red, green, blue, uv, dimmer, strobe
  webusbConnection.send([0, 0, 255, 255, 255, 0])
})

strobe.addEventListener('click', e => {
  // Flat PAR on Address 1: red, green, blue, uv, dimmer, strobe
  webusbConnection.send([255, 255, 255, 255, 255, 50])
})

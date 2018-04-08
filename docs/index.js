import WebUsbConnection from './WebUsbConnection.js'

const devConsole = document.getElementById('console')

const webusbConnection = new WebUsbConnection({ devConsole })
window.webusbConnection = webusbConnection

const enableWebusb = document.getElementById('activateWebUsb')
const disconnectWebusb = document.getElementById('disconnectWebUsb')
const color = document.getElementById('changeColor')
const dimmer = document.getElementById('changeDimmer')
const uv = document.getElementById('changeUv')
const strobe = document.getElementById('strobe')


// Universe with 1 x Flat PAR with 6 channels (red, green, blue, uv, dimmer, strobe) on Address 1
let universe = [0, 0, 0, 0, 0, 0]

function updateFixtureProperty(args) {

  const value = args.value
  const channel = args.channel - 1
  const type = args.type

  switch (type) {
    case 'array':
      universe.splice(channel, value.length, ...value)
      break;
    case 'integer':
      universe.splice(channel, 1, value)
      break;
    default:
  }

  webusbConnection.send(universe)
}

enableWebusb.addEventListener('click', e => {
  webusbConnection.enable()
})

disconnectWebusb.addEventListener('click', e => {
  webusbConnection.disconnect()
})

/*
 * Color = Red, Green & Blue = 3 Channels
 */
color.addEventListener('change', e => {
  // Convert hex color to RGB
  let value = e.target.value.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16))
  updateFixtureProperty({ channel: 1, value, type: 'array' })
})

/*
 * UV = 1 Channel
 */
uv.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)
  updateFixtureProperty({ channel: 4, value, type: 'integer' })
})

/*
 * Dimmer = 1 Channel
 */
dimmer.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)
  updateFixtureProperty({ channel: 5, value, type: 'integer' })
})

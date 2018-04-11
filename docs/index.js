import WebUsbDmx512Controller from './WebUsbDmx512Controller.js'
import WebUsbDmx512Universe from './WebUsbDmx512Universe.js'
import DevConsole from './DevConsole.js'

const controller = new WebUsbDmx512Controller({})
const universe = new WebUsbDmx512Universe({})
const devConsole = new DevConsole({})

const enableWebusb = document.getElementById('activateWebUsb')
const disconnectWebusb = document.getElementById('disconnectWebUsb')
const color = document.getElementById('changeColor')
const dimmer = document.getElementById('changeDimmer')
const uv = document.getElementById('changeUv')
const strobe = document.getElementById('changeStrobe')

/*
 * Basic information about the USB device
 */
const usbInfo = (device) => {
  devConsole.log('---', '', 'string')
  devConsole.log('Selected device', device.productName, 'USBDevice')
  devConsole.log('---', '', 'string')

  const { configuration, configurations, deviceClass, deviceProtocol,
    deviceSubclass, deviceVersionMajor, deviceVersionMinor,
    deviceVersionSubminor, manufacturerName, opened, productId,
    productName, serialNumber, usbVersionMajor, usbVersionMinor,
    usbVersionSubminor, vendorId } = device

  devConsole.log('Opened', opened, 'keyvalue')
  devConsole.log('Vendor ID', vendorId, 'keyvalue')
  devConsole.log('Manufacturer Name', manufacturerName, 'keyvalue')
  devConsole.log('Product ID', productId, 'keyvalue')
  devConsole.log('Product Name', productName, 'keyvalue')
  devConsole.log('Serialnumber', serialNumber, 'keyvalue')

  devConsole.log('Device Class', deviceClass, 'keyvalue')
  devConsole.log('Device Protocol', deviceProtocol, 'keyvalue')
  devConsole.log('Device Subclass', deviceSubclass, 'keyvalue')
  devConsole.log('Device Version Major', deviceVersionMajor, 'keyvalue')
  devConsole.log('Device Version Minor', deviceVersionMinor, 'keyvalue')
  devConsole.log('Device Version Subminor', deviceVersionSubminor, 'keyvalue')

  devConsole.log('USB Version Major', usbVersionMajor, 'keyvalue')
  devConsole.log('USB Version Minor', usbVersionMinor, 'keyvalue')
  devConsole.log('USB Version Subminor', usbVersionSubminor, 'keyvalue')
  devConsole.log('---', '', 'string')
}


// Automatically connect to paired device
controller.autoconnect().then(() => {
  usbInfo(controller.device)
})

// Select USB device and open a connection to it
enableWebusb.addEventListener('click', e => {
  controller.enable().then(() => {

    controller.connect().then(() => {
      usbInfo(controller.device)
    })
  })

})

// Disconnect from USB device
disconnectWebusb.addEventListener('click', e => {
  controller.disconnect()
})



const update = (channel, value) => {
   return universe.update(channel, value).then((channels) => {

     devConsole.log('Universe:', channels, 'array')

     // Send updated universe to controller
     return controller.send(channels)
   })
 }


 /*
  * ---
  * Flat PAR
  * ---
  *
  * Amount of channels: 6
  * DMX512 Address in Universe: 1
  *
  * Channel #1: Red
  * Channel #2: Green
  * Channel #3: Blue
  * Channel #4: UV
  * Channel #5: Dimmer
  * Channel #6: Strobe
  */

/*
 * Color = Red, Green & Blue = 3 Channels
 */
color.addEventListener('change', e => {
  // Convert hex color to RGB
  let value = e.target.value.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16))

  devConsole.log(`Set Color on Channel 1 - 3 to ${value}`, '', 'string')

  // Update starts at channel 1 and goes until channel 3
  // Why? We are sending an array with 3 values
  update(1, value)
})

/*
 * UV = 1 Channel
 * Control the intensity of UV light
 */
uv.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log(`Set UV on Channel 4 to ${value}`, '', 'string')

  // Update starts at channel 4
  update(4, value)
})

/*
 * Dimmer = 1 Channel
 * Control the brightness of the PAR light
 * If dimmer is 0, then no color / UV is shown
 * If dimmer is 255, then LEDs are at full brightness
 */
dimmer.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log(`Set Dimmer on Channel 5 to ${value}`, '', 'string')

  // Update starts at channel 5
  update(5, value)
})

/*
 * Strobe = 1 Channel
 * Control the strobe effect
 * If strobe is 0, no flashing of the LEDs
 * If strobe is 255, then the LEDs flash at a super high rate
 */
strobe.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log(`Set Strobe on Channel 6 to ${value}`, '', 'string')

  // Update starts at channel 6
  update(6, value)
})

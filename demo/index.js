import Controller from '../controller.js'

import DevConsole from './dev-console.js'

const controller = new Controller()
const devConsole = new DevConsole()

const activateButton = document.getElementById('activateWebUsb')
const disconnectButton = document.getElementById('disconnectWebUsb')
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
}


// Automatically connect to paired USB device
controller.autoConnect()
.then(() => {
  devConsole.log('Found an already paired USB device', '', 'string')
  usbInfo(controller.device)
})
.catch((error) => {
  devConsole.log('Found an already paired USB device', '', 'string')
  devConsole.log(error, '', 'string')
})


// Select USB device and open a connection to it
activateButton.addEventListener('click', e => {

  // Enable WebUSB and select the Arduino
  controller.enable().then(() => {

    // Create a connection to the selected Arduino
    controller.connect().then(() => {

      // Successfully created a connection to the device
      usbInfo(controller.device)
    })
  })
  .catch(() => {
    devConsole.log('No USB device was selected', '', 'string')
  })

})

// Disconnect from USB device
disconnectButton.addEventListener('click', e => {
  controller.disconnect().then(() => {
    devConsole.log('Destroyed connection to USB device, but USB device is still paired with the browser', '', 'string')
  })
})


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

  devConsole.log('---', '', 'string')
  devConsole.log(`Set Color on Channel 1 - 3 to ${value}`, '', 'string')

  // Update starts at channel 1 and goes until channel 3
  // Why? We are sending an array with 3 values
  controller.updateUniverse(1, value)
  .then(() => {
    devConsole.log('Universe:', controller.universe, 'array')
  })
  .catch((error) => {
    devConsole.log(error, '', 'string')
  })
})

/*
 * UV = 1 Channel
 * Control the intensity of UV light
 */
uv.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log('---', '', 'string')
  devConsole.log(`Set UV on Channel 4 to ${value}`, '', 'string')

  // Update starts at channel 4
  controller.updateUniverse(4, value)
  .then(() => {
    devConsole.log('Universe:', controller.universe, 'array')
  })
  .catch((error) => {
    devConsole.log(error, '', 'string')
  })

})

/*
 * Dimmer = 1 Channel
 * Control the brightness of the PAR light
 * If dimmer is 0, then no color / UV is shown
 * If dimmer is 255, then LEDs are at full brightness
 */
dimmer.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log('---', '', 'string')
  devConsole.log(`Set Dimmer on Channel 5 to ${value}`, '', 'string')

  // Update starts at channel 5
  controller.updateUniverse(5, value)
  .then(() => {
    devConsole.log('Universe:', controller.universe, 'array')
  })
  .catch((error) => {
    devConsole.log(error, '', 'string')
  })
})

/*
 * Strobe = 1 Channel
 * Control the strobe effect
 * If strobe is 0, no flashing of the LEDs
 * If strobe is 255, then the LEDs flash at a super high rate
 */
strobe.addEventListener('change', e => {
  let value = parseInt(e.target.value, 10)

  devConsole.log('---', '', 'string')
  devConsole.log(`Set Strobe on Channel 6 to ${value}`, '', 'string')

  // Update starts at channel 6
  controller.updateUniverse(6, value)
  .then(() => {
    devConsole.log('Universe:', controller.universe, 'array')
  })
  .catch((error) => {
    devConsole.log(error, '', 'string')
  })
})

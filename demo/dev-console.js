/**
 * Helper to log messages into an <code>output</code> DOM element and the
 * console in the browser.
 */
export default class DevConsole {
  constructor(args = {}) {
    // The element to write the log messages to
    this.output = args.output

    // The element to toggle "logUniverseEnabled"
    this.logUniverseElement = args.logUniverseElement

    // Is logging the content of the universe enabled?
    this.logUniverseEnabled = false

    // Listen for changes to enable / disable "log universe to console"
    this.logUniverseElement.addEventListener('change', e => {
      const { target } = e

      this.logUniverseEnabled = target.checked
    })
  }

  /**
   * Log a message to the <code>output</code> and the browser console
   */
  log(message, data, type) {
    let fullMessage = ''

    switch (type) {
      case 'USBDevice':
        fullMessage = `${message}: ${data}`
        break

      case 'array':
        fullMessage = message + JSON.stringify(data)
        break

      case 'keyvalue':
        fullMessage = `${message}: ${data}`
        break

      default:
        fullMessage = `${message} ${data}`
    }

    console.log(fullMessage)

    this.output.value += fullMessage + '\n'

    // Automatically scroll to the bottom
    this.output.scrollTop = this.output.scrollHeight
  }

  /*
   * Basic information about the USB device
   */
   logUsbDevice(device) {
    this.log('---', '', 'string')
    this.log('Selected device', device.productName, 'USBDevice')
    this.log('---', '', 'string')

    const { configuration, configurations, deviceClass, deviceProtocol,
      deviceSubclass, deviceVersionMajor, deviceVersionMinor,
      deviceVersionSubminor, manufacturerName, opened, productId,
      productName, serialNumber, usbVersionMajor, usbVersionMinor,
      usbVersionSubminor, vendorId } = device

    // Convert IDs from decimal to hex
    const vendorIdHex = vendorId.toString(16)
    const productIdHex = productId.toString(16)

    this.log('Opened', opened, 'keyvalue')
    this.log('Vendor ID', `${vendorId} (0x${vendorIdHex})`, 'keyvalue')
    this.log('Manufacturer Name', manufacturerName, 'keyvalue')
    this.log('Product ID', `${productId} (0x${productIdHex})`, 'keyvalue')
    this.log('Product Name', productName, 'keyvalue')
    this.log('Serialnumber', serialNumber, 'keyvalue')

    this.log('Device Class', deviceClass, 'keyvalue')
    this.log('Device Protocol', deviceProtocol, 'keyvalue')
    this.log('Device Subclass', deviceSubclass, 'keyvalue')
    this.log('Device Version Major', deviceVersionMajor, 'keyvalue')
    this.log('Device Version Minor', deviceVersionMinor, 'keyvalue')
    this.log('Device Version Subminor', deviceVersionSubminor, 'keyvalue')

    this.log('USB Version Major', usbVersionMajor, 'keyvalue')
    this.log('USB Version Minor', usbVersionMinor, 'keyvalue')
    this.log('USB Version Subminor', usbVersionSubminor, 'keyvalue')
  }

  /**
   * The whole content of the universe if <code>logUniverseEnabled</code>
   */
  logUniverse(universe) {
    if (this.logUniverseEnabled) {
      this.log('', universe, 'array')
    }
  }
}

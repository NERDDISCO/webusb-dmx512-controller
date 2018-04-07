export default class WebUsbConnection {
  constructor(args) {
    this.device = null
    this.devConsole = args.devConsole
  }

  /*
   * Enable WebUSB, which has to be triggered by a user gesture
   * When the device was selected, try to create a connection to the device
   */
  enable() {
    // Only request the port for specific devices
    const filters = [
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    this.log('Filters', filters, 'array')

    // Request access to the USB device
    navigator.usb.requestDevice({ filters })
      // Open session to selected USB device
      .then(selectedDevice => {
        this.device = selectedDevice

        console.log(selectedDevice)
        this.log('---', '', 'string')
        this.log('Selected device', selectedDevice.productName, 'USBDevice')

        const { configuration, configurations, deviceClass, deviceProtocol,
          deviceSubclass, deviceVersionMajor, deviceVersionMinor,
          deviceVersionSubminor, manufacturerName, opened, productId,
          productName, serialNumber, usbVersionMajor, usbVersionMinor,
          usbVersionSubminor, vendorId } = selectedDevice

        this.log('Opened', opened, 'keyvalue')
        this.log('Vendor ID', vendorId, 'keyvalue')
        this.log('Manufacturer Name', manufacturerName, 'keyvalue')
        this.log('Product ID', productId, 'keyvalue')
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
        this.log('---', '', 'string')

        this.log('Try to open connection', selectedDevice.productName, 'USBDevice')
        return this.device.open()
      })

      // Select #1 configuration if not automatially set by OS
      .then(() => {
        this.log('Select configuration #1', this.device.configurations, 'USBDevice')

        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1)
        }
      })

      // Get exclusive access to the #2 interface
      .then(() => {
        this.log('Claim interface #2', this.device.productName, 'USBDevice')

        return this.device.claimInterface(2)
      })

      // Tell the USB device (Endpoint #1 of Interface #2) that we are ready to send data
      .then(() => {
        this.log('Tell the USB device (Endpoint #1 of Interface #2) that we are ready to send data', this.device.productName, 'USBDevice')

        return this.device.controlTransferOut({
          // It's a USB class request
          'requestType': 'class',
          // The destination of this request is the interface
          'recipient': 'interface',

          // CDC: Communication Device Class
          // 0x22: SET_CONTROL_LINE_STATE
          // RS-232 signal used to tell the USB device that the computer is now present.
          // https://cscott.net/usb_dev/data/devclass/usbcdc10.pdf
          // -> 6.2.14 SetControlLineState on Page 49
          'request': 0x22,

          'value': 0x01, // Present
          'index': 0x02 // Interface: #2
        })
      })

      .then(() => {
        this.read()
      })

      .catch(error => {
        this.log('Error:', error, 'string')
      })
  }

  read() {
    // Receive 512 bytes on Endpoint #5
    this.device.transferIn(5, 512)

    .then(({ data }) => {
      let decoder = new TextDecoder()
      this.log('Received data from the Arduino', decoder.decode(data), 'string')
      this.read()
    })

    .catch(error => {
      this.log('Error:', error, 'string')
    })
  }

  /*
   * Disconnect from the USB device
   */
  disconnect() {
    if (this.device === null) {
      this.log('No connection to USB device, cannot use "disconnect"', '', 'string')
      return
    }

    this.log('Disconnect from Arduino on Interface #2 using Endpoint 0', this.device.productName, 'USBDevice')

    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00, // Not present1
      'index': 0x02 // Interface: #2
    })
    .then(() => this.device.close())
  }

  /*
   * Send data to the USB device
   */
  send(data) {
    if (this.device === null) {
      this.log('No connection to USB device, cannot use "send"', '', 'string')
      return
    }

    // Create array with 512 x 0 and then concat with the data
    const universe = data.concat(new Array(512).fill(0).slice(data.length, 512))

    // Create an ArrayBuffer
    const buffer = Uint8Array.from(universe)

    this.log('Send data to Arduino on Endpoint #4:', data, 'array')

    // Send data to the USB device on Endpoint #4
    return this.device.transferOut(4, buffer)
  }

  /*
   * Helper method to log messages into the "browser console"
   * and into the "development console" defined in index.html
   */
  log(message, data, type) {
    // console.log(typeof data, ' | ', data)

    let fullMessage = ''

    switch (type) {
      case 'USBDevice':
        fullMessage = `${message}: ${data}`
        break

      case 'array':
        fullMessage = message + ' ' + JSON.stringify(data)
        break

      case 'keyvalue':
        fullMessage = `${message}: ${data}`
        break

      default:
        fullMessage = message + ' ' + data
    }

    let elem = document.createElement('span')
    elem.innerHTML = fullMessage

    console.log(fullMessage)

    if (this.devConsole !== undefined) {
      this.devConsole.appendChild(elem)
    }

  }

}

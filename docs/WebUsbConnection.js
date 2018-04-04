export default class WebUsbConnection {
  constructor(args) {
    this.device = null
    this.devConsole = args.devConsole
  }

  enable() {
    // Only request the port for specific devices
    const filters = [
      // Arduino LLC (10755), Leonardo ETH (32832)
      // { vendorId: 0x2a03, productId: 0x8040 }
    ]

    this.log('Filters', filters, 'array')

    // Request access to the USB device
    navigator.usb.requestDevice({ filters })
      // Open session to selected USB device
      .then(selectedDevice => {
        this.log('Selected device', selectedDevice, 'USBDevice')
        this.device = selectedDevice

        this.log('Try to open connection to', selectedDevice, 'USBDevice')
        return this.device.open()
      })

      // Select #1 configuration if not automatially set by OS
      .then(() => {
        this.log('Try to select configuration #1 for', this.device, 'USBDevice')
        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1)
        }
      })

      // Get exclusive access to the #2 interface
      .then(() => this.device.claimInterface(2))

      // We are ready to receive data on Endpoint 1 of Interface #2
      .then(() => {
        this.log('Ready to receive data on Endpoint #1 of Interface #2', this.device, 'USBDevice')

        return this.device.controlTransferOut({
          'requestType': 'class',
          'recipient': 'interface',
          'request': 0x22,
          'value': 0x01, // Endpoint: 1
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
      this.log('ERROR', error, 'string')
    })
  }

  disconnect() {
    if (this.device === null) {
      this.log('No connection to USB device, cannot use "disconnect"', '', 'string')
      return
    }

    this.log('Disconnect from Arduino on Interface #2 using Endpoint 0', this.device, 'USBDevice')

    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00, // Endpoint: 0
      'index': 0x02 // Interface: #2
    })
    .then(() => this.device.close())
  }

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

  log(message, data, type) {
    // console.log(typeof data, ' | ', data)

    let fullMessage = ''

    switch (type) {
      case 'USBDevice': {
        const { productName, manufacturerName, configuration } = data
        fullMessage = `${message}: ${productName}`
        console.log(data)
        break
      }

      case 'array':
        fullMessage = message + ' ' + JSON.stringify(data)
        break

      default:
        fullMessage = message + ' ' + data

    }

    let elem = document.createElement('span')
    elem.innerHTML = fullMessage

    console.log(fullMessage)
    this.devConsole.appendChild(elem)
  }

}

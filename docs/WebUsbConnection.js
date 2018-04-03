export default class WebUsbConnection {
  constructor() {
    this.device = null
  }

  enable() {
    // Only request the port for specific devices
    const filters = [
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    // Request access to the USB device
    navigator.usb.requestDevice({ filters })
      // Open session to selected USB device
      .then(selectedDevice => {
        this.device = selectedDevice
        return this.device.open()
      })

      // Select #1 configuration if not automatially set by OS
      .then(() => {
        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1)
        }
      })

      // Get exclusive access to the #2 interface
      .then(() => this.device.claimInterface(2))

      // We are ready to receive data on Endpoint 1 of Interface #2
      .then(() => this.device.controlTransferOut({
        'requestType': 'class',
        'recipient': 'interface',
        'request': 0x22,
        'value': 0x01, // Endpoint: 1
        'index': 0x02 // Interface: #2
      }))


      // Receive 512 bytes on Endpoint 5
      .then(() => this.device.transferIn(5, 512))

      .then(({ data }) => {
        let decoder = new TextDecoder()
        console.log('Received: ' + decoder.decode(data))
      })

      .catch(error => {
        console.log(error)
      })
  }

  disconnect() {
    if (this.device === null) {
      throw new Error(`device has not been enabled. Cannot diconnect undefined`)
    }
    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00, // Endpoint: 1
      'index': 0x02 // Interface: #2
    })
    .then(() => this.device.close())
  }

  send(data) {
    if (this.device === null) {
      throw new Error(`device has not been enabled. Cannot write undefined`)
    }
    // Send data to the USB device on endpoint 4
    return this.device.transferOut(4, data)
  }
}

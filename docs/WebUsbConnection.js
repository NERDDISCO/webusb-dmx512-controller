export default class WebUsbConnection {
  constructor(args) {
    this.device = null
    this.devConsole = args.devConsole
  }

  enable() {
    // Only request the port for specific devices
    const filters = [
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    this.log(`Filters: ${filters}`)

    // Request access to the USB device
    navigator.usb.requestDevice({ filters })
      // Open session to selected USB device
      .then(selectedDevice => {
        this.log(`Selected device: ${[selectedDevice)]}`)
        this.device = selectedDevice

        this.log(`Try to open connection to: ${selectedDevice.name}`)
        return this.device.open()
      })

      // Select #1 configuration if not automatially set by OS
      .then(() => {
        this.log(`Try to select configuration to: ${this.device.name}`)
        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1)
        }
      })

      // Get exclusive access to the #2 interface
      .then(() => this.device.claimInterface(2))

      // We are ready to receive data on Endpoint 1 of Interface #2
      .then(() => {
        this.log(`Ready to receive data on Endpoint #1 of Interface #2: ${this.device}`)

        return this.device.controlTransferOut({
          'requestType': 'class',
          'recipient': 'interface',
          'request': 0x22,
          'value': 0x01, // Endpoint: 1
          'index': 0x02 // Interface: #2
        })
      })


      // Receive 512 bytes on Endpoint 5
      .then(() => this.device.transferIn(5, 512))

      .then(({ data }) => {
        let decoder = new TextDecoder()
        this.log(`Received data from the Arduino: ${decoder.decode(data)}`)
      })

      .catch(error => {
        this.log(`ERROR :( ${error}`)
      })
  }

  disconnect() {
    if (this.device === null) {
      this.log(`ERROR :( Device has not been enabled. Cannot diconnect undefined`)
    }

    this.log(`Disconnect from Arduino ${this.device}`)
    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00, // Endpoint: 1
      'index': 0x02 // Interface: #2
    })

    this.log(`Close ${this.device}`)
    .then(() => this.device.close())
  }

  send(data) {
    if (this.device === null) {
      throw new Error(`device has not been enabled. Cannot write undefined`)
    }

    const buffer = Uint8Array.from(data)

    this.log(`Send data to Arduino ${data}`)
    // Send data to the USB device on endpoint 4
    return this.device.transferOut(4, buffer)
  }

  log(message) {
    const fullMessage = message

    let elem = document.createElement('span')
    elem.innerHTML = fullMessage

    console.log(fullMessage)
    this.devConsole.appendChild(elem)
  }

}

/**
 * The controller that is creating a connection to the USB device (Arduino)
 * to send data to it using WebUSB.
 *
 * @param {object} args - Arguments to configure the controller
 */
export default class Controller {
  constructor(args = {}) {
    // Reference to the selected USB device
    this.device = args.device || undefined

    // Only allow specific USB devices
    this.filters = args.filters || [
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    // The DMX512 universe with 512 channels
    this.universe = args.universe || new Array(512).fill(0)
  }

  /**
   * Enable WebUSB and when successful
   * Save a reference to the selected USB device
   *
   * Note: This function has to be triggered by a user gesture
   *
   * @returns {Promise}
   */
  enable() {
    // Request access to the USB device
    return navigator.usb.requestDevice({ filters: this.filters })

    // selectedDevice = the USB device that was selected by the user in the browser
    .then(selectedDevice => {
      this.device = selectedDevice
    })
  }

  /**
   * Get a USB device that was already paired with the browser.
   *
   * @returns {Promise}
   */
  getPairedDevice() {
    return navigator.usb.getDevices()

    .then(devices => {
      return devices[0]
    })
  }

  /**
   * Automatically connect to a USB device that was already
   * paired with the Browser and save a reference to the device.
   *
   * @returns {Promise}
   */
  autoConnect() {
    return this.getPairedDevice().then((device) => {

      this.device = device

      return new Promise((resolve, reject) => {

        // USB Device is not connected to the computer
        if (this.device === undefined) {
          return reject(new Error('USB device is not connected to the computer'))

        // USB device is connected to the computer, so try to create a WebUSB connection
        } else {
          return resolve(this.connect())
        }

      })

    })
  }

  /**
   * Open a connection to the selected USB device and tell the device that
   * we are ready to send data to it.
   *
   * @returns {Promise}
   */
  connect() {
    // Open connection
    return this.device.open()

    // Select #1 configuration if not automatially set by OS
    .then(() => {
      if (this.device.configuration === null) {
        return this.device.selectConfiguration(1)
      }
    })

    // Get exclusive access to the #2 interface
    .then(() => this.device.claimInterface(2))

    // Tell the USB device that we are ready to send data
    .then(() => this.device.controlTransferOut({
        // It's a USB class request
        'requestType': 'class',
        // The destination of this request is the interface
        'recipient': 'interface',
        // CDC: Communication Device Class
        // 0x22: SET_CONTROL_LINE_STATE
        // RS-232 signal used to tell the USB device that the computer is now present.
        'request': 0x22,
        // Yes
        'value': 0x01,
        // Interface #2
        'index': 0x02
      })
    )

    .catch(error => console.log(error))
  }

  /**
   * Send data to the USB device to update the DMX512 universe
   *
   * @param {Array} data - List containing all channels that should be updated in the universe
   *
   * @returns {Promise}
   */
  send(data) {

    return new Promise((resolve, reject) => {

      // USB Device is not connected to the computer
      if (this.device === undefined) {
        return reject(new Error('USB device is not connected to the computer'))

      // USB device is connected to the computer, so try to create a WebUSB connection
      } else {
        // Create an ArrayBuffer, because that is needed for WebUSB
        const buffer = Uint8Array.from(data)

        // Send data on Endpoint #4
        return resolve(this.device.transferOut(4, buffer))
      }

    })
  }

  /**
   * Update the channel(s) of the DMX512 universe with the provided value
   *
   * @param {number} channel - The channel to update
   * @param {(number|Array)} value - The value to update the channel:
   * number: Update the channel with value
   * array: Update value.length channels starting with channel
   */
  updateUniverse(channel, value) {
    return new Promise((resolve, reject) => {

      // The DMX512 universe starts with channel 1, but the array with 0
      channel = channel - 1

      if (Number.isInteger(value)) {
        this.universe.splice(channel, 1, value)
      } else if (Array.isArray(value)) {
        this.universe.splice(channel, value.length, ...value)
      } else {
        return reject(new Error('Could not update Universe because the provided value is not of type Integer or Array'))
      }

      // Send the updated universe to the DMX512 controller
      return resolve(this.send(this.universe))

    })
  }

  /**
   * Disconnect from the USB device
   *
   * Note: The device is still paired to the browser!
   *
   * @returns {Promise}
   */
  disconnect() {
    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      // It's a USB class request
      'requestType': 'class',
      // The destination of this request is the interface
      'recipient': 'interface',
      // CDC: Communication Device Class
      // 0x22: SET_CONTROL_LINE_STATE
      // RS-232 signal used to tell the USB device that the computer is now present.
      'request': 0x22,
      // No
      'value': 0x01,
      // Interface #2
      'index': 0x02
    })

    // Close the connection to the USB device
    .then(() => this.device.close())
  }
}

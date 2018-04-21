/**
 * The controller is creating a connection to the USB device (Arduino) to send data over WebUSB.
 * By using the default <code>args</code> you will only see the following Arduino in the user prompt:
 * - Arduino Leonardo
 * - Arduino Leonardo ETH
 * - Seeeduino Lite
 * @module Controller
 *
 * @param {Object} args - Arguments to configure the controller
 * @param {Object[]} args.filters - List of devices that are whitelisted when opening the user prompt to select an Arduino
 * @param {Object} args.device - The selected Arduino to use as the DMX512 controller
 * @param {number[]} args.universe - Holds all the values for each channel of the DMX512 universe
 * @example
 * import Controller from 'webusb-dmx512-controller/controller.js'
 *
 * // Create a new controller using the default properties
 * const controller = new Controller()
 */
export default class Controller {

  constructor(args = {}) {
    // Reference to the selected USB device
    this.device = args.device || undefined

    // Only allow specific USB devices
    this.filters = args.filters || [
      // Arduino LLC (9025), Leonardo (32822)
      { vendorId: 0x2341, productId: 0x8036 },
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    // The DMX512 universe with 512 channels
    this.universe = args.universe || new Array(512).fill(0)
  }

  /**
   * Enable WebUSB and save the selected Arduino into <code>controller.device</code>
   *
   * Note: This function has to be triggered by a user gesture
   *
   * @return {Promise}
   *
   * @example
   * controller.enable().then(() => {
   *   // Create a connection to the selected Arduino
   *   controller.connect().then(() => {
   *     // Successfully created a connection
   *   })
   * })
   * .catch(error => {
   *   // No Arduino was selected by the user
   * })
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
   * @return {Promise}
   */
  getPairedDevice() {
    return navigator.usb.getDevices()

    .then(devices => {
      return devices[0]
    })
  }

  /**
   * Automatically connect to a USB device that was already paired with the Browser and save it into <code>controller.device</code>
   *
   * @return {Promise}
   * @example
   * controller.autoConnect()
   *   .then(() => {
   *     // Connected to already paired Arduino
   *   })
   *   .catch(error => {
   *     // Nothing found or found paired Arduino, but it's not connected to computer
   *   })
   */
  autoConnect() {
    return this.getPairedDevice().then((device) => {

      this.device = device

      return new Promise((resolve, reject) => {

        // USB Device is not connected to the computer
        if (this.device === undefined) {
          return reject(new Error('Can not find USB device.'))

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
   * @return {Promise}
   * @example
   * controller.connect().then(() => {
   *   // Successfully created a connection to the selected Arduino
   * })
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
   * @return {Promise}
   * @example
   * controller.send([255, 0, 0])
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
   * Update the <code>channel</code>(s) of the DMX512 universe with the provided <code>value</code>
   *
   * @param {number} channel - The channel to update
   * @param {(number|number[])} value - The value to update the channel, supporting two different modes: single (= <code>number</code>) & multi (= <code>Array</code>)
   * @example <caption>Update a single channel</caption>
   * // Update channel #1
   * controller.updateUniverse(1, 255)
   * @example <caption>Update multiple channels starting with channel</caption>
   * // Update channel #5 with 255, #6 with 0 & #7 with 20
   * controller.updateUniverse(5, [255, 0, 20])
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
   * @return {Promise}
   * @example
   * controller.disconnect().then(() => {
   *   // Destroyed connection to USB device, but USB device is still paired with the browser
   *})
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
      // RS-232 signal used to tell the USB device that the computer is not present anymore
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

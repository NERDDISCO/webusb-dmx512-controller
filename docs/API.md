# API documentation


* [Controller](#module_Controller)
    * [.enable()](#module_Controller+enable) ⇒ <code>Promise</code>
    * [.getPairedDevice()](#module_Controller+getPairedDevice) ⇒ <code>Promise</code>
    * [.autoConnect()](#module_Controller+autoConnect) ⇒ <code>Promise</code>
    * [.connect()](#module_Controller+connect) ⇒ <code>Promise</code>
    * [.send(data)](#module_Controller+send) ⇒ <code>Promise</code>
    * [.updateUniverse(channel, value)](#module_Controller+updateUniverse)
    * [.disconnect()](#module_Controller+disconnect) ⇒ <code>Promise</code>

<a name="module_Controller"></a>

## Controller
The controller is creating a connection to the USB device (Arduino) to send data over WebUSB.
By using the default <code>args</code> you will only see the following Arduino in the user prompt:
- Arduino Leonardo
- Arduino Leonardo ETH
- Seeeduino Lite


| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | Arguments to configure the controller |
| args.filters | <code>Array.&lt;Object&gt;</code> | List of devices that are whitelisted when opening the user prompt to select an Arduino |
| args.device | <code>Object</code> | The selected Arduino to use as the DMX512 controller |
| args.universe | <code>Array.&lt;number&gt;</code> | Holds all the values for each channel of the DMX512 universe |

**Example**  
```js
import Controller from 'webusb-dmx512-controller/controller.js'

// Create a new controller using the default properties
const controller = new Controller()
```
<a name="module_Controller+enable"></a>

### controller.enable() ⇒ <code>Promise</code>
Enable WebUSB and save the selected Arduino into <code>controller.device</code>

Note: This function has to be triggered by a user gesture

**Example**  
```js
controller.enable().then(() => {
  // Create a connection to the selected Arduino
  controller.connect().then(() => {
    // Successfully created a connection
  })
})
.catch(error => {
  // No Arduino was selected by the user
})
```
<a name="module_Controller+getPairedDevice"></a>

### controller.getPairedDevice() ⇒ <code>Promise</code>
Get a USB device that was already paired with the browser.

<a name="module_Controller+autoConnect"></a>

### controller.autoConnect() ⇒ <code>Promise</code>
Automatically connect to a USB device that was already paired with the Browser and save it into <code>controller.device</code>

**Example**  
```js
controller.autoConnect()
  .then(() => {
    // Connected to already paired Arduino
  })
  .catch(error => {
    // Nothing found or found paired Arduino, but it's not connected to computer
  })
```
<a name="module_Controller+connect"></a>

### controller.connect() ⇒ <code>Promise</code>
Open a connection to the selected USB device and tell the device that
we are ready to send data to it.

**Example**  
```js
controller.connect().then(() => {
  // Successfully created a connection to the selected Arduino
})
```
<a name="module_Controller+send"></a>

### controller.send(data) ⇒ <code>Promise</code>
Send data to the USB device to update the DMX512 universe


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | List containing all channels that should be updated in the universe |

**Example**  
```js
controller.send([255, 0, 0])
```
<a name="module_Controller+updateUniverse"></a>

### controller.updateUniverse(channel, value)
Update the <code>channel</code>(s) of the DMX512 universe with the provided <code>value</code>


| Param | Type | Description |
| --- | --- | --- |
| channel | <code>number</code> | The channel to update |
| value | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The value to update the channel, supporting two different modes: single (= <code>number</code>) & multi (= <code>Array</code>) |

**Example** *(Update a single channel)*  
```js
// Update channel #1
controller.updateUniverse(1, 255)
```
**Example** *(Update multiple channels starting with channel)*  
```js
// Update channel #5 with 255, #6 with 0 & #7 with 20
controller.updateUniverse(5, [255, 0, 20])
```
<a name="module_Controller+disconnect"></a>

### controller.disconnect() ⇒ <code>Promise</code>
Disconnect from the USB device

Note: The device is still paired to the browser!

**Example**  
```js
controller.disconnect().then(() => {
  // Destroyed connection to USB device, but USB device is still paired with the browser
})
```

# WebUSB DMX512 Controller

Do you want to build your own DMX512 controller? And use it directly in the browser by leveraging WebUSB? Then you should follow these steps:

1. Build your own [WebUSB DMX512 Controller](#hardware) (TODO: Add link to article)
2. Connect it via USB to your computer
3. [Open the demo page](https://nerddisco.github.io/webusb-dmx512-controller) and start interacting with the controller

---

![Arduino Leonardo with DMX512 shield attached](images/webusb_dmx512_controller.jpg)

---

## Documentation

### Browser Support

In order to use the module you have to use a browser that supports WebUSB

* Chrome 61 + 62: Behind flags chrome://flags/#enable-experimental-web-platform-features
* Chrome 63+: Native support


### Using the controller with WebUSB

## Functions

<dl>
<dt><a href="#enable">enable()</a> ⇒ <code>Promise</code></dt>
<dd><p>Enable WebUSB and when successful
Save a reference to the selected USB device</p>
<p>Note: This function has to be triggered by a user gesture</p>
</dd>
<dt><a href="#getPairedDevice">getPairedDevice()</a> ⇒ <code>Promise</code></dt>
<dd><p>Get a USB device that was already paired with the browser.</p>
</dd>
<dt><a href="#autoConnect">autoConnect()</a> ⇒ <code>Promise</code></dt>
<dd><p>Automatically connect to a USB device that was already
paired with the Browser and save a reference to the device.</p>
</dd>
<dt><a href="#connect">connect()</a> ⇒ <code>Promise</code></dt>
<dd><p>Open a connection to the selected USB device and tell the device that
we are ready to send data to it.</p>
</dd>
<dt><a href="#send">send(data)</a> ⇒ <code>Promise</code></dt>
<dd><p>Send data to the USB device to update the DMX512 universe</p>
</dd>
<dt><a href="#updateUniverse">updateUniverse(channel, value)</a></dt>
<dd><p>Update the channel(s) of the DMX512 universe with the provided value</p>
</dd>
<dt><a href="#disconnect">disconnect()</a> ⇒ <code>Promise</code></dt>
<dd><p>Disconnect from the USB device</p>
<p>Note: The device is still paired to the browser!</p>
</dd>
</dl>

<a name="enable"></a>

## enable() ⇒ <code>Promise</code>
Enable WebUSB and when successful
Save a reference to the selected USB device

Note: This function has to be triggered by a user gesture

**Kind**: global function  
<a name="getPairedDevice"></a>

## getPairedDevice() ⇒ <code>Promise</code>
Get a USB device that was already paired with the browser.

**Kind**: global function  
<a name="autoConnect"></a>

## autoConnect() ⇒ <code>Promise</code>
Automatically connect to a USB device that was already
paired with the Browser and save a reference to the device.

**Kind**: global function  
<a name="connect"></a>

## connect() ⇒ <code>Promise</code>
Open a connection to the selected USB device and tell the device that
we are ready to send data to it.

**Kind**: global function  
<a name="send"></a>

## send(data) ⇒ <code>Promise</code>
Send data to the USB device to update the DMX512 universe

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | List containing all channels that should be updated in the universe |

<a name="updateUniverse"></a>

## updateUniverse(channel, value)
Update the channel(s) of the DMX512 universe with the provided value

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>number</code> | The channel to update |
| value | <code>number</code> \| <code>Array</code> | The value to update the channel: number: Update the channel with value array: Update value.length channels starting with channel |

<a name="disconnect"></a>

## disconnect() ⇒ <code>Promise</code>
Disconnect from the USB device

Note: The device is still paired to the browser!

**Kind**: global function  

### Run the demo on your computer

* Install the dev dependencies by executing `npm install` inside the repository
* Execute `npm start` to start the local web server
* Open the demo on [localhost:8080](http://localhost:8080)

### Hardware list

* 1 x [Arduino Leonardo](https://store.arduino.cc/arduino-leonardo-with-headers) / Arduino Leonardo ETH (because it has the [ATmega32u4](http://www.microchip.com/wwwproducts/en/ATmega32U4) chip which makes it possible for the computer to recognize the Arduino as an external USB device)
* 1 x [2.5kV Isolated DMX512 Shield for Arduino - R2](https://www.tindie.com/products/Conceptinetics/25kv-isolated-dmx-512-shield-for-arduino-r2/)

### Software list

This repository contains different parts that are needed in order to create the WebUSB DMX512 controller:

* sketchbook: Contains all the code, configurations and libraries in order to use the Arduino as a DMX512 controller over WebUSB

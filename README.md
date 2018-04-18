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

TODO: Add a how to use the JS code

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

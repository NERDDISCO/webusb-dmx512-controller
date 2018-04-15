# WebUSB DMX512 Controller

Do you want to build your own DMX512 controller? And use it directly in the browser by leveraging WebUSB? Then you should follow these steps:

1. Build your own [WebUSB DMX512 Controller](#hardware)
2. Connect it via USB to your computer
3. [Open the demo page](https://nerddisco.github.io/webusb-dmx512-controller) and start interacting with the controller

---

![Arduino Leonardo with DMX512 shield attached](images/webusb_dmx512_controller.jpg)

## Hardware

* 1 x [Arduino Leonardo](https://store.arduino.cc/arduino-leonardo-with-headers) / Arduino Leonardo ETH (because it has the [ATmega32u4](http://www.microchip.com/wwwproducts/en/ATmega32U4) chip which makes it possible for the computer to recognize the Arduino as an external USB device)
* 1 x [2.5kV Isolated DMX512 Shield for Arduino - R2](https://www.tindie.com/products/Conceptinetics/25kv-isolated-dmx-512-shield-for-arduino-r2/)

## Software

I have written an extensive article:

* How to prepare the Arduino
* How to control the Arduino using WebUSB

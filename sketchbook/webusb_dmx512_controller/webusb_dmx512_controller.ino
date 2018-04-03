#include <WebUSB.h>
#include <Conceptinetics.h>

WebUSB WebUSBSerial(1, "nerddisco.github.io/WebUSB-DMX512-Controller");
#define Serial WebUSBSerial

// Amount of DMX channels
#define channels 512

// dmx_master(channels , pin);
// channels: Amount of DMX channels
// pin: Pin to do read / write operations on the DMX shield
DMX_Master dmx_master(channels, 2);

// Amount of incoming bytes via WebUSB
byte incoming[channels];

// Run once on startup
void setup() {
  // Initialize incoming with 0
  memset(incoming, 0, sizeof(incoming));
  
  // Wait until WebUSB connection is established
  while (!Serial) {
    ;
  }

  // Start DMXMaster & transmission to DMXShield
  dmx_master.enable();
}

// Run over and over again
void loop() {
  // WebUSB is available
  if (Serial.available() > 0) {

    // Read bytes (the # channels) from WebUSB and save them into incoming
    Serial.readBytes(incoming, channels);

    // Iterate over all channels
    for (int i = 0; i < channels; i++) {
      // Set the value for each channel
      dmx_master.setChannelValue(i + 1, incoming[i]);
    }
  }
}


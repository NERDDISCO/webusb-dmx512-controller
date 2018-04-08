#include <WebUSB.h>
#include <Conceptinetics.h>

// Whitelisted URLs
WebUSB WebUSBSerial(1, "nerddisco.github.io/WebUSB-DMX512-Controller");
#define Serial WebUSBSerial

// Amount of channels in the universe
#define universe 512

// dmx_master(channels , pin);
// channels: Amount of channels in the universe
// pin: Pin to do read / write operations on the DMX shield
DMX_Master dmx_master(universe, 2);

// Store the incoming WebUSB bytes
byte incoming[universe];

// Run once on startup
void setup() {
  // Initialize incoming with 0
  memset(incoming, 0, sizeof(incoming));

  // Wait until WebUSB connection is established
  while (!Serial) {
    ;
  }

  // Start transmission to DMXShield
  dmx_master.enable();
}

// Run over and over again
void loop() {
  // WebUSB is available
  if (Serial.available() > 0) {

    // Read 512 incoming bytes
    Serial.readBytes(incoming, universe);

    // Iterate over all universe
    for (int i = 0; i < universe; i++) {
      // Set the value for each channel
      dmx_master.setChannelValue(i + 1, incoming[i]);
    }
  }
}

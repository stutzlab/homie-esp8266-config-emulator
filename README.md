# [Homie for ESP8266](https://github.com/marvinroger/homie-esp8266) [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api) emulator

The main porpuse of the emulator is to help developers to build their custom captive portal or something else that will use the [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api) to setup their device that uses [Homie for ESP8266](https://github.com/marvinroger/homie-esp8266)  without the need to have the actual device.

Some benefits we expect:
* Developers without hardware/firmware skills can help on projects that uses Homie for ESP8266, at least in the device configuration implementation
* Emulation of different scenarios to make your captive portal - or something else - resilient and informative about erros, timeouts and unexpected behaviors.
* Don't need the device to be already finish and running to start the configuration implementation


## The emulator

The emulator will have the same endpoints specified in the [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api), i.e.:

`/heart` This is useful to ensure we are connected to the device AP

`/device-info` Get some information on the device.

`/networks` Retrieve the Wi-Fi networks the device can see.

`/wifi/connect` Initiates the connection of the device to the Wi-Fi network while in configuation mode.

`/wifi/status` Returns the current Wi-Fi connection status.

`/config` Save the config to the device.

`/proxy/control` Enable/disable the device to act as a transparent proxy between AP and Station networks.


## Read the docs

For more details such as success and error **return codes** go to [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api)

For more information about the captive portal go to https://homie-esp8266.readme.io/v2.0.0/docs/ui-bundle

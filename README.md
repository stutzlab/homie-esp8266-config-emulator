# [Homie for ESP8266](https://github.com/marvinroger/homie-esp8266) [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api) emulator

The main porpuse of the emulator is to help developers to build their custom captive portal that will use the [HTTP JSON config API](https://homie-esp8266.readme.io/docs/http-json-api) to setup their device that uses [Homie for ESP8266](https://github.com/marvinroger/homie-esp8266)  without the need to have the actual device.

Some benefits we expect:
* Developers without hardware/firmware skills can help on projects that uses Homie for ESP8266, at least in the device configuration implementation
* Emulation of different scenarios to make your captive portal resilient and informative about erros, timeouts and unexpected behaviors.
* Don't need the device to be already finish and running to start the configuration implementation


## Running using Docker

We highly recommend you to use Docker to run the emulator. To do so, you have two options:
* With [**docker-compose**](https://docs.docker.com/compose/)  by  downloading the file [docker-compose.yml](https://raw.githubusercontent.com/stutzlab/homie-esp8266-config-emulator/master/docker-compose.yml) file and running the following command at the same dir you downloaded the file:
```
docker-compose up -d
```

* Running directly the **docker run** command as follows:
```
docker run -d -p 5000:5000 -v [absolute_path_to_your_ui_bundle_gz]:/usr/src/app/captive/ui_bundle.gz stutzlab/homie-esp8266-config-emulator:0.1.1
```

## Running directly with `node` command
To run directly with your local NodeJS runtime, clone this repo and then run the following command at the root of the project:
```
node src/emulator.js
```

Optionally you can pass environment variables to debug and change the failure rate as follows:
```
DEBUG=fine,info node src/emulator.js
```
or
```
FAILURE_RATE=.3 node src/emulator.js
```
or
```
DEBUG=finest,fine,info FAILURE_RATE=.3 node src/emulator.js
```



## The Emulator

The emulator is not fully functional as a real device, but it is fine to support the captive portal development. It handles the API calls and serves the ui_bundle.gz file, wich is the actual captive portal interface.

### Random Failure
All the endpoints has a random failure function to emulate a unexpected failure at anytime. The failure rate is configurable and can be set as enviroment variable

### Endpoints

#### `/`
This endpoint serves the **ui_bundle.gz** file. This file must be in the **captive** folder. If using Docker, map the volume; if not, copy the file to this folder.

---

#### `/heart`
Simply returns a **204** return code. There is no content returned.

---

#### `/device-info`
Returns a fake device info. The content is always the same.

---

#### `/networks`
Returns a list with fake networks.
Also, during the **5 seconds** after the endpoint was invoked, it will return a **503** code and an error message to emulate the _"Initial Wi-Fi scan not finished yet"_ behavior.

---

#### `/wifi/connect`
Returns a success message if all the required parameters (**including wifi password**) are provided. If some of the required parameters are missing it returns a **400 Bad Request** and a message with the missing parameters list.

---

#### `/wifi/status`
If this endpoint is invoked before the `wifi/connect` endpoint it returns randomly one of the following: `disconnected, connection_lost, connect_failed, no_ssid_available, idle`.

If this endpoint is invoked after the `wifi/connect` endpoint it will return `{ "status": "connected", "local_ip": "10.1.1.1" }`

---

#### `/config`
Returns a success message if all the required parameters (**including wifi password**) are provided. If some of the required parameters are missing it returns a **400 Bad Request** and a message with the missing parameters list.

Also, during the **5 seconds** after the endpoint was invoked, it will return a **403** code and an error message to emulate the _"Device already configured"_ behavior.

---

#### `/proxy/control`
Returns a success message if all the required parameter **enabled** is provided. If the parameter is missing the endpoint returns a **400 Bad Request** and a message with the missing parameters list.


## The HTTP JSON API

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

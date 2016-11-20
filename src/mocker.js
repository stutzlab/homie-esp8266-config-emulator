module.exports.settings = {
  failureRate : .2
}

module.exports.init = function(options) {
  module.exports.settings.failureRate = (options && options.failureRate) || module.exports.settings.failureRate;
}

const randomFail = function() {
  var rand = Math.random();

  if (rand < module.exports.settings.failureRate) {
    return true;
  }

  return false;
}

module.exports.heart = function() {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  return { "value" : null, "code" : 204};
}

module.exports.deviceInfo = function() {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  return {
    "value" : {
      "hardware_device_id": "42a8f42d",
      "homie_esp8266_version": "2.0.0",
      "firmware": {
        "name": "mock-firmware",
        "version": "1.0.0"
      },
      "nodes": [
        {
          "id": "mock-node-id",
          "type": "mock-node-type"
        }
      ],
      "settings": [
        {
          "name": "timeout",
          "description": "Timeout in seconds",
          "type": "ulong",
          "required": false,
          "default": 10
        }
      ]
    },
    "code" : 200
  };
}

module.exports.lasTimeNetworksEndpointInvoked = new Date().getTime();
module.exports.networks = function() {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  if ((new Date().getTime() - module.exports.lasTimeNetworksEndpointInvoked) < 5000) {
    return { "value" : {"error": "Initial Wi-Fi scan not finished yet"}, "code" : 503};
  }

  //to restart the connection cicle emulation
  module.exports.lasTimeNetworksEndpointInvoked = new Date().getTime();
  return {
    "value" : {
      "networks": [
        { "ssid": "Mock_Wifi_1", "rssi": -57, "encryption": "wpa" },
        { "ssid": "Mock_Wifi_2", "rssi": -82, "encryption": "wep" },
        { "ssid": "Mock_Wifi_3", "rssi": -65, "encryption": "wpa2" },
        { "ssid": "Mock_Wifi_5", "rssi": -94, "encryption": "none" },
        { "ssid": "Mock_Wifi_4", "rssi": -89, "encryption": "auto" }
      ]
    },
    "code" : 200
  };
}


module.exports.wifiConnect = function(config) {
  module.exports.wifiConnected = false;
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  var missingFields = '';

  if (!config.ssid) {
    missingFields += ', ssid';
  }
  if (!config.password) {
    missingFields += ', password';
  }

  if (missingFields.length > 0) {
    return {
      "value" : { "success": false, "error": "There are some missing fields: " + missingFields.substring(2) },
      "code" : 400
    };
  }

  module.exports.wifiConnected = true;
  return {
    "value" : { "success": true },
    "code" : 202
  };
}

module.exports.wifiConnected = false;
module.exports.wifiStatus = function() {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  if (module.exports.wifiConnected) {
    return {
      "value" : { "status": "connected", "local_ip": "10.1.1.1" },
      "code" : 200
    };
  }

  var random = Math.random();
  var statusText = "disconnected";
  if (random < .1) {
    statusText = "connection_lost";
  }else if(random < .3) {
    statusText = "connect_failed";
  }else if(random < .5){
    statusText = "no_ssid_available";
  }else if(random < .7){
    statusText = "idle";
  }

  return {
    "value" : { "status": statusText },
    "code" : 200
  };
}


module.exports.lasTimeConfigEndpointInvokedSuccessfully = 0;
module.exports.config = function(config) {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  if ((new Date().getTime() - module.exports.lasTimeConfigEndpointInvokedSuccessfully) < 5000) {
    return { "value" : { "success": false, "error": "Device already configured" }, "code" : 403};
  }

  //validate the configuration
  var missingFields = '';

  if (!config.name) {
    missingFields += ', name';
  }
  if (!config.wifi) {
    missingFields += ', wifi information';
  }else{
    if (!config.wifi.ssid) {
      missingFields += ', wifi.ssid';
    }
    if (!config.wifi.password) {
      missingFields += ', wifi.password';
    }
  }
  if (!config.mqtt) {
    missingFields += ', mqtt information';
  }else{
    if (!config.mqtt.host) {
      missingFields += ', mqtt.host';
    }
    if (config.mqtt.auth) {
      if (!config.mqtt.username) {
        missingFields += ', mqtt.username (as mqtt.auth is true)';
      }
      if (!config.mqtt.password) {
        missingFields += ', mqtt.username (as mqtt.auth is true)';
      }
    }
  }
  if (!config.ota) {
    missingFields += ', ota';
  }else{
    if (!config.ota.enabled) {
      missingFields += ', ota.enabled';
    }
  }

  if (missingFields.length > 0) {
    return {
      "value" : { "success": false, "error": "There are some missing fields: " + missingFields.substring(2) },
      "code" : 400
    };
  }

  module.exports.lasTimeConfigEndpointInvokedSuccessfully = new Date().getTime();
  return {
    "value" : { "success": true },
    "code" : 200
  };
}

module.exports.proxyControl = function(config) {
  if (randomFail()) {
    return { "value" : { "error" : "unexpected error" }, "code" : 500};
  }

  //validate the configuration
  var missingFields = '';

  if (typeof(config.enable) === "undefined") {
    missingFields += ', enable';
  }
  if (missingFields.length > 0) {
    return {
      "value" : { "success": false, "error": "There are some missing fields: " + missingFields.substring(2) },
      "code" : 400
    };
  }

  return {
    "value" : { "success": true },
    "code" : 200
  };
}

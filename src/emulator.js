#!/usr/bin/env node

'use strict'

const debugInfo = require('debug')('info')
const debugFine = require('debug')('fine')
const debugFinest = require('debug')('finest')
const Hapi = require('hapi');
const mocker = require('./mocker')

mocker.init();

var server = new Hapi.Server();
server.connection({port: 5000});

//Function that configures a simple endpoint in the API.
//If more configuration params is needed, configure the route manually
const endpoint = function(method, path, mockFunction) {

  let mockHandler = function(req, reply) {
    debugFine('receiving request...');
    debugFinest(req);

    debugFine('invoking mockFunction')
    const mockerResult = mockFunction();
    debugFine(mockerResult);

    reply(mockerResult.value)
      .type('application/json')
      .code(mockerResult.code);

    debugFine('reply sent.');
  }
  mockHandler.mockFunction = mockFunction;

  server.route({
    method: method,
    path: path,

    handler: mockHandler

  });
}

// /heart endpoint [start]
endpoint('GET', '/heart', mocker.heart);
// /heart endpoint [end]

// /device-info endpoint [start]
endpoint('GET', '/device-info', mocker.deviceInfo);
// /device-info endpoint [end]

// /networks endpoint [start]
endpoint('GET', '/networks', mocker.networks);
// /networks endpoint [end]

// /wifi/connect endpoint [start]
endpoint('PUT', '/wifi/connect', mocker.wifiConnect);
// /wifi/connect endpoint [end]

// /wifi/status endpoint [start]
endpoint('GET', '/wifi/status', mocker.wifiStatus);
// /wifi/status endpoint [end]

// /config endpoint [start]
endpoint('PUT', '/config', mocker.config);
// /config [end]

// /proxy/control endpoint [start]
endpoint('PUT', '/proxy/control', mocker.proxyControl);
// /proxy/control [end]


//Start the emulator server
server.start((err) => {
    if (err) {
        throw err;
    }
    debugInfo(`Server running at: ${server.info.uri}`);
});

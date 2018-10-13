const noble = require('noble')
//const parseEddystoneBeacon = require('./lib/eddystone')

const prefixes = ['http://www.', 'https://www.', 'http://', 'https://']

const suffixes = [
  '.com/',
  '.org/',
  '.edu/',
  '.net/',
  '.info/',
  '.biz/',
  '.gov/',
  '.com',
  '.org',
  '.edu',
  '.net',
  '.info',
  '.biz',
  '.gov'
]

const serviceUuids = ['febe']

const allowDuplicates = false

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning()
  } else {
    noble.stopScanning()
  }
})

noble.on('discover', function(peripheral) {
  console.log("test_index.js discovered a device")
  const ad = peripheral.advertisement
  if (ad.serviceUuids != '') {
    console.log('Found device with local name: ' + ad.localName)
    console.log("advertising the following service uuid's: " + ad.serviceUuids)
    console.log('peripheral.advertisement.serviceData: ' + ad.serviceData)
    if (ad.serviceData[0]) {
      if (ad.serviceData[0].uuid && ad.serviceData[0].uuid === 'feaa') {
        str = JSON.stringify(ad.serviceData[0].data, null, 4)
        console.log('data: ' + str)
        const serviceDataBuffer = ad.serviceData[0].data
        const frameType = serviceDataBuffer.readUInt8(0)

        // Check  that this is a URL frame type
        if (frameType !== 0x10) {
          return
        }

        const prefix = serviceDataBuffer.readUInt8(2)
        if (prefix > prefixes.length) {
          return
        }

        let url = prefixes[prefix]

        for (let i = 3; i < serviceDataBuffer.length; i++) {
          if (serviceDataBuffer[i] < suffixes.length) {
            url += suffixes[serviceDataBuffer[i]]
          } else {
            url += String.fromCharCode(serviceDataBuffer[i])
          }
        }
        console.log(url)
      }
    }
    /*
    peripheral.connect(function(error) {
      if (error) {
        console.log(error)
      } else {
        console.log('connected to peripheral: ' + peripheral.uuid)
        peripheral.discoverServices(null, function(error, services) {
          console.log('discovered the following services:')
          for (var i in services) {
            console.log('  ' + i + ' uuid: ' + services[i].uuid)
          }
        })
      }
    }) */
  }
})

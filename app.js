import SerialPort from "serialport"
import dgram from 'dgram'
import wifiscanner from 'node-wifiscanner'
import events from 'events'

const server = dgram.createSocket('udp4');

console.log("before port instanciation");
const accelerometerPort = new SerialPort("/dev/ttyUSB0", { baudrate: 9600, autoOpen: false });
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false }); // bluetooth port
console.log("after bluetooth port instanciation");


const accelerometer = new events.EventEmitter();

accelerometerPort.on('open', () => {
	console.log("acceleremeter Port opened");
});

accelerometerPort.on('error', (err) => {
  console.log('Error: ', err.message);
})


accelerometerPort.on('data', (data) => {
  console.log('accelerometerPort Data: ' + data);
  if (data == 'V') accelerometer.emit('motion');
});


let scanId = 0;
let ownerIsNear = false;
let isPinging = false;

accelerometer.on('motion', () => {
	ownerIsNear = false;
	if (!isPinging) {
		bluetoothPing();
	}
})

port.on('open', () => {
	console.log("Port opened");
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})


function bluetoothPing() {
	isPinging = true;
	ownerIsNear = false;
	const loopId = setInterval(() => {
		console.log("sending Ping ...");
		port.write('P');
	}, 2000);
	setTimeout(() => {
		clearInterval(loopId);
		if (ownerIsNear == false) {
			console.log("PING call to alert");
			alert();
		}
		isPinging = false;
	}, 30000)
	// set Timer : after 30 seconds, if ownerIsNear is still false -> alert()
}

port.on('data', (data) => {
  console.log('Data: ' + data);
  if (data == 'A') {
  	ownerIsNear = true;
  }
});


//  broadcasts an alert message every 5 seconds
function alert() {
	server.setBroadcast(true);

	wifiscanner.scan((error, data) => {
		console.log(`error : ${error}`);
		console.log('scan result : ',data);

		for (let i = 0; i < data.length; i++) {
			const objectToSend = { "mac": data[i].mac, "ssid": data[i].ssid, "signal_level": data[i].signal_level, scanId: `${scanId}`, moreSequence: i<data.length-1 ? "1" : "0" };
			let jsonToSend = JSON.stringify(objectToSend)
			const msg = new Buffer(jsonToSend);
			server.send(msg, 0, jsonToSend.length, 950, "10.0.0.255", () => {
				console.log("data sent : " + jsonToSend.length);
			})
		}
		scanId += 1;
	})
	if (!ownerIsNear) {
		console.log("ALERT call to alert");
		setTimeout(() => {
			alert();
		}, 5000);
	}
}

port.open();
accelerometerPort.open();

server.on('error', (error) => {
	console.log(`server error : ${error}`);
	server.close();
})

server.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
	let msgJson = {};

	try {
		msgJson = JSON.parse(msg);
		msgJson.senderIp = msgJson.senderIp || rinfo.address;
	} catch (e) {
		console.log(e);
		return;
	}

	if (ownerIsNear) {
		port.write(JSON.stringify(msgJson), () => {
			console.log("sent by bluetooth");
		});
	}
})

server.on('listening', () => {
	const { address, port } = server.address();
	console.log(`server listening on address : ${address}, port : ${port}`);
})

server.bind(950);

process.on('SIGTERM', () => {
	console.log("APP CLOSING")
})

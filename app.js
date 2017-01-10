import SerialPort from "serialport"
import dgram from 'dgram'
import wifiscanner from 'node-wifiscanner'
import events from 'events'

const server = dgram.createSocket('udp4');

console.log("before port instanciation");
const accelerometerPort = new SerialPort("/dev/ttyUSB0", { baudrate: 9600, autoOpen: false });
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");


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

// let rebroadcastedMessages = { senderIp: [ scanIds ... ] }

let scanId = 0;
let ownerIsNear = false;

accelerometer.on('motion', () => {
	ownerIsNear = false;
	bluetoothPing();
})

// accelerometer.on('stop', () => {
	// bluetoothPing(); à executer pendant un moment
//})

port.on('open', () => {
	console.log("Port opened");
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})


function bluetoothPing() {
	let stop = false;
	ownerIsNear = false;
	setTimeout(() => {
		stop = true;
	}, 60000)
	setInterval(() => {
		console.log("sending Ping ...");
		port.write('P');
		if (stop) {
			if (ownerIsNear == false) alert();
			return;
		}
	}, 2000);

	// set Timer : au bout de 1 minute (ou 30 sec), si owerIsNear est toujours false, -> alert();
}

port.on('data', (data) => {
  console.log('Data: ' + data);
  if (data == 'A') {
  	ownerIsNear = true;
  }
});


// cette fonction broadcast le scan toutes les 5 secondes
function alert() {
	setTimeout(() => {
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
		if (!ownerIsNear) alert();
	}, 5000);
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

	// re-broadcaster le même message si le scanId ne se trouve pas dans le tableau des scanId déjà re-broadcastés, du même émetteur.
	// si message rebroadcasté avait le moreFragment à 0 => ajouter le scanId dans rebroadcastedMessages
	

	// si port fermé (pas connecté à son propriétaire), stocker en mémoire pendant 24 h.
	// sinon ...
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

import SerialPort from "serialport"
import dgram from 'dgram'

console.log("before port instanciation");
const port = new SerialPort("/dev/tty.Bluetooth-Incoming-Port", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");

port.on('open', () => {
	console.log("Port opened");
	//loop();
});

port.on('data', (data) => {
  console.log('Data: ' + data);
  if (data == 'P') {
    port.write('A');
  }
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})


function loop() {
	setInterval(() => {
		console.log("sending Ping ...");
		port.write('P');
	}, 2000)
}

port.open();

const server = dgram.createSocket('udp4');

server.on('error', (error) => {
	console.log(`server error : ${error}`);
	server.close();
})

server.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
	// try to parse msg as json : if succeed
	  // send "D" then add to the json the sender mac and ip, send msg, then finally send "E"
	// else  if not succeed dont send to bluetooth
	try {
		let msgJson = JSON.parse(msg);
		msgJson.senderIp = rinfo.address;
	} catch (e) {
		console.log(e);
		return;
	}
	port.write(JSON.stringify(msgJson), () => {
		console.log("sent by bluetooth");
	});
})

server.on('listening', () => {
	const { address, port } = server.address();
	console.log(`server listening on address : ${address}, port : ${port}`);
})

server.bind(950);

process.on('SIGTERM', () => {
	console.log("APP CLOSING")
})

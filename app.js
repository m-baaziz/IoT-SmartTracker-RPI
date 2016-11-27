import gpio from "pi-gpio"
import SerialPort from "serialport"
import dgram from 'dgram'

console.log("before port instanciation");
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");

port.on('open', () => {
	console.log("Port opened");
	loop();
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
	port.write(msg);
})

server.on('listening', () => {
	const { address, port } = server.address();
	console.log(`server listening on address : ${address}, port : ${port}`);
})

server.bind(950);

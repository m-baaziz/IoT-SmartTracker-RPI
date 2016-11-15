import gpio from "pi-gpio"
import SerialPort from "serialport"

console.log("before port instanciation");
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");

port.on('open', () => {
	console.log("Port opened")
	port.write('AT');
	port.write(new Buffer('AT'));
});

port.on('data', (data) => {
  console.log('Data: ' + data);
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})

port.open();

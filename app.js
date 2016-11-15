import gpio from "pi-gpio"
import SerialPort from "serialport"

const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600 });

port.on('open', () => {
	console.log("Port opened")
});

port.on('data', (data) => {
  console.log('Data: ' + data);
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})
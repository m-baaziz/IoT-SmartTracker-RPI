import gpio from "pi-gpio"
import SerialPort from "serialport"

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
		port.write('P');
	}, 2000)
}

port.open();

import gpio from "pi-gpio"
import SerialPort from "serialport"

const pullUpPin = 16;

console.log("before port instanciation");
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");

function pullUpOn() {
  gpio.write(pullUpPin, 1, () => {
  	console.log("pull up on");
  });
}

function pullUpOff() {
	gpio.write(pullUpPin, 0, () => {
  	console.log("pull up off");
  });
}

function write(data, callback) {
	pullUpOff();
	port.write(data, () => {
		port.drain();
		if (typeof callback == "function") {
			callback();
		}
		pullUpOn();
	})
}

port.on('open', () => {
	console.log("Port opened")
	gpio.open(pullUpPin, "output", (err) => {
		console.log("pin " + pullUpPin + " opened");
		pullUpOn();
		write('AT');
	});
});

port.on('data', (data) => {
  console.log('Data: ' + data);
  if (data == 'P') {
    write('A');
  }
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
  pullUpOn();
  gpio.close(pullUpPin);
})

port.open();

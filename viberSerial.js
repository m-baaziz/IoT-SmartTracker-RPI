import SerialPort from "serialport"
import events from 'events';
import gpio from 'pi-gpio'

console.log("start")

const port = new SerialPort("/dev/ttyUSB0", { baudrate: 9600, autoOpen: false });

port.on('open', () => {
	console.log("Port opened");
});

port.on('error', (err) => {
  console.log('Error: ', err.message);
})



port.on('data', (data) => {
  console.log('Data: ' + data);
});

const accelerator = new events.EventEmitter();

accelerator.on('vibration', () => {
	console.log("VIBRATION");
})

gpio.open(16, "input", (error) => {
	if (error) console.log(error)
  setInterval(() => {
		gpio.read(16, (err, value) => {
	    if(err) console.log(err);
	    if (value == 1) accelerator.emit('vibration')
		});
	}, 50);
});
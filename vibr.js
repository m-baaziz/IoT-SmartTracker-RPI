const EventEmitter = require('events');
import gpio from 'pi-gpio'

console.log("start")

class Accelerator extends EventEmitter {}

const accelerator = new Accelerator();

accelerator.on('vibration', () => {
	console.log("VIBRATION");
})

gpio.open(16, "input", (error) => {
	if (error) console.log(error)
  setInterval(() => {
		gpio.read(16, (err, value) => {
	    if(err) console.log(err);
	    accelerator.emit('vibration')
		});
	}, 50);
});
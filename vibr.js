import events from 'events';
import gpio from 'pi-gpio'

console.log("start")

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
import gpio from 'pi-gpio'

setInterval(() => {
	gpio.read(16, (err, value) => {
    if(err) throw err;
    console.log(value);	// The current state of the pin 
	});
}, 1000);
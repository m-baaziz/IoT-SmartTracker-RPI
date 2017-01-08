import gpio from 'pi-gpio'

console.log("start")
setInterval(() => {
	gpio.read(16, (err, value) => {
    if(err) console.log(err);
    console.log("val : "+value);	// The current state of the pin 
	});
}, 1000);
import gpio from 'pi-gpio'

console.log("start")

gpio.open(16, "input", (error) => {
	if (error) console.log(error)
  setInterval(() => {
		gpio.read(16, (err, value) => {
	    if(err) console.log(err);
	    console.log("val : "+value);
		});
	}, 1000);
});
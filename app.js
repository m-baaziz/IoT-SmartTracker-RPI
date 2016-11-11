import gpio from "pi-gpio"

console.log("starting ...")
gpio.open(16, "output", err => {
	gpio.write(16, 1, () => {
		console.log("writing ...")
		setTimeout(()=>{gpio.close(16);}, 5000);
	})
});
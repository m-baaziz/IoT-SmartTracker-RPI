import gpio from "pi-gpio"

console.log("starting ...")
gpio.open(16, "output", err => {
	gpio.write(16, 1, () => {
		console.log("writing ...")
		gpio.close(16);
	})
});
import gpio from "pi-gpio"
import SerialPort from "serialport"

console.log("before port instanciation");
const port = new SerialPort("/dev/ttyAMA0", { baudrate: 9600, autoOpen: false });
console.log("after port instanciation");

port.on('open', () => {
	console.log("Port opened")
	for (let i = 0; i < 10; i++) {
		console.log("sending AT : " + i);
		port.write('AT', () => {
			port.drain();
		});
		setTimeout(() => {}, 2000);
	}
	// port.write('AT', () => {
	// 	port.drain();
	// });
	//port.write(new Buffer('AT'));
});

// port.on('data', (data) => {
//   console.log('Data: ' + data);
//   if (data == 'P') {
//     port.write('A', () => {
// 			port.drain();
// 		});
//   }
// });

port.on('error', (err) => {
  console.log('Error: ', err.message);
})

port.open();

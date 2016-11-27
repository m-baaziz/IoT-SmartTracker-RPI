import dgram from 'dgram'
import wifiscanner from 'node-wifiscanner'

const client = dgram.createSocket('udp4');

client.on('error', (error) => {
	console.log(`client error : ${error}`);
	client.close();
})

client.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
})

client.on('listening', () => {
	client.setBroadcast(true);

	wifiscanner.scan((error, data) => {
		console.log(`error : ${error}`);
		console.log('data : ',data);
	})
	
	// setInterval(() => {
	// 	const message = new Buffer("PING");
	// 	client.send(message, 0, 4, 950, "10.0.0.255", () => {
	// 		console.log("ping sent");
	// 	});
	// }, 2000)
})

client.bind(950);
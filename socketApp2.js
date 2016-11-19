import dgram from 'dgram'

const client = dgram.createSocket('udp4');

client.on('error', (error) => {
	console.log(`client error : ${error}`);
	client.close();
})

client.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
})

client.on('listening', () => {
	setInterval(() => {
		const message = Buffer.from("PING");
		client.send(message, 950, "10.0.0.2", () => {
			console.log("ping sent");
		});
	}, 2000)
})

client.bind(950);
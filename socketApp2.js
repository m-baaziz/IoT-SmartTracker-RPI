import dgram from 'dgram'

const client = dgram.createSocket('udp4');
try {
	client.setBroadcast(true)
} catch (e) {
	console.log(e);
}

client.on('error', (error) => {
	console.log(`client error : ${error}`);
	client.close();
})

client.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
})

client.on('listening', () => {
	setInterval(() => {
		const message = new Buffer("PING");
		client.send(message, 0, 4, 950, "10.0.0.2", () => {
			console.log("ping sent");
		});
	}, 2000)
})

client.bind(950);
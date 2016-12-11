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

	let scanId = 0;

	wifiscanner.scan((error, data) => {
		console.log(`error : ${error}`);
		console.log('scan result : ',data);

		for (let i = 0; i < data.length; i++) {
			const objectToSend = { "mac": data[i].mac, "ssid": data[i].ssid, "signal_level": data[i].signal_level, scanId: `${scanId}`, moreSequence: i<data.length-1 ? "1" : "0" };
			let jsonToSend = JSON.stringify(objectToSend)
			const msg = new Buffer(jsonToSend);
			client.send(msg, 0, jsonToSend.length, 950, "10.0.0.255", () => {
				console.log("data sent : " + jsonToSend.length);
			})
		}
		scanId += 1;
	})
	
	// setInterval(() => {
	// 	const message = new Buffer("PING");
	// 	client.send(message, 0, 4, 950, "10.0.0.255", () => {
	// 		console.log("ping sent");
	// 	});
	// }, 2000)
})

client.bind(950);
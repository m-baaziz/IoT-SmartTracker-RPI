import dgram from 'dgram'

const server = dgram.createSocket('udp4');

server.on('error', (error) => {
	console.log(`server error : ${error}`);
	server.close();
})

server.on('message', (msg, rinfo) => {
	console.log(`${rinfo.address} : ${msg} (port : ${rinfo.port})`)
})

server.on('listening', () => {
	const { address, port } = server.address();
	console.log(`server listening on address : ${address}, port : ${port}`);
})

server.bind(950);
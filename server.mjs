import dgram from 'dgram'
import { networkInterfaces } from 'os'

const server = dgram.createSocket('udp4')
const port = 42069

server.on('listening', () => {
    const address = server.address()
    console.log(`Web server running on ${address.address}:${address.port}`)
})

server.on('message', (_message, remote) => {
    console.log(`Received broadcast from: ${remote.address}:${remote.port}`)

    const ipAddress = getIpAddress()
    const response = Buffer.from(ipAddress)

    server.send(response, 0, response.length, remote.port, remote.address, (err) => {
        if (err)
            console.error('Error sending response: ', err)
        else
            console.log('Response sent successfully')
    })
})

server.bind(port, () => {
    server.setBroadcast(true)
})

function getIpAddress() {
    const interfaces = networkInterfaces()
    for (const ifaceName in interfaces) {
        const iface = interfaces[ifaceName]
        for (const alias of iface) {
            if (alias.family === 'IPv4' && alias.internal === false) {
                return alias.address
            }
        }
    }
    return 'Unknown'
}

import dgram from 'dgram'
import { networkInterfaces } from 'os'

const serverPort = 42069
const message = 'Requesting IP Address'
const clients = []
const networkInterfacesAdd = networkInterfaces()

Object.keys(networkInterfacesAdd).forEach((interfaceName) => {
    const networkInterface = networkInterfacesAdd[interfaceName]
    const filteredInterfaces = networkInterface.filter(
        (iface) => iface.family === 'IPv4' && !iface.internal
    )

    filteredInterfaces.forEach((iface) => {
        const broadcastAddress = iface.address.split('.').slice(0, 3).concat('255').join('.')
        console.log(`Sending broadcast from ${broadcastAddress}`)

        const client = dgram.createSocket('udp4')

        // just to print later which adapter
        client.adapter = broadcastAddress
        clients.push(client)

        client.on('listening', () => {
            const address = client.address()
            console.log(`Client listening on ${address.address}:${address.port}`)
        })

        client.on('message', (response, remote) => {
            console.log(`\nReceived response from: ${remote.address}:${remote.port} in ${client.adapter}`)
            console.log(`Raspberry Pi IP: ${response.toString()}\n`)
            clients.forEach(client => client.close())
        })

        client.bind(() => {
            client.setBroadcast(true)

            client.send(message, 0, message.length, serverPort, broadcastAddress, (err) => {
                if (err)
                    console.error('Error sending broadcast: ', err)
                else
                    console.log('Broadcast sent successfully')
            })
        })
    })
})


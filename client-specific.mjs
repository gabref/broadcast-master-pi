import dgram from 'dgram'

const client = dgram.createSocket('udp4')

// get command line argument
const args = process.argv.slice(2)
const argMap = args.reduce((acc, arg, index) => {
    if (arg === '-ip' && index < args.length - 1)
        acc.ip = args[index + 1]
    return acc
}, {})

const broadcastAddress = argMap.ip || '255.255.255.255'
const serverPort = 42069
const message = 'Requesting IP Address'

client.on('listening', () => {
    const address = client.address()
    console.log(`Client listening on ${address.address}:${address.port}`)
})

client.on('message', (response, remote) => {
    console.log(`\nReceived response from: ${remote.address}:${remote.port}`)
    console.log(`Raspberry Pi IP: ${response.toString()}\n`)
    client.close()
})

client.bind(() => {
    client.setBroadcast(true)

    client.send(message, 0, message.length, serverPort, broadcastAddress, (err) => {
        if (err)
            console.error('Error sending broadcast: ', err)
        else {
            const address = client.address()
            console.log(`Broadcast sent successfully from ${address.address}:${address.port}`)
        }
    })
})


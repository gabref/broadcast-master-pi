import { createServer } from 'http'
import { readFile } from 'fs'
import { networkInterfaces } from 'os'

const server = createServer((req, res) => {
    if (req.url === '/json') {
        res.setHeader('Content-Type', 'application/json')
        const jsonData = { message: 'Hello, JSON' }
        res.end(JSON.stringify(jsonData))
    } 
    else if (req.url === '/html') {
        readFile('index.html', (err, data) => {
            if (err) {
                res.statusCode = 500
                res.end('Error loading HTML file')
            } else {
                res.setHeader('Content-Type', 'text/html')
                res.end(data)
            }
        })
    } else {
        res.statusCode = 404
        res.end('404 Not Found')
    }
})

const port = 3000
const networkInterfacesRet = networkInterfaces()
const host = networkInterfacesRet['wlan0'] ? networkInterfacesRet['wlan0'][0].address : networkInterfacesRet['eth0'][0].address 

server.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`)
})

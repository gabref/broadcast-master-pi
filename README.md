# Server Broadcast Test

Just a little project to test something for another project.

## What are we testing?

Base architecture: we have a raspberry, and in it we're going to run a server in a certain port. The idea is from a computer in the same network, broadcast a signal accross the network hunting for webservers running in the certain port, and find the IP of the raspberry.

## How to test

<br>
[server.mjs](./server.mjs) is the base webserver we will run in the raspberry pi.<br>

[client-specific.mjs](./client-specific.mjs) is a client where we send a request for a specific IP, but we could make a broadcast also, I'll explain later. It was just for testing purposes because it wasn't working on my network, and at the time, I didn't understand why. To use it, just run the file with a flag indicating the ip of the raspberry pi or the ip of wherever you are running the webserver:

```bash
node client-specific.mjs -ip 192.168.37.11
```

<br>
After some research I encountered this [superuser answer](https://superuser.com/questions/1758749/udp-broadcast-not-working-for-one-pc-in-the-lan) that made me understand why the simple broadcast wasn't working, because I have multiple network adapters in my PC. If you don't, you should be able to make a broadcast and find the raspberry pi ip with:

```bash
node client-specific.mjs -ip 255.255.255.255
```

but if you have, like me, multiple network adapters from vmware, virtual box or even wsl, we need to make the broadcast through all the adapters, which is what we are doing in [client.mjs](./client.mjs). To test, just run it.

```bash
node client.mjs
```

## Useless files

The [server-html-json](./server-html-json.mjs) file was just a test to make sure that I didn't had any firewall problems. Just put a `index.html` file in the same directory, run it, and you should be able to access it from another pc in the same network pointing to the IP and PORT: `http://192.168.37.11:42069`.

<br>

[test.mjs](./test.mjs) this file just prints your virtual network adapters, just like ipconfig or ifconfig.

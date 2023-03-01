const http = require('http')
const {Server} = require('socket.io')


const server = http.createServer()

const io = new Server(server,{
    cors : "http://localhost:3000"
})

let users = []

const addUser = (userId,socketId) => {
    if(!users.some(e => e.userId === userId)) users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users = users.filter(e => e.socketId !== socketId)
}

io.on("connection",(socket) =>{
    
    socket.on("addUser",(userId) =>{console.log("adduser") 
        addUser(userId,socket.id)
        console.log(users);
        io.emit("usersList",users)
    })

    socket.on("sendMessage",({senderId,receiverId,message}) => {
        let receiver = users.find(e => e.userId === receiverId)
        console.log(message);
        console.log(receiverId);
        console.log(senderId);
        console.log(users);
        if(receiver)io.to(receiver.socketId).emit("getMessage",{
            sender : senderId,
            createdAt : new Date(),
            message
        })
    })

    socket.on("disconnect",() =>{console.log("diss");
        removeUser(socket.id)
        io.emit("usersList",users)
    })
})


server.listen(process.env.PORT || 3002)
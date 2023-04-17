const http = require('http')
const {Server} = require('socket.io')


const server = http.createServer()

const io = new Server(server,{
    cors : "https://merry-axolotl-091b76.netlify.app"
})

let users = []

const addUser = (userId,socketId) => {
    if(!users.some(e => e.userId === userId)) users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users = users.filter(e => e.socketId !== socketId)
}

const removeUserById = (id) =>{
    users = users.filter(e => e.userId != id)
}

io.on("connection",(socket) =>{
    
    socket.on("addUser",(userId) =>{console.log("adduser") 
        addUser(userId,socket.id)
        console.log(users);
        io.emit("usersList",users)
    })

    socket.on("sendMessage",({senderId,receiverId,message,createdAt,_id,timestamp}) => {console.log("senddd");
        let receiver = users.find(e => e.userId === receiverId)
        // console.log(message);
        // console.log(receiverId);
        // console.log(senderId);
        // console.log(users);
        if(receiver)io.to(receiver.socketId).emit("getMessage",{
            sender : senderId,
            createdAt,
            message,
            _id,
            timestamp
        })
    })

    socket.on("changeStatus",({newMessageList,friend,userId}) =>{
        console.log(newMessageList,friend,userId)
      let receiver = users.find(e => e.userId === friend)
      console.log(receiver)
      if(receiver) io.to(receiver.socketId).emit("updateMessageStatus",{friendId:userId,newMessageList}) 
    })

    socket.on("disconnect",() =>{console.log("diss")
        removeUser(socket.id)
        io.emit("usersList",users)
    })

    socket.on("removeUser",(id) =>{console.log("logout");
        removeUserById(id)
        io.emit("usersList",users)
        console.log(users);
    })
})


server.listen(process.env.PORT || 3002)
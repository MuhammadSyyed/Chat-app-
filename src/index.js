const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generatemsg , genelocmsg} = require('./utils/msgs')
const { adduser , removeuser , getuser , getuserinroom } = require('./utils/users')

const express = require ('express')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const files = path.join(__dirname,'../public')

app.use(express.static(files))

io.on('connection',(socket)=>{
        console.log('User connected')

        socket.on('join',(options,callback)=>{

        const {error,user} = adduser({id: socket.id , ...options})

            if(error){
                return callback(error)
            }
        
        socket.join(user.room)
        socket.emit('message',generatemsg('Admin',`Welcome ${user.username}!`)) 
        socket.broadcast.to(user.room).emit('message',generatemsg('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomdata',{
            room: user.room,
            users: getuserinroom(user.room)
        })
        callback()

    })

        socket.on('sendmessage',(message,callback)=>{
            const filter = new Filter()
            if (filter.isProfane(message)){
                return callback('Profanity is not allowed!')
            }
            const user = getuser(socket.id)
            io.to(user.room).emit('message',generatemsg(user.username,message))
            callback()
        })
        socket.on('disconnect',()=>{
            const user = removeuser(socket.id)
            if(user){
                io.to(user.room).emit('message',generatemsg('Admin',`${user.username} has left!`))
                io.to(user.room).emit('roomdata',{
                    room: user.room,
                    users: getuserinroom(user.room)
                })
            }

        })
        socket.on('sendlocation',(coords,callback)=>{
            const user = getuser(socket.id)
            io.to(user.room).emit('locmessage',genelocmsg(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback('Shared!')
        })
    })

server.listen(port,()=>{
    console.log('Server is up on port ' + port)
})
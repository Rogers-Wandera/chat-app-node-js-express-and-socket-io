const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {origin:"*"}});

const PORT = process.env.PORT || 5000

app.get("/", (req,res) => {
    res.status(200).sendFile(path.join(__dirname,"public","index.html"))
})
let users = [];

io.on("connection", (socket) => {
    console.log("connected")
    socket.on("getUserName", (data) => {
        if(users.indexOf(data) > -1){
            socket.emit("userExists", `User ${data} already exists`);
        } else {
            users.push(data)
            socket.emit("setUser", {username: data});
            socket.emit("welcome", {username: data})
        }
    })

    socket.on("msg", (data) => {
        io.sockets.emit("newMsg", {user: data.user, message: data.message})
    })
    socket.on("disconnect", () => {
        console.log("disconnected")
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
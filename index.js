const express = require('express');
const fs = require('fs')
const mongoose = require('mongoose');
const uri="mongodb+srv://Atlas:Mernatlas@2525@cluster0.f3uv5.mongodb.net/?retryWrites=true&w=majority"
const socketiofileupload = require('socketio-file-upload');
const app = express();
app.use(socketiofileupload.router);
app.use(express.static(__dirname + "/uploads"));

mongoose.connect(uri,()=>{
    console.log("Backend connected Succesfully");
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.get('/deleteimage', (req, res) => {
    console.log(req.query);
    res.json(req.query.path);
    fs.unlinkSync(__dirname + "/uploads/" + req.query.path, () => {
        
    })
})
const http = require('http');

const server = http.createServer(app);

const {Server} = require('socket.io');

const io = new Server(server);
io.sockets.on("connection",(socket)=>{
    console.log(socket);

    var uploader = new socketiofileupload();
    uploader.dir="uploads";
    uploader.listen(socket);
    uploader.on('saved',function(event){
        console.log(event)

        event.file.clientDetail.nameofImage=event.file.name;
    })
    uploader.on('error',(event)=>{
        console.log(event)
    })
})
server.listen(3000,()=>{
    console.log("App is listening on port 3000");
})

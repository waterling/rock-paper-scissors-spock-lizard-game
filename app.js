const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const config = require('./config.json');
const uuidv1 = require('uuid/v1');
const actions = require('./actions');
const routes = require("./routes");
const Room = require("./game-api").Room;
const Player = require("./game-api").Player;
const Game = require("./game-api").Game;

const CONNECT_TO_ROOM = 'room connect';
const CREATE_ROOM = 'create room';
const ROOM_CREATED = 'room created';
const ROOM_CONNECTED = 'connected to the room';
const GESTURE = 'gesture';
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';

const port = process.env.PORT || config.PORT || 4001;


const app = express();
app.use(routes);

const server = http.createServer(app);
let rooms = [];

const io = socketIo(server);

io.on(CONNECTION, socket => {
    console.log("New client");
    socket.on(CREATE_ROOM, createRoom);
    socket.on(CONNECT_TO_ROOM, connectToRoom);
    socket.on(GESTURE, handleGesture);
    socket.on(DISCONNECT, () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));


function createRoom(data) {
    const socket = this;
    let roomID = uuidv1();
    let room = new Room(roomID);
    let playerName = data.name;
    let player = new Player(playerName);

    player.id = socket.id;
    room.addPlayer(player);
    rooms[roomID] = room;

    socket.join(roomID);
    socket.emit(ROOM_CREATED, player);

    console.log('Create new room');
    console.log('Room ID: ' + roomID);
    console.log(playerName + ' connected to the room ' + roomID);
}


function connectToRoom(data) {
    const socket = this;
    let {name, roomID} = data;
    let room = rooms[roomID]; //TODO add error handle if haven't room
    let player = new Player(name);

    player.id = socket.id;
    room.addPlayer(player);
    rooms[roomID] = room;

    socket.join(roomID);
    socket.emit(ROOM_CONNECTED, player);
    console.log(name + ' connected to the room ' + roomID);
}

function disconnect() {
    const socket = this;
    const roomID = socket.rooms[0];
    let room = rooms[roomID];
    let player = room.getPlayerById(socket.id);

    room.deletePlayer(player);
    if(room.isEmpty()){
        rooms.slice(roomID,1);
    }
}


function handleGesture() {
    const socket = this;
    let gesture = socket.handshake.query.gesture;
    let room = rooms[socket.rooms[0]];
    let player = room.getPlayerById(socket.id);

    player.gesture;
}

let checkIfBothPassed = room => {
    let players = room.players;
    let result = false;
    players.forEach(player => {
        result = !!player.gesture;
    });
    return result;
};
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const config = require('./config.json');
const uuidv1 = require('uuid/v1');
const actions = require('./actions');
const routes = require("./routes");
const gameApi = require("./game-api");
const Room = gameApi.Room;
const Player = gameApi.Player;
const game = new gameApi.Game;

const CONNECT_TO_ROOM = 'room connect';
const CREATE_ROOM = 'create room';
const ROOM_CREATED = 'room created';
const ROOM_CONNECTED = 'connected to the room';
const OPPONENT_CAME_OUT = 'opponent came out';
const GESTURE = 'gesture';
const ROUND_RESULT = 'round result';
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';

const port = process.env.PORT || config.PORT || 4001;


const app = express();
app.use(routes);

const server = http.createServer(app);
let rooms = {};

const io = socketIo(server);

io.on(CONNECTION, socket => {
    console.log("New client");
    socket.on(CREATE_ROOM, createRoom);
    socket.on(CONNECT_TO_ROOM, connectToRoom);
    socket.on(GESTURE, handleGesture);
    socket.on(DISCONNECT, disconnect);
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
    socket.emit(ROOM_CREATED, {roomID: roomID});

    console.log('Create new room');
    console.log('Room ID: ' + roomID);
    console.log(playerName + ' ' + player.id + ' connected to the room ' + roomID);
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
    //TODO error handle if reconnect
    const socket = this;
    const room = findRoomDisconnectedPlayer(socket.id);
    let player = room.getPlayerById(socket.id);
    room.deletePlayer(player);
    console.log(player.name + ' came out from room ' + room.id);
    if (room.isEmpty()) {
        delete rooms[room.id];
        console.log('Room ' + room.id + ' have been deleted because all players leaved');
    } else {
        opponentCameOut(socket, room.id);
    }
}

function opponentCameOut(socket, roomID) {
    socket.to(roomID).emit(OPPONENT_CAME_OUT, {roomID: roomID});
}

function handleGesture(data) {
    const socket = this;
    let gesture = data.gesture;
    let room = rooms[socket.rooms[0]];
    let player = room.getPlayerById(socket.id);

    player.gesture = gesture;
    if (checkIfBothHasChosen(room)) {
        let anotherPlayer = room.getAnotherPlayers()[0];
        let results = game.checkWhoWin(player.gesture, anotherPlayer.gesture).results;
        player.result = results[0];
        anotherPlayer.result = results[1];
        socket.to(room.id).emit(ROUND_RESULT, [player, anotherPlayer]);
    }
}

let checkIfBothHasChosen = room => {
    let players = room.players;
    let result = false;
    players.forEach(player => {
        result = !!player.gesture;
    });
    return result;
};

let findRoomDisconnectedPlayer = (id) => {
    for (let room in rooms) {
        if (rooms.hasOwnProperty(room)) {
            let player = rooms[room].getPlayerById(id);
            if (player) {
                return rooms[room];
            }
        }
    }
};
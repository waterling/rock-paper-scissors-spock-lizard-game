const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const config = require('./config.json');
const uuidv1 = require('uuid/v1');
const actions = require('./actions');
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
const ROOM_IS_FULL = 'room is full';
const ROOM_DOESNT_EXIST = 'room doesnt exist';
const RESULT_OF_ROUND = 'round result';
const START_GAME = 'start_game';
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';
const OPPONENT_CHOOSE_GESTURE = 'opponent choose gesture';


const SEND_MESSAGE = 'send message';
const RECEIVE_MESSAGE = 'receive message';


const port = process.env.PORT || config.PORT || 4001;

const app = express();

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));

let rooms = {};

const io = socketIo(server);

io.on(CONNECTION, socket => {
    console.log("New client");
    socket.on(CREATE_ROOM, createRoom);
    socket.on(CONNECT_TO_ROOM, connectToRoom);
    socket.on(GESTURE, handleGesture);
    socket.on(DISCONNECT, disconnect);

    socket.on(RECEIVE_MESSAGE, sendMessage);
});


/**********************
 *                    *
 *    ROOM ACTIONS    *
 *                    *
 **********************/


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

//todo separate connect and start game
function connectToRoom(data) {
    const socket = this;
    let {name, roomID} = data;
    let room = rooms[roomID];
    if (!room) {
        handleNonExistentRoom(socket);
        return;
    }
    if (room.countOfPlayers() >= 2) {
        handleFullRoom(socket);
        return;
    }
    let player = new Player(name);

    player.id = socket.id;
    room.addPlayer(player);
    rooms[roomID] = room;

    socket.join(roomID);
    socket.emit(ROOM_CONNECTED, {roomID: roomID, id: socket.id});
    console.log(name + ' connected to the room ' + roomID);

    io.to(roomID).emit(START_GAME, room.playersToObject())
}

function handleNonExistentRoom(socket) {
    socket.emit(ROOM_DOESNT_EXIST);
}

function handleFullRoom(socket) {
    socket.emit(ROOM_IS_FULL);
}

function disconnect() {
    const socket = this;
    const room = findRoomDisconnectedPlayer(socket.id);
    if (!room) {
        console.log('Client has been disconnected');
        return;
    }
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
    io.to(roomID).emit(OPPONENT_CAME_OUT, {roomID: roomID, leavedPlayerID: socket.id});
}


/**********************
 *                    *
 *    GAME ACTIONS    *
 *                    *
 **********************/

//TODO  separate result and gesture
function handleGesture(data) {
    const socket = this;
    let gesture = data.gesture;
    let room;
    for (let i in socket.rooms) {
        if (socket.rooms.hasOwnProperty(i)) {
            if (i !== socket.id) {
                room = rooms[i];
                break;
            }
        }
    }
    let player = room.getPlayerById(socket.id);
    player.gesture = gesture;
    sendOpponentChooseGesture(room);
    if (checkIfBothHaveChosen(room)) {
        let anotherPlayer = room.getAnotherPlayers(player)[0];
        let results = game.checkWhoWin(player.gesture, anotherPlayer.gesture).results;
        player.result = results[0];
        anotherPlayer.result = results[1];
        io.to(room.id).emit(RESULT_OF_ROUND, [player.toObject(), anotherPlayer.toObject()]);
        room.clearResultsAndGestures();
    }
}

function sendOpponentChooseGesture(room) {
    io.to(room.id).emit(OPPONENT_CHOOSE_GESTURE);
}

let checkIfBothHaveChosen = room => {
    let players = room.players;
    let result = true;
    let count = 0;
    for (let player in players) {
        if (players.hasOwnProperty(player)) {
            result &= !!players[player].gesture;
            count++;
        }
    }
    if (count <= 1) {
        return false;
    }
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

/**********************
 *                    *
 *    CHAT ACTIONS    *
 *                    *
 **********************/


// data: {roomID, userID, userName, message, time}

function sendMessage(data) {
    const socket = this;
    io.to(data.roomID).emit(SEND_MESSAGE, data);
}
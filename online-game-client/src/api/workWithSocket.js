import socketIOClient from "socket.io-client";
import ACTIONS from "./actions";

let socket;

export function initSocket(endpoint) {
    socket = socketIOClient(endpoint);
    return socket;
}

export function createRoom(name, callback) {
    socket.on(ACTIONS.ROOM_CREATED, (data) => {
        data.id = socket.id;
        callback(data);
    });
    socket.emit(ACTIONS.CREATE_ROOM, {name: name});

    console.log('create room');
}

export function connectToRoom(name, roomID, callback) {
    socket.on(ACTIONS.ROOM_CONNECTED, callback);
    socket.emit(ACTIONS.CONNECT_TO_ROOM, {name: name, roomID: roomID});
    console.log('connect room');
}

export function onStartGame(callback) {
    socket.on(ACTIONS.START_GAME, callback);
}

export function onNonexistentRoom(callback) {
    socket.on(ACTIONS.ROOM_DOESNT_EXIST,callback)
}
export function onFullRoom(callback) {
    socket.on(ACTIONS.ROOM_IS_FULL,callback)
}

export function onGetRoundResult(callback) {
    socket.on(ACTIONS.RESULT_OF_ROUND, callback);
}
export function sendGesture(gesture) {
    socket.emit(ACTIONS.GESTURE, {gesture: gesture});
}

export function onLeavePlayer(callback) {
    socket.on(ACTIONS.OPPONENT_CAME_OUT, callback);
}
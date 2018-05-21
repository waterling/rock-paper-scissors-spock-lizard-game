import socketIOClient from "socket.io-client";
import SocketActions from "./socket-actions";

let socket;

export function initSocket(endpoint) {
    socket = socketIOClient(endpoint);
    return socket;
}

export function createRoom(name, callback) {
    socket.on(SocketActions.ROOM_CREATED, (data) => {
        data.id = socket.id;
        callback(data);
    });
    socket.emit(SocketActions.CREATE_ROOM, {name: name});

    console.log('create room');
}

export function connectToRoom(name, roomID, callback) {
    socket.on(SocketActions.ROOM_CONNECTED, callback);
    socket.emit(SocketActions.CONNECT_TO_ROOM, {name: name, roomID: roomID});
    console.log('connect room');
}

export function onStartGame(callback) {
    socket.on(SocketActions.START_GAME, callback);
}

export function onNonexistentRoom(callback) {
    socket.on(SocketActions.ROOM_DOESNT_EXIST,callback)
}
export function onFullRoom(callback) {
    socket.on(SocketActions.ROOM_IS_FULL,callback)
}

export function onGetRoundResult(callback) {
    socket.on(SocketActions.RESULT_OF_ROUND, callback);
}
export function sendGesture(gesture) {
    socket.emit(SocketActions.GESTURE, {gesture: gesture});
}

export function onLeavePlayer(callback) {
    socket.on(SocketActions.OPPONENT_CAME_OUT, callback);
}
import SocketActions from "./socket-actions";
import * as Room from "../actions/room-actions"
import store from '../store';
import * as CONFIG from "../config";


class RoomApi {
    constructor(socket) {
        this.socket = socket;
        this.socket.on(SocketActions.OPPONENT_CAME_OUT, this.onUserLeave);
    }
    //создаем новую комнату
    createRoom(name) {
        this.socket.on(SocketActions.ROOM_CREATED, data => {
            store.dispatch(
                Room.roomCreatedSuccessful(data.roomID, this.socket.id, this._doInviteLink(data.roomID))
            );
        });
        this.socket.emit(SocketActions.CREATE_ROOM, {name: name});
    }

    //подключаемся к комнате и подписываемся на результаты
    connectToRoom(name, roomID) {
        //комната не существует
        this.socket.on(SocketActions.ROOM_DOESNT_EXIST, data => {
            store.dispatch(
                Room.connectNonexistenceRoom()
            );
        });
        //комната переполнена
        this.socket.on(SocketActions.ROOM_IS_FULL, data => {
            store.dispatch(
                Room.connectFullRoom()
            );
        });
        //подключение успешно
        this.socket.on(SocketActions.ROOM_CONNECTED, data => {
            // здесь я добавил inviteLink для ситуации, когда хост выходил и второй пользователь становился им
            store.dispatch(
                Room.connectRoomSuccessful(data.roomID, data.id, this._doInviteLink(data.roomID))
            );
        });

        this.socket.emit(SocketActions.CONNECT_TO_ROOM, {name: name, roomID: roomID});
    }
    onUserLeave(data) {
        //maybe will need in the future, but now change nothing
        store.dispatch(
            Room.leaveUser(data.roomID, data.leavedPlayerID)
        );
    }
    //создаем ссылку для приглашения
    _doInviteLink(roomID) {
        return `http://${CONFIG.HOST}:${CONFIG.CLIENT_PORT}/?room=${roomID}`
    }
}

export default RoomApi;


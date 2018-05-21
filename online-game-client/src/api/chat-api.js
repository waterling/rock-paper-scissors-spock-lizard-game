import SocketActions from "./socket-actions";
import * as Chat from "../actions/chat-actions"
import store from "../store";


class ChatApi {
    constructor(socket) {
        this.socket = socket;
        this.receiveMessage();
    }

    receiveMessage() {
        this.socket.on(SocketActions.SEND_MESSAGE, (data) => {
            store.dispatch(
                Chat.receiveMessage(data)
            );
        })
    }

    sendMessage(data) {
        this.socket.emit(SocketActions.RECEIVE_MESSAGE, data);
    }
}

export default ChatApi;
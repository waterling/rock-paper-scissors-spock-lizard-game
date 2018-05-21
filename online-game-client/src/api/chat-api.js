import SocketActions from "./socket-actions";
import * as Chat from "../actions/chat-actions"
import store from "../store";


class ChatApi {
    constructor(socket) {
        this.socket = socket;
        this.receiveMessage();
        this.initChat();

    }

    initChat(){
        store.dispatch(
            Chat.clearMessages()
        );
    }

    receiveMessage() {
        this.socket.on(SocketActions.SEND_MESSAGE, (data) => {
            console.log(data, 'receive message');
            store.dispatch(
                Chat.receiveMessage(data)
            );
        })
    }

    sendMessage(data) {
        console.log(data, 'send message');
        this.socket.emit(SocketActions.RECEIVE_MESSAGE, data);
    }
}

export default ChatApi;
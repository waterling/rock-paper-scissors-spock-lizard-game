import SocketActions from "./socket-actions";
import * as Chat from "../actions/chat-actions"
import store from "../store";


class ChatApi {
    constructor(socket) {
        this.socket = socket;
        this.receiveMessage();
        this.initChat();

    }
    //инициализация чата
    initChat(){
        store.dispatch(
            Chat.clearMessages()
        );
    }
    //подписываемся на получене сообщений
    receiveMessage() {
        this.socket.on(SocketActions.SEND_MESSAGE, (data) => {
            console.log(data, 'receive message');
            store.dispatch(
                Chat.receiveMessage(data)
            );
        })
    }
    //отправляем сообщения
    sendMessage(data) {
        console.log(data, 'send message');
        this.socket.emit(SocketActions.RECEIVE_MESSAGE, data);
    }
}

export default ChatApi;
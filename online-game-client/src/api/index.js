import socketIOClient from "socket.io-client";
import * as config from "./config"
import RoomApi from "./room-api";
import GameApi from "./game-api";
import ChatApi from "./chat-api";

const endpoint = config.PROTOCOL + "://" + config.HOST + ":" + config.PORT;
let socket = socketIOClient(endpoint);


export let roomApi = new RoomApi(socket);
export let gameApi = new GameApi(socket);
export let chatApi = new ChatApi(socket);
import { combineReducers } from 'redux';


import roomReducer from './room-reducer';
import gameReducer from './game-reducer';
import chatReducer from "./chat-reducer";
import videoReducer from "./video-reducer";


const reducers = combineReducers({
    roomState: roomReducer,
    gameState: gameReducer,
    chatState: chatReducer,
    videoState: videoReducer,
});

export default reducers;
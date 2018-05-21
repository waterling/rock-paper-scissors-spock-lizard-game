import { combineReducers } from 'redux';


import roomReducer from './room-reducer';
import gameReducer from './game-reducer';
import chatReducer from "./chat-reducer";


const reducers = combineReducers({
    roomState: roomReducer,
    gameState: gameReducer,
    chatState: chatReducer,
});

export default reducers;
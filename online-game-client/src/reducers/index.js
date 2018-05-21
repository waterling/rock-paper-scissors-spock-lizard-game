import { combineReducers } from 'redux';


import roomReducer from './room-reducer';
import gameReducer from './game-reducer';


const reducers = combineReducers({
    roomState: roomReducer,
    gameState: gameReducer,
});

export default reducers;
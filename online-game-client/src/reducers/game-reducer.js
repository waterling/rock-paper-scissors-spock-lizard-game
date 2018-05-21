import * as types from '../actions/actions-type';


const initialState = {
    myGesture: undefined,
    players: {},
    gameStarted: false,
};

const gameReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.START_NEW_ROUND:
            return Object.assign(
                {},
                state,
                {
                    myGesture: undefined,
                    players: action.players
                }
            );
        case types.CHOSE_GESTURE:
            return Object.assign({}, state, {myGesture: action.gesture});
        case types.RESULT_OF_ROUND:
            return Object.assign({}, state, {players: action.players});
        case types.START_GAME:
            return Object.assign({}, state, {players: action.players, gameStarted: true});
        case types.PLAYER_LEAVE:
            let players = state.players;
            delete players[action.playerID];
            return Object.assign(
                {},
                state,
                {
                    players: players,
                    gameStarted: false
                }
            );
        default:
            return state;
    }
};

export default gameReducer;
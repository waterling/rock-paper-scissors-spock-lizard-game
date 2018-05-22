import * as types from '../actions/actions-type';


const initialState = {
    roomIsFull: false,
    nonexistentRoom: false,
    roomID: undefined,
    userID: undefined,
    inviteLink: undefined,
};

const roomReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.ROOM_CREATED:
            return Object.assign(
                {},
                state,
                {
                    roomID: action.roomID,
                    userID: action.userID,
                    inviteLink: action.inviteLink,
                    roomIsFull: false,
                    nonexistentRoom: false,
                }
            );
        case types.ROOM_CONNECTED:
            return Object.assign(
                {},
                state,
                {
                    roomID: action.roomID,
                    userID: action.userID,
                    inviteLink: action.inviteLink,
                    roomIsFull: false,
                    nonexistentRoom: false,
                }
            );
        case types.ROOM_IS_FULL:
            return Object.assign({}, state, {roomIsFull: true});
        case types.ROOM_DOESNT_EXIST:
            return Object.assign({}, state, {nonexistentRoom: true});
        case types.OPPONENT_CAME_OUT:
            return Object.assign({}, state, {});
        default:
            return state;
    }
};

export default roomReducer;
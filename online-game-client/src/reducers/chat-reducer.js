import * as types from '../actions/actions-type';


const initialState = {
    messages: [],
};


const chatReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.RECEIVE_MESSAGE: {
            let tempMessages = Array.from(state.messages);
            tempMessages.push({
                userName: action.userName,
                userID: action.userID,
                time: action.time,
                message: action.message,
            });
            return {
                ...state,
                messages: tempMessages
            };
        }

        case types.CLEAR_MESSAGES: {
            return {
                ...state,
                messages: [],
            };
        }

        default:
            return state;
    }
};


export default chatReducer;
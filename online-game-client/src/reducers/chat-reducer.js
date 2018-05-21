import * as types from '../actions/actions-type';


const initialState = {
    messages: []
};


const chatReducer = function (state = initialState, action) {
    switch (action.type){
        case types.RECEIVE_MESSAGE:{
            let tempMessages=[];
            tempMessages.push({
                userName: action.userName,
                userID: action.userID,
                time: action.time,
                message: action.message,
            });
            return Object.assign(
                {},
                state,
                {
                    messages: tempMessages,
                });
        }

        default:
            return state;
    }
};


export default chatReducer;
import * as types from '../actions/actions-type';


const initialState = {
    offer: false,
    isInitiator: false,
    isStarted: false,
    localStream: undefined,
    remoteStream: undefined,
};


const videoReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.SEND_PHONE_CALL: {
            return {
                ...state,
                isInitiator: action.isInitiator,
                isStarted: action.isStarted,
                localStream: action.localStream,

            };
        }

        case types.GET_PHONE_CALL: {
            return {
                ...state,
                offer: action.offer,
            };
        }

        case types.START_PHONE_CALL: {
            return {
                ...state,
                offer: action.offer,
                isStarted: action.isStarted,
                localStream: action.localStream,
                remoteStream: action.remoteStream,
            };
        }

        case types.END_PHONE_CALL: {
            return {
                ...state,
                offer: action.offer,
                isInitiator: action.isInitiator,
                isStarted: action.isStarted,
                localStream: action.localStream,
                remoteStream: action.remoteStream,
            };
        }

        default:
            return state;
    }
};


export default videoReducer;
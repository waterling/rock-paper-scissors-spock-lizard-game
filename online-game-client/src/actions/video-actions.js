import * as types from './actions-type';


export function getPhoneCall(data) {
    return {
        type: types.GET_PHONE_CALL,
        offer: data.offer,
    }
}

export function sendPhoneCall(data) {
    return {
        type: types.SEND_PHONE_CALL,
        isInitiator: data.isInitiator,
        isStarted: data.isStarted,
        localStream: data.localStream,
    }
}


export function startPhoneCall(data) {
    return {
        type: types.START_PHONE_CALL,
        isStarted: data.isStarted,
        offer: data.offer,
        localStream: data.localStream,
        remoteStream: data.remoteStream,

    }
}


export function endPhoneCall(data) {
    return {
        type: types.END_PHONE_CALL,
        isStarted: data.isStarted,
        isInitiator: data.isInitiator,
        offer: data.offer,
        localStream: data.localStream,
        remoteStream: data.remoteStream,

    }
}

import * as types from './actions-type';


export function receiveMessage(data) {
    return {
        type: types.RECEIVE_MESSAGE,
        message: data.message,
        time: data.time,
        userID: data.userID,
        userName: data.userName,
    }
}
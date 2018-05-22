import * as types from './actions-type';

export function connectRoomSuccessful(roomID, userID, inviteLink) {
    return {
        type: types.ROOM_CONNECTED,
        roomID: roomID,
        userID: userID,
        inviteLink: inviteLink,
    }
}

export function connectFullRoom() {
    return {
        type: types.ROOM_IS_FULL
    }
}

export function connectNonexistenceRoom() {
    return {
        type: types.ROOM_DOESNT_EXIST
    }
}

export function roomCreatedSuccessful(roomID, userID, inviteLink) {
    return {
        type: types.ROOM_CREATED,
        roomID: roomID,
        userID: userID,
        inviteLink: inviteLink,
    }
}

export function leaveUser(roomID, userID) {
    return {
        type: types.OPPONENT_CAME_OUT,
        roomID: roomID,
        userID: userID,
    }
}
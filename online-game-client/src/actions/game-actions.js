import * as types from './actions-type';

export function choseGesture(gesture) {
    return {
        type: types.CHOSE_GESTURE,
        gesture
    }
}

export function getResultOfRound(players) {
    return {
        type: types.RESULT_OF_ROUND,
        players
    }
}

export function startGame(players) {
    return {
        type: types.START_GAME,
        players
    }
}

export function startNewRound(players) {
    return {
        type: types.START_NEW_ROUND,
        players
    }
}

export function leavePlayer(playerID) {
    return {
        type: types.PLAYER_LEAVE,
        playerID
    }
}




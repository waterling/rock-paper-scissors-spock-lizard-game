import SocketActions from "./socket-actions";
import * as Game from "../actions/game-actions"
import store from "../store";


const TIMEOUT_BETWEEN_ROUNDS = 5000;

class GameApi {
    constructor(socket) {
        this.socket = socket;
        this.initGame();
        this.startNewRound = this.startNewRound.bind(this);
    }

    initGame() {
        this.socket.on(SocketActions.START_GAME, data => {
            let players = this._doAssocMassive(this.socket.id, data);
            store.dispatch(
                Game.startGame(players)
            );
        });
        this.socket.on(SocketActions.OPPONENT_CAME_OUT, data => {
            store.dispatch(
                Game.leavePlayer(data.leavedPlayerID)
            );

        });
        this.socket.on(SocketActions.RESULT_OF_ROUND, data => {
            let players = {};

            players[data[0].id] = data[0];
            players[data[1].id] = data[1];
            players = this._doAssocMassive(this.socket.id, players);
            store.dispatch(
                Game.getResultOfRound(players)
            );

            setTimeout(this.startNewRound, TIMEOUT_BETWEEN_ROUNDS, players)

        })
    }

    sendGesture(gesture) {
        this.socket.emit(SocketActions.GESTURE, {gesture: gesture});
        store.dispatch(
            Game.choseGesture(gesture)
        );
    }

    startNewRound(players) {
        store.dispatch(
            Game.startNewRound(this._cleanGestureAndResult(players))
        );
    }

    _cleanGestureAndResult(players) {
        let tempPlayers = players;
        for (let playerID in tempPlayers) {
            if (tempPlayers.hasOwnProperty(playerID)) {
                delete tempPlayers[playerID].gesture;
                delete tempPlayers[playerID].result;
            }
        }
        return tempPlayers;
    }


    _doAssocMassive(currentPlayerID, players) {
        let tempPlayers = {};
        tempPlayers['currentPlayer'] = players[currentPlayerID];
        tempPlayers['opponentPlayer'] = this._findOpponent(currentPlayerID, players);
        return tempPlayers;
    }

    _findOpponent(currentPlayerID, players) {
        for (let playerID in players) {
            if (players.hasOwnProperty(playerID) && playerID !== currentPlayerID) {
                return players[playerID];
            }
        }
    }

}


export default GameApi;


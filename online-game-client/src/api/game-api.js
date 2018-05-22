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
    // инициализируем игру
    initGame() {
        //подписываем на начало игры
        this.socket.on(SocketActions.START_GAME, data => {
            let players = this._doAssocMassive(this.socket.id, data);
            store.dispatch(
                Game.startGame(players)
            );
        });
        //подписываемся на выход игрока
        this.socket.on(SocketActions.OPPONENT_CAME_OUT, data => {
            store.dispatch(
                Game.leavePlayer(data.leavedPlayerID)
            );

        });
        //подписываем на результаты
        this.socket.on(SocketActions.RESULT_OF_ROUND, data => {
            let players = {};

            players[data[0].id] = data[0];
            players[data[1].id] = data[1];
            players = this._doAssocMassive(this.socket.id, players);
            store.dispatch(
                Game.getResultOfRound(players)
            );
            //через заданное время начинает новый раунд
            setTimeout(this.startNewRound, TIMEOUT_BETWEEN_ROUNDS, players)

        });
        //подписываемся на оповещение о том, что оппонент походил
        this.socket.on(SocketActions.OPPONENT_CHOOSE_GESTURE, data => {
            store.dispatch(
                Game.opponentChooseGesture()
            );
        })
    }
    //отправляем выбранный жест
    sendGesture(gesture) {
        this.socket.emit(SocketActions.GESTURE, {gesture: gesture});
        store.dispatch(
            Game.choseGesture(gesture)
        );
    }
    //начинаем новый раунд
    startNewRound(players) {
        store.dispatch(
            Game.startNewRound(this._cleanGestureAndResult(players))
        );
    }
    //удаляем результаты и выбранные жесты
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

    //делаем объект с игроками удобный для использования
    _doAssocMassive(currentPlayerID, players) {
        let tempPlayers = {};
        tempPlayers['currentPlayer'] = players[currentPlayerID];
        tempPlayers['opponentPlayer'] = this._findOpponent(currentPlayerID, players);
        return tempPlayers;
    }

    //находим оппонента текущему игроку
    _findOpponent(currentPlayerID, players) {
        for (let playerID in players) {
            if (players.hasOwnProperty(playerID) && playerID !== currentPlayerID) {
                return players[playerID];
            }
        }
    }

}


export default GameApi;


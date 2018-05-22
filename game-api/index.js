module.exports.Room = class Room {


    constructor(id) {
        this._id = id;
        this._players = {};
    }
    //проверяем пустая ли комната
    isEmpty() {
        for (let i in this._players) {
            if (this._players.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }
    //очищаем от результатов и жестов
    clearResultsAndGestures() {
        for (let i in this._players) {
            if (this._players.hasOwnProperty(i)) {
                this._players[i].clearResult();
                this._players[i].clearGesture();
            }
        }
    }
    //переводим игрока в более удобный вид для клиента
    playersToObject() {
        let tempPlayers = {};
        for (let playerID in this._players) {
            if (this._players.hasOwnProperty(playerID)) {
                tempPlayers[playerID] = this._players[playerID].toObject();
            }
        }
        return tempPlayers;
    }
    //добавляем игрока в комнату
    addPlayer(player) {
        this._players[player.id] = player;
    }
    //считаем количество игроков в комнате
    countOfPlayers() {
        let count = 0;
        for (let i in this._players) {
            if (this._players.hasOwnProperty(i)) {
                count++;
            }
        }
        return count;
    }
    //получаем оппонента текущего игрока
    getAnotherPlayers(player) {
        const playerID = player.id;
        let anotherPlayers = [];
        for (let anotherPlayerId in this._players) {
            if (this._players[anotherPlayerId].id !== playerID) {
                anotherPlayers.push(this._players[anotherPlayerId]);
            }
        }
        return anotherPlayers;
    }
    //достаем пользователя по иду
    getPlayerById(id) {
        return this.players[id];
    }

    get players() {
        return this._players;
    }
    //удаляем пользователя из комнаты
    deletePlayer(player) {
        let tempPlayers = this._players;
        delete tempPlayers[player.id];
        this._changeFields({'_players': tempPlayers});
    }
    //изменяет поля текущего класса
    _changeFields(obj) {
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
};


module.exports.Game = class Game {
    constructor() {
        //таблица с парами
        this.tableOfPairs = require('./tableOfPairs');
    }
    //проверяет, кто выиграл
    checkWhoWin(firstGesture, secondGesture) {
        let result = 'lose';
        let status = "OK";
        if (firstGesture === secondGesture) {
            result = 'tie';
        } else if (this.tableOfPairs[firstGesture]["win"].indexOf(secondGesture) + 1) {
            result = 'win';
        }
        return {status: status, results: [result, Game.doOppositeResult(result)]};
    }
    // получает противоположный результат для проигравшего игрока
    static doOppositeResult(result) {
        let oppositeResult;
        switch (result) {
            case 'lose': {
                oppositeResult = 'win';
                break;
            }
            case 'win': {
                oppositeResult = 'lose';
                break;
            }
            default: {
                oppositeResult = 'tie';
            }
        }
        return oppositeResult
    }
};

module.exports.Player = class Player {

    constructor(name) {
        this._name = name;
        this._result = undefined;
    }

    get gesture() {
        return this._gesture;
    }

    set gesture(value) {
        this._gesture = value;
    }
    //удаляем жест у игрока
    clearGesture() {
        delete this._gesture;
    }
    // удаляем результаты
    clearResult() {
        delete this._result;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }

    //перевод в удобный вид для отправки
    toObject() {
        return {
            name: this._name,
            result: this._result,
            id: this._id,
            gesture: this._gesture
        }
    }
};
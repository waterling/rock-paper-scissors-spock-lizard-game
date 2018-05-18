module.exports.Room = class Room {


    constructor(id) {
        this._id = id;
        this._players = {};
    }

    isEmpty() {
        for (let i in this._players) {
            if (this._players.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    addPlayer(player) {
        this._players[player.id] = player;
    }

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

    getPlayerById(id) {
        return this.players[id];
    }

    get players() {
        return this._players;
    }

    deletePlayer(player) {
        let tempPlayers = this._players;
        delete tempPlayers[player.id];
        this._changeFields({'_players': tempPlayers});
    }

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
        this.tableOfPairs = require('./tableOfPairs');
    }

    /**
     * @return {status, [result]}
     * status: 'OK'
     * result: win - if 1st win, equal - if 1st and 2nd are equals, lose - if 2nd win
     *
     **/
    checkWhoWin(firstGesture, secondGesture) {
        //TODO for n players
        //TODO FIX this code with function doOppositeResult
        let result = 'lose';
        let status = "OK";
        if (firstGesture === secondGesture) {
            result = 'tie';
        } else if (this.tableOfPairs[firstGesture]["win"].indexOf(secondGesture) + 1) {
            result = 'win';
        }
        return {status: status, results: [result, Game.doOppositeResult(result)]};
    }

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
        this._result = 'tie';
    }

    get gesture() {
        return this._gesture;
    }

    set gesture(value) {
        this._gesture = value;
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
};
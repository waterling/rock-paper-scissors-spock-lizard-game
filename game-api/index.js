module.exports.Room = class Room {


    constructor(id) {
        this._id = id;
        this._players = [];
    }

    isEmpty() {
        return !!this._players.length;
    }

    addPlayer(player) {
        this._players[player.id] = player;
    }

    getPlayerById(id) {
        return this.players[id];
    }

    get players() {
        return this._players;
    }

    deletePlayer(player) {
        let tempPlayers = this._players;
        let id = this.getPlayerById(player.id);
        tempPlayers = tempPlayers.slice(id, 1);
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
     * @return {[error, result]}
     * status: 'OK'
     * result: win - if 1st win, equal - if 1st and 2nd are equals, lose - if 2nd win
     *
     **/
    checkWhoWin(firstGesture, secondGesture) {
        //TODO for n players
        //TODO FIX this code
        let result = 'lose';
        let status = "OK";
        if (firstGesture === secondGesture) {
            result = 'tie';
        } else if (this.tableOfPairs[firstGesture]["win"].indexOf(secondGesture) + 1) {
            result = 'win';
        }
        return [status, result];
    }
};

module.exports.Player = class Player {

    constructor(name) {
        this._name = name;
        this._win = false;
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

    get win() {
        return this._win;
    }

    set win(value) {
        this._win = value;
    }
};